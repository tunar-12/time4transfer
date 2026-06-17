import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = "https://www.time4transfer.com";

/**
 * Sitemap for search engines.
 *
 * Lists one entry per locale. Each entry carries an `alternates.languages`
 * map so Google understands the four versions are the same page in
 * different languages — pairs nicely with the hreflang link tags emitted
 * by next-intl and the `alternates.languages` metadata on each route.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${l}`;
  }

  return routing.locales.map((locale) => {
    const url =
      locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
    return {
      url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: locale === routing.defaultLocale ? 1.0 : 0.9,
      alternates: { languages },
    };
  });
}
