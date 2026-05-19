import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/sections/HeroSection';
import { MissionSection } from '../components/sections/MissionSection';
import { HowSwapWorks } from '../components/sections/HowSwapWorks';
import { CollectionsSection } from '../components/sections/CollectionsSection';
import { TrendSection } from '../components/sections/TrendSection';
import { PricingSection } from '../components/sections/PricingSection';
import { ContributionSection } from '../components/sections/ContributionSection';
import { SafetySection } from '../components/sections/SafetySection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-white">
      <Navbar />

      <main className="grow">
        <HeroSection />

        {/* Combined Section for Mission & How Swap Works */}
        <section className="pt-24">
          <div className="container mx-auto px-4 md:px-8 max-w-360">
            <div className="grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-12 gap-12 lg:gap-6 items-start">
              <div className="lg:col-span-3 xl:col-span-4 h-full">
                <MissionSection />
              </div>
              <div className="lg:col-span-5 xl:col-span-8 h-full">
                <HowSwapWorks />
              </div>
            </div>
          </div>
        </section>

        <CollectionsSection />
        <TrendSection />
        <PricingSection />
        <ContributionSection />
        <SafetySection />
      </main>

      <Footer />
    </div>
  );
};
