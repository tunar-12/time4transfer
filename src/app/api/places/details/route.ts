import { NextResponse } from "next/server";

/**
 * Resolve a Google Places place_id to lat/lng.
 *
 * Called by the client only when it picks a prediction that doesn't already
 * carry coordinates (Google predictions don't, Nominatim and our airport
 * seeds do — those skip this call entirely).
 *
 * Expects a placeId prefixed with "google-". Anything else is rejected so we
 * never accidentally hit Google for an airport seed or an OSM result.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type PlaceDetailsResult = {
  lat: number;
  lng: number;
};

type GooglePlaceDetailsResponse = {
  location?: { latitude: number; longitude: number };
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawId = (url.searchParams.get("placeId") ?? "").trim();

  if (!rawId.startsWith("google-")) {
    return NextResponse.json(
      { error: "placeId must be a Google prediction" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const placeId = rawId.slice("google-".length);
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        // Field mask — request only what we need. Smaller mask = cheaper SKU.
        "X-Goog-FieldMask": "location",
      },
      next: { revalidate: 60 * 60 * 24 * 30 }, // a place's coordinates are stable
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Google Place Details ${res.status}` },
      { status: 502 }
    );
  }

  const data = (await res.json()) as GooglePlaceDetailsResponse;
  if (!data.location) {
    return NextResponse.json({ error: "no location in response" }, { status: 502 });
  }

  return NextResponse.json(
    {
      lat: data.location.latitude,
      lng: data.location.longitude,
    } satisfies PlaceDetailsResult,
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
