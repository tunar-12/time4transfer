import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // We rely on editor + CI for lint; don't block production builds.
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
