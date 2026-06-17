"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, ShieldCheck, HandCoins, CreditCard, Receipt } from "lucide-react";
import { Button } from "./ui/Button";

export function PayDriverSection() {
  const t = useTranslations("payDriver");
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")];

  return (
    <section className="relative bg-bone py-16 sm:py-20 lg:py-24 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-charcoal text-bone">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_85%_30%,rgba(202,138,4,0.28),transparent_70%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_15%_80%,rgba(133,77,14,0.3),transparent_70%)]"
          />

          <div className="relative grid gap-10 px-6 py-12 sm:px-12 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold-soft">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("badge")}
              </span>
              <h2 className="font-display text-balance mt-5 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em]">
                {t("title")}
              </h2>
              <p className="mt-5 max-w-xl text-bone/70 text-pretty leading-[1.6]">
                {t("body")}
              </p>

              <ul className="mt-7 grid gap-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-bone/85">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-gold/15 text-gold-soft">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button asChild size="lg">
                  <a href="#book">{t("cta")}</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative"
            >
              <PaymentMockup />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Card 1: pay driver (front) */}
      <div className="relative z-20 rounded-3xl border border-gold/20 bg-gradient-to-br from-white/[0.07] to-transparent p-6 backdrop-blur-xl shadow-elevated">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft">
            On arrival
          </span>
          <HandCoins className="h-5 w-5 text-gold-soft" />
        </div>
        <p className="mt-4 font-display text-3xl text-bone tracking-[-0.025em] tabular">
          $0 today
        </p>
        <p className="mt-1 text-sm text-bone/55">
          Settle directly with your driver — cash or card on the spot.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Chip icon={<HandCoins className="h-3 w-3" />} label="Cash" />
          <Chip icon={<CreditCard className="h-3 w-3" />} label="Card" />
          <Chip icon={<Receipt className="h-3 w-3" />} label="Receipt" />
        </div>
      </div>

      {/* Card 2: confirmed booking (behind) */}
      <div className="absolute -bottom-6 left-4 right-4 z-10 rounded-3xl border border-white/[0.08] bg-charcoal/70 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-bone/45">
          <span className="slashed">Booking #A-94821</span>
          <span className="text-gold-soft">Confirmed</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-bone/80">
          <span className="h-2 w-2 rounded-full bg-gold-soft" />
          IST → Sultanahmet
          <span className="ml-auto text-bone/55 tabular">07:40</span>
        </div>
      </div>

      {/* Card 3: shadow card */}
      <div className="absolute -bottom-12 left-10 right-10 z-0 h-16 rounded-3xl border border-white/[0.05] bg-charcoal/40 backdrop-blur" />
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-bone/80">
      <span className="text-gold-soft">{icon}</span>
      {label}
    </span>
  );
}
