"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BookingWidget } from "./BookingWidget";
import { AirportMarquee } from "./AirportMarquee";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-charcoal text-bone"
    >
      {/* Background layers */}
      <BackgroundLayers />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-14 pt-28 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-40 lg:flex-row lg:items-center lg:gap-10 lg:pb-28">
        {/* Left: editorial copy */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.07] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="font-display text-balance mt-5 text-[38px] sm:mt-6 sm:text-[64px] lg:text-[76px] leading-[0.98] sm:leading-[0.96] tracking-[-0.03em]"
          >
            <span className="block">{t("titleA")}</span>
            <span className="block">
              <em className="not-italic gold-gradient-text">{t("titleB")}</em>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            className="mt-5 sm:mt-6 max-w-xl text-balance text-[15.5px] sm:text-lg text-bone/70 leading-[1.55]"
          >
            {t("subtitle")}
          </motion.p>

        </div>

        {/* Right: booking widget */}
        <motion.div
          id="book"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="flex-1 min-w-0 flex justify-center lg:justify-end w-full"
        >
          <BookingWidget />
        </motion.div>
      </div>

      {/* Airport-code marquee — replaces trust pills, on-brand for transfers */}
      <AirportMarquee />
    </section>
  );
}

function BackgroundLayers() {
  return (
    <>
      {/* Warm radial spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_30%_30%,rgba(202,138,4,0.18),transparent_70%)]"
      />
      {/* Cool secondary */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,rgba(133,77,14,0.22),transparent_70%)]"
      />
      {/* Subtle grid */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Top noise gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[40%] bg-gradient-to-b from-black/40 to-transparent"
      />
    </>
  );
}
