"use client";

/**
 * A continuously scrolling row of "airport → district" pairs.
 * Reads like an arrivals board; reinforces the Istanbul-only service area.
 * Pure CSS animation; pauses on hover; respects prefers-reduced-motion.
 */
const ROUTES: { from: "IST" | "SAW"; to: string }[] = [
  { from: "IST", to: "Taksim" },
  { from: "IST", to: "Sultanahmet" },
  { from: "IST", to: "Beşiktaş" },
  { from: "IST", to: "Levent" },
  { from: "IST", to: "Şişli" },
  { from: "SAW", to: "Kadıköy" },
  { from: "SAW", to: "Sultanahmet" },
  { from: "SAW", to: "Taksim" },
  { from: "SAW", to: "Üsküdar" },
  { from: "SAW", to: "Ataşehir" },
];

export function AirportMarquee() {
  // Duplicate so the translate-x animation loops seamlessly
  const items = [...ROUTES, ...ROUTES];

  return (
    <div
      className="relative isolate overflow-hidden border-y border-white/[0.05] bg-charcoal/40 py-4 backdrop-blur-sm"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-charcoal to-transparent" />

      <div className="marquee flex w-max items-center gap-10">
        {items.map((r, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] whitespace-nowrap"
          >
            <span className="font-display text-base text-gold-soft">{r.from}</span>
            <Arrow />
            <span className="text-bone/65">{r.to}</span>
            <Dot />
          </span>
        ))}
      </div>

      <style>{`
        .marquee {
          animation: marquee 42s linear infinite;
        }
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 8"
      className="h-2 w-4 text-gold/60"
      aria-hidden
    >
      <path
        d="M1 4H14M14 4L10 1M14 4L10 7"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-gold/40"
    />
  );
}
