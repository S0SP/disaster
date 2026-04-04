import { HeroSection } from "@/components/landing/HeroSection";
import { LiveFeed } from "@/components/landing/LiveFeed";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { ActiveCampaigns } from "@/components/landing/ActiveCampaigns";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSection />

      <LiveFeed />

      <HowItWorks />

      <ActiveCampaigns />

      <TrustSection />

      {/* FINAL CTA SECTION */}
      <section className="py-32 bg-background border-t border-border border-b">
        <div className="page-container text-center flex flex-col items-center">
          <h2 className=" text-4xl md:text-[56px] leading-[1.1] tracking-tight text-foreground mb-6">
            Every disaster deserves <br className="hidden md:block" />
            accountable relief.
          </h2>

          <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[480px] mb-12">
            Join the community of verified donors and governance participants to
            build a future of trustless aid.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/campaigns"
              className="px-8 py-3 bg-text-primary text-bg-primary font-semibold rounded-md hover:bg-text-secondary transition-colors duration-200 text-[14px]"
            >
              Start Donating
            </Link>
            <Link
              href="/verify"
              className="px-8 py-3 bg-transparent text-foreground border border-border hover:border-border hover:border-primary/50 rounded-md transition-colors duration-200 text-[14px]"
            >
              Verify Your Identity
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
