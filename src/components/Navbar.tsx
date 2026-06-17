"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/Button";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#fleet", label: t("fleet") },
    { href: "#routes", label: t("routes") },
    { href: "#how", label: t("how") },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-3 top-3 z-40 sm:inset-x-4 sm:top-4"
    >
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-4 pr-2 sm:pl-5 sm:pr-3 transition-all duration-300",
          scrolled
            ? "glass-dark shadow-elevated"
            : "glass-dark border-white/[0.05]"
        )}
      >
        <a
          href="#top"
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="time4transfer — home"
        >
          <Wordmark size="md" tone="light" />
        </a>

        <ul className="hidden lg:flex items-center gap-1 text-sm text-bone/75">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-2 transition-colors hover:text-bone hover:bg-white/5"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {/* Language switcher: desktop-only inline. Mobile shows it inside the drawer. */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          {/* Book CTA: stays visible on tablet+. Mobile-only users use the drawer CTA. */}
          <Button
            asChild
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex"
          >
            <a href="#book">{t("book")}</a>
          </Button>
          {/* Hamburger trigger — shown below lg, replaces the inline link list */}
          <MobileMenu />
        </div>
      </nav>
    </motion.header>
  );
}

