"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Item = { quote: string; name: string; trip: string };

export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative bg-charcoal py-16 sm:py-20 lg:py-24 text-bone overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(202,138,4,0.08),transparent_75%)]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft">
            Reviews
          </p>
          <h2 className="font-display text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em]">
            {t("title")}
          </h2>
        </header>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="relative flex flex-col gap-6 rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur-sm"
            >
              <Quote className="h-7 w-7 text-gold-soft/70" />
              <p className="text-lg text-bone/90 leading-[1.5] font-display tracking-[-0.015em] text-pretty">
                “{it.quote}”
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-amber-600 text-charcoal text-sm font-semibold">
                  {it.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-bone">{it.name}</p>
                  <p className="text-xs text-bone/55">{it.trip}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
