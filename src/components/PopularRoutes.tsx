"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const ROUTE_KEYS = [
  "ist_taksim",
  "ist_sultan",
  "ist_besiktas",
  "saw_kadikoy",
  "saw_sultan",
  "saw_taksim",
] as const;

export function PopularRoutes() {
  const t = useTranslations("routes");

  return (
    <section id="routes" className="relative bg-bone py-16 sm:py-20 lg:py-24 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Routes</p>
            <h2 className="font-display text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em]">
              {t("title")}
            </h2>
            <p className="mt-4 text-stone text-pretty leading-[1.55] max-w-md">{t("subtitle")}</p>
          </div>
        </header>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTE_KEYS.map((k, i) => {
            const fromLabel = t(`list.${k}.from`);
            const toLabel = t(`list.${k}.to`);
            const duration = t(`list.${k}.duration`);
            const price = t.raw(`list.${k}.price`) as number;
            return (
              <motion.li
                key={k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              >
                <a
                  href="#book"
                  className="group relative flex h-full flex-col justify-between rounded-3xl border border-ink/[0.06] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-stone uppercase tracking-[0.14em]">
                        {fromLabel}
                      </p>
                      <p className="mt-2 font-display text-2xl tracking-[-0.02em] text-ink text-balance">
                        {toLabel}
                      </p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/[0.08] text-stone transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-sm">
                    <span className="text-stone tabular">{duration}</span>
                    <span className="text-ink">
                      <span className="text-[11px] uppercase tracking-[0.14em] text-stone mr-1">
                        {t("from")}
                      </span>
                      <span className="font-display text-lg tabular">{formatPrice(price)}</span>
                    </span>
                  </div>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
