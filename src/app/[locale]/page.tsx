import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { FleetGrid } from "@/components/FleetGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { PayDriverSection } from "@/components/PayDriverSection";
import { PopularRoutes } from "@/components/PopularRoutes";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <FleetGrid />
        <HowItWorks />
        <PayDriverSection />
        <PopularRoutes />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
