"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const t = useTranslations("footer");

  // Footer link groups. Each link is { label, href } so real routes (like
  // /policy) get a working anchor; placeholders still use "#" until those
  // pages exist.
  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("fleet"), href: "#fleet" },
        { label: t("careers"), href: "#" },
        { label: t("press"), href: "#" },
      ],
    },
    {
      title: t("support"),
      links: [
        { label: t("contact"), href: "#book" },
        { label: t("help"), href: "#" },
        { label: t("terms"), href: "#" },
        { label: t("privacy"), href: "/policy" },
      ],
    },
  ];

  return (
    <footer className="relative bg-charcoal text-bone">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark size="lg" tone="light" />
            <p className="mt-4 max-w-sm text-sm text-bone/60 leading-relaxed">
              {t("tagline")}
            </p>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-bone/45">
                {g.title}
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-bone/80">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-block transition-colors hover:text-gold-soft"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-bone/45">
              Contact
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-bone/80">
              <li>
                <a href="mailto:hello@time4transfer.com" className="hover:text-gold-soft transition-colors">
                  hello@time4transfer.com
                </a>
              </li>
              <li>
                <a href="tel:+908502221234" className="hover:text-gold-soft transition-colors">
                  +90 850 222 12 34
                </a>
              </li>
              <li className="text-bone/55 mt-2">WhatsApp · 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-8 text-xs text-bone/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("legal")} · © {new Date().getFullYear()}</p>
          <p>{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}

