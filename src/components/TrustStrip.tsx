"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LifeBuoy, BadgeDollarSign, ShieldCheck, CalendarX2 } from "lucide-react";

export function TrustStrip() {
  const t = useTranslations("trust");
  const items = [
    { key: "support", icon: LifeBuoy },
    { key: "fixed", icon: BadgeDollarSign },
    { key: "payDriver", icon: ShieldCheck },
    { key: "free", icon: CalendarX2 },
  ] as const;

  return (
    <section className="relative bg-bone py-14 sm:py-20 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-5xl text-ink tracking-[-0.025em]">
            {t("title")}
          </h2>
        </header>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-ink/[0.06] bg-ink/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.li
                key={it.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                className="group relative bg-bone p-7 transition-colors hover:bg-white"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-gold transition-colors group-hover:bg-gold group-hover:text-charcoal">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-ink tracking-tight">
                  {t(`items.${it.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {t(`items.${it.key}.body`)}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
