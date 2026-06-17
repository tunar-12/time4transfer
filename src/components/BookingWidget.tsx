"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  Navigation2,
  CalendarClock,
  Users,
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HandCoins,
  Map as MapIcon,
  Sparkles,
  AlertCircle,
  Plane,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Field, FieldSelect } from "./ui/Field";
import { PlaceAutocomplete } from "./PlaceAutocomplete";
import type { PlaceResult } from "@/app/api/places/route";
import { whatsappUrl } from "./WhatsAppFAB";
import { cn, formatPrice } from "@/lib/utils";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-sm text-bone/50">
      <span className="inline-flex items-center gap-2">
        <MapIcon className="h-4 w-4 animate-pulse" />
        Loading map…
      </span>
    </div>
  ),
});

// ─── Pricing model ───────────────────────────────────────────────────────────
// Fixed flat rates per (airport, vehicle). All prices in USD.
// Update these two places to change a tariff: this table + messages/*.json.
type VehicleKey =
  | "vitoStandard"
  | "vitoPremium"
  | "sprinterStandard"
  | "sprinterPremium";

const VEHICLES: { key: VehicleKey; capacity: number; ist: number; saw: number }[] = [
  { key: "vitoStandard",     capacity: 6,  ist: 60,  saw: 70 },
  { key: "vitoPremium",      capacity: 4,  ist: 80,  saw: 90 },
  { key: "sprinterStandard", capacity: 12, ist: 90,  saw: 100 },
  { key: "sprinterPremium",  capacity: 12, ist: 120, saw: 130 },
];

const VEHICLE_BY_KEY = Object.fromEntries(VEHICLES.map((v) => [v.key, v])) as Record<
  VehicleKey,
  (typeof VEHICLES)[number]
>;

type Airport = "IST" | "SAW";

/**
 * The only two pickup points we service. Kept here client-side so the map
 * and quote step have coordinates without an autocomplete round-trip.
 */
const AIRPORTS: Record<Airport, { label: string; short: string; sub: string; lat: number; lng: number }> = {
  IST: {
    label: "Istanbul Airport",
    short: "IST",
    sub: "Arnavutköy",
    lat: 41.2753,
    lng: 28.7519,
  },
  SAW: {
    label: "Sabiha Gökçen Airport",
    short: "SAW",
    sub: "Pendik",
    lat: 40.8986,
    lng: 29.3092,
  },
};

function priceFor(vehicle: VehicleKey, airport: Airport | null): number | null {
  if (!airport) return null;
  const v = VEHICLE_BY_KEY[vehicle];
  return airport === "IST" ? v.ist : v.saw;
}

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.25);
}

type Step = "trip" | "quote" | "details" | "success";

export function BookingWidget() {
  const t = useTranslations("booking");
  const tv = useTranslations("vehicles");

  const [step, setStep] = useState<Step>("trip");
  const [pickupAirport, setPickupAirport] = useState<Airport | null>(null);
  const [toText, setToText] = useState("");
  const [dropoff, setDropoff] = useState<PlaceResult | null>(null);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [vehicle, setVehicle] = useState<VehicleKey>("vitoStandard");
  const [contact, setContact] = useState({
    whatsappNumber: "",
    email: "",
    flight: "",
  });
  // One first/last pair per passenger. Always kept in sync with `passengers`
  // by the effect below so the form mirrors the booking size.
  type PassengerName = { firstName: string; lastName: string };
  const [passengerNames, setPassengerNames] = useState<PassengerName[]>([
    { firstName: "", lastName: "" },
    { firstName: "", lastName: "" },
  ]);
  // Track whether the user has tried to submit — surface required-field errors
  // only after that first attempt so the form doesn't yell at them upfront.
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Keep the passenger-names array length === selected passenger count.
  // Existing entries are preserved when expanding; extras are trimmed when
  // shrinking. The user's already-typed names survive a count change.
  useEffect(() => {
    const n = Math.max(1, parseInt(passengers, 10) || 1);
    setPassengerNames((prev) => {
      if (prev.length === n) return prev;
      if (prev.length < n) {
        return [
          ...prev,
          ...Array.from({ length: n - prev.length }, () => ({
            firstName: "",
            lastName: "",
          })),
        ];
      }
      return prev.slice(0, n);
    });
  }, [passengers]);

  function updatePassenger(idx: number, patch: Partial<PassengerName>) {
    setPassengerNames((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, ...patch } : p))
    );
  }

  const pickupCoords: [number, number] | null = pickupAirport
    ? [AIRPORTS[pickupAirport].lat, AIRPORTS[pickupAirport].lng]
    : null;
  const dropoffCoords: [number, number] | null =
    dropoff?.lat != null && dropoff.lng != null ? [dropoff.lat, dropoff.lng] : null;

  const pickupLabel = pickupAirport
    ? `${AIRPORTS[pickupAirport].label} (${pickupAirport})`
    : null;

  const distanceKm = useMemo(
    () => (pickupCoords && dropoffCoords ? haversineKm(pickupCoords, dropoffCoords) : null),
    [pickupCoords, dropoffCoords]
  );
  const durationMin = useMemo(
    () => (distanceKm != null ? Math.max(20, Math.round((distanceKm / 60) * 60)) : null),
    [distanceKm]
  );
  const price = priceFor(vehicle, pickupAirport);
  const capacityExceeded = parseInt(passengers, 10) > VEHICLE_BY_KEY[vehicle].capacity;

  // Validation: capacity is the only inline warning now — pickup is always one
  // of our two airports so there's no "out of service area" case.
  const validation: { message: string } | null = capacityExceeded
    ? { message: t("capacityWarn") }
    : null;

  const canSeePrices =
    !!pickupAirport && !!dropoff && !!date && !capacityExceeded;

  function resetAll() {
    setStep("trip");
    setPickupAirport(null);
    setToText("");
    setDropoff(null);
    setDate("");
    setContact({ whatsappNumber: "", email: "", flight: "" });
    setPassengerNames(
      Array.from(
        { length: Math.max(1, parseInt(passengers, 10) || 1) },
        () => ({ firstName: "", lastName: "" })
      )
    );
    setAttemptedSubmit(false);
  }

  // Required-field validation for the contact step
  const passengerNamesValid = passengerNames.every(
    (p) => p.firstName.trim().length > 0 && p.lastName.trim().length > 0
  );
  // Loose phone validation: at least 7 digits anywhere in the string.
  // We're forwarding to a human via WhatsApp — no need for strict E.164 here.
  const whatsappDigits = contact.whatsappNumber.replace(/\D/g, "");
  const requiredFields = {
    passengers: passengerNamesValid,
    whatsappNumber: whatsappDigits.length >= 7,
    email: /.+@.+\..+/.test(contact.email.trim()),
    flight: contact.flight.trim().length > 0,
  };
  const detailsValid = Object.values(requiredFields).every(Boolean);

  /**
   * Format a localised WhatsApp message from the booking state and open
   * wa.me/{number}?text=... in a new tab. No backend, no DB — the entire
   * booking lives in this URL until our dispatch team replies.
   */
  function submitToWhatsApp() {
    if (!detailsValid) {
      setAttemptedSubmit(true);
      return;
    }
    const datetime = new Date(date).toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
    // Build a numbered list: "1. First Last\n2. First Last\n…"
    const passengerList = passengerNames
      .map(
        (p, i) =>
          `${i + 1}. ${p.firstName.trim()} ${p.lastName.trim()}`.trimEnd()
      )
      .join("\n");

    const message = t("whatsappTemplate", {
      pickup: pickupLabel ?? "—",
      dropoff: dropoff?.label ?? "—",
      datetime,
      passengers: `${passengers} ${parseInt(passengers, 10) === 1 ? t("passenger") : t("passengersPlural")}`,
      vehicle: tv(`${vehicle}.name`),
      price: price != null ? formatPrice(price) : "—",
      passengerList,
      whatsappNumber: contact.whatsappNumber.trim(),
      email: contact.email.trim(),
      flight: contact.flight.trim(),
    });
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    setStep("success");
  }

  return (
    <div className="relative w-full max-w-[640px] min-w-0 rounded-3xl glass-dark p-3 sm:p-4 shadow-elevated">
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gold/15" />

      <div className="relative">
        <Header step={step} />

        <AnimatePresence mode="wait">
          {step === "trip" && (
            <motion.div
              key="trip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 grid gap-3"
            >
              <AirportPicker
                label={t("from")}
                value={pickupAirport}
                onChange={setPickupAirport}
              />

              <PlaceAutocomplete
                icon={<Navigation2 className="h-3.5 w-3.5" />}
                label={t("to")}
                placeholder={t("toPlaceholder")}
                value={toText}
                onTextChange={setToText}
                selected={dropoff}
                onSelect={setDropoff}
              />

              <Field
                icon={<CalendarClock className="h-3.5 w-3.5" />}
                label={t("date")}
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <FieldSelect
                  icon={<Users className="h-3.5 w-3.5" />}
                  label={t("passengers")}
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? t("passenger") : t("passengersPlural")}
                    </option>
                  ))}
                </FieldSelect>
                <FieldSelect
                  icon={<Car className="h-3.5 w-3.5" />}
                  label={t("vehicle")}
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value as VehicleKey)}
                >
                  {VEHICLES.map((v) => (
                    <option key={v.key} value={v.key}>
                      {tv(`${v.key}.name`)} · max {v.capacity}
                    </option>
                  ))}
                </FieldSelect>
              </div>

              {validation ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold-soft"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{validation.message}</span>
                </div>
              ) : null}

              <Button
                size="lg"
                className="mt-1 w-full"
                disabled={!canSeePrices}
                onClick={() => setStep("quote")}
              >
                <Sparkles className="h-4 w-4" />
                {t("search")}
              </Button>
            </motion.div>
          )}

          {step === "quote" && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="grid gap-3">
                <RouteLine pickup={pickupLabel ?? undefined} dropoff={dropoff?.label} />
                <QuoteCard
                  vehicleName={tv(`${vehicle}.name`)}
                  vehicleTag={tv(`${vehicle}.tag`)}
                  price={price}
                  airport={pickupAirport}
                  distanceKm={distanceKm}
                  durationMin={durationMin}
                  estimateLabel={t("estimate")}
                  noteLabel={t("estimateNote")}
                  distLabel={t("distance")}
                  durLabel={t("duration")}
                  kmLabel={t("km")}
                  minLabel={t("min")}
                />
                <VehicleSwitcher
                  current={vehicle}
                  airport={pickupAirport}
                  passengers={parseInt(passengers, 10)}
                  onPick={setVehicle}
                  nameFor={(k) => tv(`${k}.name`)}
                />
                <PayToDriverNotice
                  heading={t("payToDriverHeading")}
                  note={t("payToDriverNote")}
                />
                <div className="flex items-center gap-2">
                  <Button variant="outlineLight" size="md" onClick={() => setStep("trip")}>
                    <ArrowLeft className="h-4 w-4" /> {t("back")}
                  </Button>
                  <Button size="md" className="flex-1" onClick={() => setStep("details")}>
                    {t("continue")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="h-[320px] lg:h-auto">
                <RouteMap pickup={pickupCoords} dropoff={dropoffCoords} />
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 grid gap-3"
            >
              <RouteLine pickup={pickupLabel ?? undefined} dropoff={dropoff?.label} compact />

              <div className="grid gap-3">
                <p className="px-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone/55">
                  {t("passengerDetails")}
                </p>

                <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {passengerNames.map((p, idx) => {
                    const firstInvalid =
                      attemptedSubmit && !p.firstName.trim();
                    const lastInvalid =
                      attemptedSubmit && !p.lastName.trim();
                    return (
                      <div key={idx} className="grid gap-2">
                        <p className="px-1 text-[11px] text-gold-soft/85 tracking-[0.04em]">
                          {t("passengerN", { n: idx + 1 })}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field
                            label={`${t("firstName")} *`}
                            required
                            placeholder={t("firstName")}
                            value={p.firstName}
                            onChange={(e) =>
                              updatePassenger(idx, { firstName: e.target.value })
                            }
                            aria-invalid={firstInvalid}
                            hint={
                              firstInvalid ? (
                                <span className="text-rose-300/90">
                                  {t("fieldRequired")}
                                </span>
                              ) : null
                            }
                          />
                          <Field
                            label={`${t("lastName")} *`}
                            required
                            placeholder={t("lastName")}
                            value={p.lastName}
                            onChange={(e) =>
                              updatePassenger(idx, { lastName: e.target.value })
                            }
                            aria-invalid={lastInvalid}
                            hint={
                              lastInvalid ? (
                                <span className="text-rose-300/90">
                                  {t("fieldRequired")}
                                </span>
                              ) : null
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  icon={<MessageCircle className="h-3.5 w-3.5" />}
                  label={`${t("whatsappNumber")} *`}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+90 5xx xxx xx xx"
                  value={contact.whatsappNumber}
                  onChange={(e) =>
                    setContact({ ...contact, whatsappNumber: e.target.value })
                  }
                  aria-invalid={attemptedSubmit && !requiredFields.whatsappNumber}
                  hint={
                    attemptedSubmit && !requiredFields.whatsappNumber ? (
                      <span className="text-rose-300/90">{t("fieldRequired")}</span>
                    ) : (
                      <span>{t("whatsappHint")}</span>
                    )
                  }
                />
                <Field
                  label="Email *"
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                  aria-invalid={attemptedSubmit && !requiredFields.email}
                  hint={
                    attemptedSubmit && !requiredFields.email ? (
                      <span className="text-rose-300/90">{t("fieldRequired")}</span>
                    ) : null
                  }
                />
              </div>

              <Field
                icon={<Plane className="h-3.5 w-3.5" />}
                label={`${t("flightNumber")} *`}
                required
                placeholder="TK1980"
                value={contact.flight}
                onChange={(e) =>
                  setContact({ ...contact, flight: e.target.value })
                }
                aria-invalid={attemptedSubmit && !requiredFields.flight}
                hint={
                  attemptedSubmit && !requiredFields.flight ? (
                    <span className="text-rose-300/90">{t("fieldRequired")}</span>
                  ) : null
                }
              />

              <p className="text-[11px] text-bone/45 px-1">{t("submitNote")}</p>

              <div className="flex items-center gap-2">
                <Button variant="outlineLight" size="md" onClick={() => setStep("quote")}>
                  <ArrowLeft className="h-4 w-4" /> {t("back")}
                </Button>
                <Button size="md" className="flex-1" onClick={submitToWhatsApp}>
                  <WhatsAppMark />
                  {t("submitWhatsApp")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 grid place-items-center gap-4 py-10 text-center"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold-soft">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-bone tracking-[-0.02em] text-balance">{t("successTitle")}</h3>
                <p className="mt-2 max-w-sm text-sm text-bone/65 text-pretty leading-[1.55]">{t("successBody")}</p>
              </div>
              <Button variant="outlineLight" size="md" onClick={resetAll}>
                {t("newBooking")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ step }: { step: Step }) {
  const t = useTranslations("booking");
  const steps: Step[] = ["trip", "quote", "details", "success"];
  const idx = steps.indexOf(step);

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <div>
        <p className="font-display text-xl text-bone tracking-[-0.02em]">{t("title")}</p>
        <p className="text-xs text-bone/55 text-pretty">{t("subtitle")}</p>
      </div>
      <div className="flex items-center gap-1">
        {steps.slice(0, 3).map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i < idx ? "w-6 bg-gold" : i === idx ? "w-8 bg-gold" : "w-4 bg-bone/15"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function RouteLine({
  pickup,
  dropoff,
  compact = false,
}: {
  pickup?: string;
  dropoff?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03]",
        compact ? "px-3 py-2" : "px-4 py-3"
      )}
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <span className="h-2 w-2 rounded-full bg-gold-soft shrink-0" />
        <span className="truncate text-sm text-bone/85">{pickup ?? "—"}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-bone/40 shrink-0" />
      <div className="flex flex-1 items-center gap-3 min-w-0 justify-end">
        <span className="truncate text-sm text-bone/85 text-right">{dropoff ?? "—"}</span>
        <span className="h-2 w-2 rounded-full bg-gold shrink-0" />
      </div>
    </div>
  );
}

function QuoteCard({
  vehicleName,
  vehicleTag,
  price,
  airport,
  distanceKm,
  durationMin,
  estimateLabel,
  noteLabel,
  distLabel,
  durLabel,
  kmLabel,
  minLabel,
}: {
  vehicleName: string;
  vehicleTag: string;
  price: number | null;
  airport: Airport | null;
  distanceKm: number | null;
  durationMin: number | null;
  estimateLabel: string;
  noteLabel: string;
  distLabel: string;
  durLabel: string;
  kmLabel: string;
  minLabel: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] via-transparent to-transparent p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-bone/45">
            {estimateLabel}
            {airport ? <span className="ml-2 text-gold-soft/80 tabular">· {airport}</span> : null}
          </p>
          <p className="mt-1 font-display text-[40px] leading-none text-bone tracking-[-0.03em] tabular">
            {price != null ? formatPrice(price) : "—"}
          </p>
          <p className="mt-3 text-sm text-bone/70">{vehicleName}</p>
          <p className="text-xs text-bone/45">{vehicleTag}</p>
        </div>
        <div className="grid gap-1 text-right text-xs text-bone/55">
          <div>
            <span className="block uppercase tracking-[0.12em] text-bone/35 text-[10px]">{distLabel}</span>
            <span className="text-bone/80 tabular">
              {distanceKm != null ? `${distanceKm} ${kmLabel}` : "—"}
            </span>
          </div>
          <div className="mt-1">
            <span className="block uppercase tracking-[0.12em] text-bone/35 text-[10px]">{durLabel}</span>
            <span className="text-bone/80 tabular">
              {durationMin != null ? `${durationMin} ${minLabel}` : "—"}
            </span>
          </div>
        </div>
      </div>
      <p className="relative mt-4 text-[11px] text-bone/40">{noteLabel}</p>
    </div>
  );
}

function VehicleSwitcher({
  current,
  airport,
  passengers,
  onPick,
  nameFor,
}: {
  current: VehicleKey;
  airport: Airport | null;
  passengers: number;
  onPick: (k: VehicleKey) => void;
  nameFor: (k: VehicleKey) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {VEHICLES.map((v) => {
        const active = v.key === current;
        const fits = passengers <= v.capacity;
        const p = airport === "IST" ? v.ist : airport === "SAW" ? v.saw : null;
        return (
          <button
            key={v.key}
            type="button"
            disabled={!fits}
            onClick={() => onPick(v.key)}
            className={cn(
              "group flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200",
              active
                ? "border-gold/60 bg-gold/10"
                : "border-white/[0.07] bg-white/[0.03] hover:border-white/15",
              !fits && "opacity-40 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-[0.14em] tabular",
                active ? "text-gold-soft" : "text-bone/45"
              )}
            >
              max {v.capacity}
            </span>
            <span className="text-xs leading-tight text-bone/90 text-balance">{nameFor(v.key)}</span>
            <span
              className={cn(
                "font-display text-sm tabular",
                active ? "text-gold-soft" : "text-bone/75"
              )}
            >
              {p != null ? formatPrice(p) : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Pickup airport segmented control. Pickup is constrained to IST or SAW —
 * those are the only origins we service — so a free-text autocomplete would
 * be misleading. Two prominent tiles, keyboard-navigable.
 */
function AirportPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Airport | null;
  onChange: (a: Airport) => void;
}) {
  const options: Airport[] = ["IST", "SAW"];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-bone/55">
        <Plane className="h-3.5 w-3.5 text-gold-soft/80" />
        {label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((code) => {
          const a = AIRPORTS[code];
          const active = value === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              aria-pressed={active}
              className={cn(
                "group relative flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                active
                  ? "border-gold/60 bg-gold/[0.10] shadow-[inset_0_0_0_1px_rgba(202,138,4,0.25)]"
                  : "border-white/[0.07] bg-white/[0.03] hover:border-white/15"
              )}
            >
              <span
                className={cn(
                  "font-display text-2xl tabular tracking-[-0.02em] transition-colors",
                  active ? "text-gold-soft" : "text-bone/85"
                )}
              >
                {a.short}
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-bone truncate">{a.label}</span>
                <span className="block text-[11px] text-bone/45 uppercase tracking-[0.14em]">
                  {a.sub}
                </span>
              </span>
              {active ? (
                <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-gold-soft" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Pay-to-driver info banner. Replaces the old PayChoice toggle now that
 * online payment is not offered.
 */
function PayToDriverNotice({ heading, note }: { heading: string; note: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.08] px-4 py-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-soft">
        <HandCoins className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-bone">{heading}</p>
        <p className="mt-0.5 text-xs text-bone/55 leading-[1.55]">{note}</p>
      </div>
    </div>
  );
}

/** Small WhatsApp glyph for the submit button. */
function WhatsAppMark() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M16.04 4C9.39 4 4 9.38 4 16.02c0 2.6.83 5.02 2.25 6.99L4 28l5.16-2.21a12 12 0 0 0 6.88 2.15h.01c6.65 0 12.04-5.38 12.04-12.02 0-3.21-1.25-6.23-3.52-8.5A12 12 0 0 0 16.04 4Zm5.5 14.43c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.89-.79-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.42.25-.7.25-1.3.18-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
