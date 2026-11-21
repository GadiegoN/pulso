import React from "react";
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Fixed Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <CounterCardSection />
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
