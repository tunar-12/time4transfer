import type { MetadataRoute } from "next";

const SITE_URL = "https://www.time4transfer.com";

/**
 * /robots.txt — allow all well-behaved crawlers, point them at the sitemap,
 * and explicitly hide the /api/ tree (no SEO value, just unnecessary
 * crawl budget on the Google Places proxy).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
