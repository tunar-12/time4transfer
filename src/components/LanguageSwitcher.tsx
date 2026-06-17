"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname, routing, type Locale } from "@/i18n/routing";
import * as Popover from "@radix-ui/react-popover";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANG_LABEL: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  tr: "Türkçe",
};

export function LanguageSwitcher({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={t("language")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium transition-colors cursor-pointer",
          variant === "dark"
            ? "text-bone/80 hover:text-bone hover:bg-white/5"
            : "text-charcoal/80 hover:text-charcoal hover:bg-charcoal/5",
          isPending && "opacity-60"
        )}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase tracking-wider">{locale}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-charcoal/95 p-1.5 shadow-elevated backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-bone/85 transition-colors hover:bg-white/[0.06] hover:text-bone cursor-pointer",
                l === locale && "text-gold-soft"
              )}
            >
              <span>{LANG_LABEL[l]}</span>
              {l === locale ? <Check className="h-4 w-4" /> : null}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
