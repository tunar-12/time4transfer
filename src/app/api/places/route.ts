import { NextResponse } from "next/server";

/**
 * Place-search proxy.
 *
 * Provider order:
 *  1. Google Places API (New) — if process.env.GOOGLE_PLACES_API_KEY is set.
 *     Predictions are returned without lat/lng; the client should call
 *     /api/places/details?placeId=... to resolve coordinates only for the
 *     prediction the user actually picks. This keeps the per-search cost at
 *     1 Autocomplete request + 1 Place Details request per booking.
 *  2. OpenStreetMap Nominatim — used as a free fallback when no Google key
 *     is configured. Nominatim returns lat/lng inline, so the client can
 *     skip the details round-trip.
 *
 * Airport seeds (IST, SAW) are always injected at the top — these are the
 * two destinations we actually price.
 *
 * Setup for Google:
 *   1. https://console.cloud.google.com → enable "Places API (New)"
 *   2. Create an API key, restrict to the Places API
 *   3. Drop the key into .env.local as GOOGLE_PLACES_API_KEY=...
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "time4transfer/1.0 (https://time4transfer.example; hello@time4transfer.example)";

const ISTANBUL_BIAS = {
  // Google caps circle.radius at 50,000 m. Istanbul is ~100 km tip-to-tip, so
  // a single circle from the city centre doesn't cover both IST and SAW, but
  // it's a *bias* not a hard filter — results outside still surface, just
  // ranked lower. Centred on the European side as the demand centre.
  circle: {
    center: { latitude: 41.015, longitude: 28.98 },
    radius: 50000,
  },
};

type AirportSeed = {
  iata: string;
  label: string;
  context: string;
  aliases: string[];
  lat: number;
  lng: number;
};

const AIRPORT_SEEDS: AirportSeed[] = [
  { iata: "IST", label: "Istanbul Airport (IST)", context: "Arnavutköy, Istanbul, Türkiye",
    aliases: ["istanbul airport", "istanbul havalimani", "ist", "yeni havalimani"],
    lat: 41.2753, lng: 28.7519 },
  { iata: "SAW", label: "Sabiha Gökçen Airport (SAW)", context: "Pendik, Istanbul, Türkiye",
    aliases: ["sabiha gokcen", "sabiha gökçen", "saw", "pendik airport", "sabiha"],
    lat: 40.8986, lng: 29.3092 },
];

export type PlaceResult = {
  id: string;
  label: string;
  context: string;
  /** Coordinates. Optional — Google predictions need a details lookup to resolve. */
  lat?: number;
  lng?: number;
};

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function matchAirports(query: string): PlaceResult[] {
  const q = normalize(query);
  if (!q) return [];
  return AIRPORT_SEEDS.filter((a) =>
    a.aliases.some((al) => normalize(al).includes(q) || q.includes(normalize(al))) ||
    normalize(a.label).includes(q) ||
    a.iata.toLowerCase() === q
  ).map((a) => ({
    id: `airport-${a.iata}`,
    label: a.label,
    context: a.context,
    lat: a.lat,
    lng: a.lng,
  }));
}

// ─── Google Places (New) ─────────────────────────────────────────────────────

type GoogleAutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId: string;
      text?: { text: string };
      structuredFormat?: {
        mainText?: { text: string };
        secondaryText?: { text: string };
      };
    };
  }>;
};

async function searchGoogle(q: string, apiKey: string): Promise<PlaceResult[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input: q,
      includedRegionCodes: ["tr"],
      locationBias: ISTANBUL_BIAS,
      languageCode: "en",
    }),
    // 1h cache per identical query — Google's predictions for the same string
    // don't change minute-to-minute.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // Surface Google's actual error in the server log for diagnosis.
    // Common cases: "Places API (New)" not enabled on the project, the key
    // has an HTTP-referrer restriction that blocks server-side calls, or
    // the project doesn't have billing enabled.
    console.error("[places] Google autocomplete failed", res.status, body.slice(0, 500));
    throw new Error(`Google Places autocomplete ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as GoogleAutocompleteResponse;
  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      id: `google-${p.placeId}`,
      label: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      context: p.structuredFormat?.secondaryText?.text ?? "",
      // lat/lng intentionally omitted — resolved via /api/places/details on pick
    }));
}

// ─── Nominatim (fallback) ────────────────────────────────────────────────────

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    aerodrome?: string;
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    village?: string;
    town?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
  };
};

function pickNominatimLabel(item: NominatimItem) {
  const a = item.address ?? {};
  const parts = item.display_name.split(",").map((s) => s.trim());
  const street =
    a.house_number && a.road ? `${a.house_number} ${a.road}` : undefined;
  const label =
    a.aerodrome ??
    street ??
    a.road ??
    a.neighbourhood ??
    a.suburb ??
    a.village ??
    a.town ??
    a.city ??
    parts[0];
  const contextParts = [
    a.suburb,
    a.district,
    a.city ?? a.town ?? a.village,
    a.state,
    a.country,
  ].filter(Boolean) as string[];
  const context = Array.from(
    new Set(contextParts.filter((p) => p !== label))
  ).join(", ");
  return { label: String(label), context };
}

async function searchNominatim(q: string): Promise<PlaceResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("countrycodes", "tr");
  url.searchParams.set("limit", "8");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "en");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": UA, Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const data = (await res.json()) as NominatimItem[];
  return data.map((item) => {
    const { label, context } = pickNominatimLabel(item);
    return {
      id: String(item.place_id),
      label,
      context,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
  });
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] satisfies PlaceResult[] });
  }

  const googleKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const providerResults = googleKey
      ? await searchGoogle(q, googleKey)
      : await searchNominatim(q);

    const airportMatches = matchAirports(q);
    const seen = new Set(airportMatches.map((r) => r.label.toLowerCase()));
    const merged = [
      ...airportMatches,
      ...providerResults.filter((r) => !seen.has(r.label.toLowerCase())),
    ].slice(0, 10);

    return NextResponse.json(
      { results: merged },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message, results: [] },
      { status: 500 }
    );
  }
}
