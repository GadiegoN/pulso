import React from "react";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { cities, establishments, whatsappChannels, spots } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CounterCardSection } from "@/components/CounterCardSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TargetAudienceSection } from "@/components/TargetAudienceSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { VisionSection } from "@/components/VisionSection";
import { ContactCtaSection } from "@/components/ContactCtaSection";
import { Footer } from "@/components/Footer";
import { DigitalRadioPlayer } from "@/components/DigitalRadioPlayer";

export const instant = false;

export default async function Home() {
  await connection();

  // Consultas reais no PostgreSQL para os contadores da Home
  const [[citiesRow], [estRow], [channelsRow], [spotsRow]] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(cities)
      .where(eq(cities.isActive, true)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(establishments)
      .where(eq(establishments.isActive, true)),
    db
      .select({
        count: sql<number>`count(*)::int`,
        members: sql<number>`coalesce(sum(${whatsappChannels.memberCount}), 0)::int`,
      })
      .from(whatsappChannels)
      .where(eq(whatsappChannels.isActive, true)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(spots)
      .where(eq(spots.isActive, true)),
  ]);

  const liveStats = {
    citiesCount: citiesRow?.count ?? 0,
    establishmentsCount: estRow?.count ?? 0,
    activeChannelsCount: (channelsRow?.count ?? 0) + (spotsRow?.count ?? 0),
    connectedResidentsCount: channelsRow?.members ?? 0,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <CounterCardSection stats={liveStats} />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <TargetAudienceSection />
        <LeadershipSection />
        <VisionSection />
        <ContactCtaSection />
      </main>

      {/* Player da Rádio Digital Flutuante */}
      <DigitalRadioPlayer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
