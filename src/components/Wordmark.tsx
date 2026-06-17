import { cn } from "@/lib/utils";

/**
 * "time4transfer" wordmark.
 *
 * Typographic system:
 *   - "time" + "transfer"  → Inter, semibold, tight tracking, lowercase
 *   - "4"                  → Fraunces italic (SOFT axis) — the brand accent,
 *                            rendered in gold. The opposite stress/character
 *                            of the sans gives the mark its identity.
 *
 * The raster logo (/logo.jpeg) is still used as the browser favicon via
 * src/app/icon.jpeg — this component just provides the inline wordmark
 * that renders cleanly at any size on dark or light surfaces.
 */
export function Wordmark({
  size = "md",
  tone = "light",
  className,
}: {
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
}) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  } as const;

  const accentSizes = {
    // Fraunces runs a touch smaller optically than Inter at the same px size,
    // so we bump the "4" up a hair to balance the cap height.
    sm: "text-[1.05em]",
    md: "text-[1.08em]",
    lg: "text-[1.1em]",
  } as const;

  const base = tone === "light" ? "text-bone" : "text-ink";

  return (
    <span
      className={cn(
        "inline-flex items-baseline font-sans font-semibold tracking-[-0.045em] lowercase select-none",
        sizes[size],
        base,
        className
      )}
      aria-label="time4transfer"
    >
      <span>time</span>
      <span
        aria-hidden
        className={cn(
          "font-accent italic font-medium text-gold relative px-[0.04em]",
          accentSizes[size]
        )}
        style={{ fontVariationSettings: '"SOFT" 100' }}
      >
        4
      </span>
      <span>transfer</span>
    </span>
  );
}
