"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plane, BadgeCheck, MapPin } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("how");

  const steps = [
    { key: "step1", icon: MapPin },
    { key: "step2", icon: BadgeCheck },
    { key: "step3", icon: Plane },
  ] as const;

  return (
    <section id="how" className="relative bg-charcoal py-16 sm:py-20 lg:py-24 text-bone overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(202,138,4,0.13),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft">
            How it works
          </p>
          <h2 className="font-display text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em]">
            {t("title")}
          </h2>
          <p className="mt-4 text-bone/65 text-pretty leading-[1.55]">{t("subtitle")}</p>
        </header>

        <div className="relative mt-16 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* connecting dotted line behind on lg+ */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] right-[8%] top-[80px] hidden h-px lg:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(202,138,4,0.4) 0 8px, transparent 8px 16px)",
            }}
          />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="relative rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gold text-charcoal shadow-[0_0_0_8px_rgba(202,138,4,0.12)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-5xl text-bone/15 tracking-[-0.04em] tabular">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-bone tracking-[-0.02em] text-balance">
                  {t(`${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-bone/65 leading-[1.6] text-pretty">
                  {t(`${s.key}.body`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
