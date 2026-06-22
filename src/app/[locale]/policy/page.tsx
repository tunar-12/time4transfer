import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Privacy Policy — time4transfer",
  description:
    "How time4transfer collects, uses, and protects personal information in connection with our Istanbul airport transfer services and related social media tools.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.time4transfer.com/policy" },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bone text-ink">
        <article className="mx-auto max-w-3xl px-5 pb-20 pt-32 sm:px-6 sm:pt-40">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
            Legal
          </p>
          <h1 className="font-display text-balance mt-3 text-4xl sm:text-5xl tracking-[-0.025em]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-stone">
            Last updated: 22 June 2026
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-[1.7] text-ink/85 text-pretty">
            <p>
              This Privacy Policy explains how{" "}
              <strong className="font-medium text-ink">time4transfer</strong>{" "}
              (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses,
              and protects information in connection with our Istanbul airport
              transfer services (the &quot;Services&quot;) and our related
              social media publishing tools.
            </p>

            <Section title="1. Information we collect">
              When you book or contact us, we may collect your name, email
              address, phone number, pickup and drop-off details, travel
              dates, passenger count, and any information you choose to
              provide. When you interact with our website or social media
              accounts, we may collect basic technical data such as device and
              usage information.
            </Section>

            <Section title="2. How we use information">
              We use information to provide and manage transfer bookings,
              communicate with you, process payments, provide customer
              support, improve our Services, and operate our social media
              presence (including scheduling and publishing our own
              promotional content).
            </Section>

            <Section title="3. Social media & the Instagram API">
              We use Meta&apos;s Instagram Graph API solely to publish
              marketing content (such as reels) to our own business Instagram
              account. We do not access, collect, or store personal data of
              other Instagram users through this tool. Access tokens are
              stored securely and used only to publish our own content.
            </Section>

            <Section title="4. Sharing of information">
              We do not sell your personal information. We may share
              information with trusted service providers (such as drivers,
              payment processors, and hosting providers) only as needed to
              deliver the Services, and where required by law.
            </Section>

            <Section title="5. Data retention">
              We retain personal information only as long as necessary to
              provide the Services and to meet legal, accounting, or reporting
              obligations.
            </Section>

            <Section title="6. Your rights">
              You may request access to, correction of, or deletion of your
              personal information by contacting us. Depending on your
              location, you may have additional rights under applicable data
              protection laws.
            </Section>

            <Section title="7. Security">
              We use reasonable technical and organisational measures to
              protect personal information against unauthorised access, loss,
              or misuse.
            </Section>

            <Section title="8. Contact us">
              For any privacy questions or requests, contact us at{" "}
              <a
                href="mailto:hello@time4transfer.com"
                className="text-gold-deep underline-offset-4 hover:underline"
              >
                hello@time4transfer.com
              </a>{" "}
              or via WhatsApp at +90 850 222 12 34.
            </Section>

            <Section title="9. Changes to this policy">
              We may update this Privacy Policy from time to time. The latest
              version will always be available at this page.
            </Section>
          </div>

          <hr className="mt-14 border-ink/[0.08]" />
          <p className="mt-6 text-xs text-stone">
            © {new Date().getFullYear()} time4transfer · İstanbul · Türkiye
          </p>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-stone transition-colors hover:text-charcoal"
            >
              ← Back to home
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl tracking-[-0.02em] text-ink mb-3">
        {title}
      </h2>
      <p>{children}</p>
    </section>
  );
}
