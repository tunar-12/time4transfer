import type { Metadata } from "next";
import { Inter, Playfair_Display, Fraunces } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["italic", "normal"],
  axes: ["SOFT", "opsz"],
});

const SITE_URL = "https://www.time4transfer.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  // Per-locale canonical: default locale lives at /, others at /<locale>.
  const path = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const canonical = `${SITE_URL}${path}`;

  // hreflang language alternates — tells Google which URL serves which locale.
  // x-default goes to the canonical-language version for unmatched languages.
  const languages: Record<string, string> = {
    "x-default": SITE_URL,
  };
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${l}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords: [
      "Istanbul airport transfer",
      "IST transfer",
      "SAW transfer",
      "Sabiha Gökçen transfer",
      "Istanbul private transfer",
      "Mercedes Vito Istanbul",
      "fixed price airport transfer",
      "İstanbul havalimanı transfer",
      "transfer Stambuł",
      "Стамбул трансфер",
      "Flughafentransfer Istanbul",
    ],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "time4transfer",
      title: t("title"),
      description: t("description"),
      locale,
      images: [
        {
          url: "/logo.jpeg",
          width: 1600,
          height: 1600,
          alt: "time4transfer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/logo.jpeg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/icon.jpeg",
      apple: "/apple-icon.jpeg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  // Structured data — a single combined LocalBusiness + TaxiService node so
  // Google can show rich results for "Istanbul airport transfer" queries
  // (stars, hours, price range, service area). Keep this in sync with the
  // real-world business profile / Google Business Profile entry.
  const ldJson = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    name: "time4transfer",
    url: SITE_URL,
    image: `${SITE_URL}/logo.jpeg`,
    logo: `${SITE_URL}/logo.jpeg`,
    description:
      "Fixed-price private airport transfers from Istanbul Airport (IST) and Sabiha Gökçen Airport (SAW) to anywhere in Istanbul. Mercedes Vito and Sprinter, English-speaking drivers, pay your driver on arrival.",
    telephone: "+905019538025",
    priceRange: "$$",
    currenciesAccepted: "USD, EUR, TRY",
    paymentAccepted: "Cash, Credit Card",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "Airport", name: "Istanbul Airport", iataCode: "IST" },
      { "@type": "Airport", name: "Sabiha Gökçen Airport", iataCode: "SAW" },
    ],
    serviceType: "Private airport transfer",
    availableLanguage: ["English", "Turkish", "Russian", "German"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+905019538025",
      contactType: "reservations",
      availableLanguage: ["en", "tr", "ru", "de"],
      areaServed: "TR",
    },
    sameAs: [],
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full bg-bone text-ink antialiased flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
