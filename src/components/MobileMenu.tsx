"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

/**
 * Compact mobile navigation. Hamburger sits in the navbar on screens below
 * `lg`; tapping it opens a full-bleed dark-glass drawer with the nav links,
 * language switcher, and the primary CTA. Closes on link tap (so jumping
 * to a section feels instant) and on Escape / backdrop click via Radix.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const links = [
    { href: "#fleet", label: t("fleet") },
    { href: "#routes", label: t("routes") },
    { href: "#how", label: t("how") },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open menu"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-bone/80 transition-colors hover:bg-white/5 hover:text-bone lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-[60] bg-charcoal/80 backdrop-blur-md",
            "data-[state=open]:animate-[fadeIn_200ms_ease] data-[state=closed]:animate-[fadeOut_180ms_ease]"
          )}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-0 z-[70] flex flex-col bg-charcoal text-bone",
            "data-[state=open]:animate-[slideIn_240ms_cubic-bezier(0.22,1,0.36,1)]",
            "data-[state=closed]:animate-[slideOut_200ms_ease]"
          )}
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="flex items-center justify-between px-5 py-5">
            <Wordmark size="md" tone="light" />
            <Dialog.Close asChild>
              <button
                aria-label="Close menu"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-bone/80 transition-colors hover:bg-white/5 hover:text-bone"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-5 py-4">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between rounded-2xl px-4 py-4 text-bone/90 transition-colors hover:bg-white/[0.04] hover:text-bone"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-display text-2xl tracking-[-0.02em]">
                  {l.label}
                </span>
                <span className="text-xs text-bone/30 tabular">0{i + 1}</span>
              </a>
            ))}
          </nav>

          <div className="border-t border-white/[0.06] px-5 py-5 grid gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-bone/45">
                Language
              </span>
              <LanguageSwitcher />
            </div>
            <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
              <a href="#book">{t("book")}</a>
            </Button>
          </div>

          <style>{`
            @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
            @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
            @keyframes slideIn  { from { transform: translateY(8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            @keyframes slideOut { from { transform: translateY(0); opacity: 1 } to { transform: translateY(8px); opacity: 0 } }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
