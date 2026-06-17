"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

type VehicleKey =
  | "vitoStandard"
  | "vitoPremium"
  | "sprinterStandard"
  | "sprinterPremium";

type FleetItem = {
  key: VehicleKey;
  span: string;
  art: React.ReactNode;
  tone: "dark" | "light" | "gold";
  badge?: string;
};

/**
 * Interior photo references — user-supplied source pages. To swap a placeholder
 * for a real photo:
 *   1. Save the .jpg into /public/fleet/<key>.jpg
 *   2. The card picks it up automatically; if missing, the SVG illustration
 *      stays visible as the fallback.
 * The `sourceRef` URL is also written to a `data-source-ref` attribute on each
 * <img> so you can re-find the original page from devtools later.
 */
const PHOTO_SOURCES: Record<VehicleKey, { src: string; sourceRef: string }> = {
  vitoStandard: {
    src: "/fleet/vito-standard.jpg",
    sourceRef:
      "https://tr.motor1.com/news/441362/guncellenen-mercedes-benz-vito-tourer-turkiyede/",
  },
  vitoPremium: {
    src: "/fleet/vito-premium.jpg",
    sourceRef: "https://www.pinterest.com/pin/45247171250008021/",
  },
  sprinterPremium: {
    src: "/fleet/sprinter-premium.jpg",
    sourceRef: "https://www.pinterest.com/pin/651333164897538414/",
  },
  sprinterStandard: {
    src: "/fleet/sprinter-standard.jpg",
    sourceRef: "https://www.pinterest.com/pin/9570217952811305/",
  },
};

/**
 * Interior photo with onError fallback. If the file at /fleet/<key>.jpg is
 * missing (the default until you drop your photos in), the <img> hides itself
 * and the SVG illustration that sits behind it remains visible. This keeps
 * the design intact during photo asset turnaround.
 */
function InteriorPhoto({
  vehicleKey,
  alt,
  className,
}: {
  vehicleKey: VehicleKey;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const { src, sourceRef } = PHOTO_SOURCES[vehicleKey];
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      data-source-ref={sourceRef}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function FleetGrid() {
  const t = useTranslations("vehicles");

  const items: FleetItem[] = [
    { key: "vitoPremium",      span: "lg:col-span-2 lg:row-span-2", tone: "gold",  art: <VanArt />,    badge: "Signature" },
    { key: "sprinterPremium",  span: "lg:col-span-2",                tone: "dark",  art: <SprinterArt /> },
    { key: "vitoStandard",     span: "",                             tone: "light", art: <VanArt /> },
    { key: "sprinterStandard", span: "",                             tone: "light", art: <SprinterArt /> },
  ];

  return (
    <section id="fleet" className="relative bg-bone py-16 sm:py-20 lg:py-24 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Fleet</p>
          <h2 className="font-display text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em]">
            Four Mercedes, one promise.
          </h2>
          <p className="mt-4 text-stone text-pretty max-w-xl leading-[1.55]">
            Pick the cabin that fits your party. Every fare is fixed — the
            number you see here is the number you pay.
          </p>
        </header>

        <div className="mt-12 grid auto-rows-[minmax(360px,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const fromIst = t.raw(`${it.key}.fromIst`) as number;
            const isLight = it.tone === "light";
            const isGold = it.tone === "gold";
            return (
              <motion.article
                key={it.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                className={[
                  "group relative flex flex-col overflow-hidden rounded-3xl border",
                  it.span,
                  isGold
                    ? "bg-gradient-to-br from-charcoal via-charcoal to-stone text-bone border-gold/20"
                    : it.tone === "dark"
                    ? "bg-charcoal text-bone border-white/5"
                    : "bg-white text-ink border-ink/[0.06]",
                ].join(" ")}
              >
                {/* ─── Photo region (top of card) ──────────────────────── */}
                <div
                  className={[
                    "relative w-full shrink-0 overflow-hidden",
                    // Gold 2×2 card gets a taller photo since the card is taller
                    isGold ? "h-[58%] min-h-[260px]" : "h-44 sm:h-48",
                  ].join(" ")}
                >
                  {/* SVG fallback — sits behind the photo. Shown when photo 404s. */}
                  <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-70">
                    {it.art}
                  </div>
                  <InteriorPhoto
                    vehicleKey={it.key}
                    alt={`${t(`${it.key}.name`)} interior`}
                    className="relative h-full w-full object-cover"
                  />
                  {/* Subtle bottom fade so the seam into the text panel is soft */}
                  <div
                    aria-hidden
                    className={[
                      "pointer-events-none absolute inset-x-0 bottom-0 h-12",
                      isLight
                        ? "bg-gradient-to-t from-white to-transparent"
                        : isGold
                        ? "bg-gradient-to-t from-charcoal to-transparent"
                        : "bg-gradient-to-t from-charcoal to-transparent",
                    ].join(" ")}
                  />
                  {it.badge ? (
                    <span className="absolute top-3 right-3 rounded-full border border-gold/40 bg-charcoal/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-soft backdrop-blur-sm">
                      {it.badge}
                    </span>
                  ) : null}
                </div>

                {/* ─── Text content (bottom of card) ───────────────────── */}
                <div className="relative z-10 flex flex-1 flex-col justify-between gap-4 p-6">
                  <div>
                    <h3
                      className={[
                        "font-display text-2xl tracking-[-0.02em]",
                        isGold && "lg:text-3xl",
                        isLight ? "text-ink" : "text-bone",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {t(`${it.key}.name`)}
                    </h3>
                    <p
                      className={[
                        "mt-1 text-[11px] uppercase tracking-[0.14em]",
                        isLight ? "text-stone" : "text-bone/55",
                      ].join(" ")}
                    >
                      {t(`${it.key}.tag`)}
                    </p>
                    {/* Blurb only on the larger gold card to keep small cards clean */}
                    {isGold ? (
                      <p className="mt-3 text-sm leading-[1.55] text-bone/65 text-pretty">
                        {t(`${it.key}.blurb`)}
                      </p>
                    ) : null}
                  </div>

                  <div
                    className={[
                      "inline-flex items-baseline gap-2",
                      isLight ? "text-ink" : "text-bone",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-[10px] uppercase tracking-[0.18em]",
                        isLight ? "text-stone" : "text-bone/55",
                      ].join(" ")}
                    >
                      From IST
                    </span>
                    <span className="font-display text-2xl text-gold-soft tabular">
                      {formatPrice(fromIst)}
                    </span>
                  </div>
                </div>

                {isGold ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl"
                  />
                ) : null}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Stylised inline SVG illustrations — no raster assets. */

function VanArt() {
  return (
    <svg viewBox="0 0 380 160" className="h-auto w-[72%] max-w-[420px]" aria-hidden>
      <defs>
        <linearGradient id="van" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <path
        d="M30 110 L 30 55 Q 30 40 45 38 L 240 38 Q 270 38 290 60 L 340 90 Q 355 95 355 110 L 355 130 Q 355 135 350 135 L 35 135 Q 30 135 30 130 Z"
        fill="none"
        stroke="url(#van)"
        strokeWidth="2.2"
      />
      <path d="M55 75 L 240 75 L 285 95" stroke="url(#van)" strokeWidth="1.5" opacity="0.6" fill="none" />
      <line x1="120" y1="38" x2="120" y2="75" stroke="url(#van)" strokeWidth="1.5" opacity="0.5" />
      <line x1="190" y1="38" x2="190" y2="75" stroke="url(#van)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="135" r="14" fill="#0c0a09" stroke="url(#van)" strokeWidth="2.2" />
      <circle cx="290" cy="135" r="14" fill="#0c0a09" stroke="url(#van)" strokeWidth="2.2" />
    </svg>
  );
}

function SprinterArt() {
  return (
    <svg viewBox="0 0 380 140" className="h-auto w-[78%] max-w-[420px]" aria-hidden>
      <defs>
        <linearGradient id="sprinter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Body — taller than the Vito */}
      <path
        d="M25 110 L 25 35 Q 25 22 38 22 L 300 22 Q 325 22 340 42 L 355 75 Q 360 80 360 92 L 360 115 Q 360 120 355 120 L 30 120 Q 25 120 25 115 Z"
        fill="none"
        stroke="url(#sprinter)"
        strokeWidth="2"
      />
      {/* Cab window */}
      <path d="M295 35 L 320 35 Q 330 35 335 55 L 295 55 Z" fill="none" stroke="url(#sprinter)" strokeWidth="1.4" opacity="0.7" />
      {/* Passenger windows — 5 along the side */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x={50 + i * 46}
          y="35"
          width="36"
          height="20"
          rx="3"
          fill="none"
          stroke="url(#sprinter)"
          strokeWidth="1.2"
          opacity="0.55"
        />
      ))}
      <circle cx="90" cy="120" r="12" fill="#0c0a09" stroke="url(#sprinter)" strokeWidth="2" />
      <circle cx="310" cy="120" r="12" fill="#0c0a09" stroke="url(#sprinter)" strokeWidth="2" />
    </svg>
  );
}
