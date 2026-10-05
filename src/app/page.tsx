import type { Metadata } from "next";
import {
  AnnouncementBar,
  Header,
  Hero,
  HowItWorks,
  QuoteBand,
  Tiers,
  Doctor,
  Faq,
  FinalCta,
  Footer,
} from "@/components/landing/sections";
import { StatusBanner, type LandingState } from "@/components/landing/status-banner";
import { PrivacySheet } from "@/components/landing/privacy-sheet";

type SearchParams = Promise<{ state?: string; reason?: string }>;

function toLandingState(params: {
  state?: string;
  reason?: string;
}): { state: LandingState; reason: string | null } {
  const { state, reason } = params;
  if (state === "confirmed") return { state: "confirmed", reason: null };
  if (state === "unsubscribed") return { state: "unsubscribed", reason: null };
  if (state === "error")
    return { state: "error", reason: reason ?? "server" };
  return { state: "none", reason: null };
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { state, reason } = toLandingState(params);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <StatusBanner state={state} reason={reason} />

      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <QuoteBand />
        <Tiers />
        <Doctor />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <PrivacySheet />
    </div>
  );
}
