//src/app/(root)/page.tsx

import { FeaturesSection } from "@/app/(root)/(main)/FeaturesSection";
import { HeroSection } from "@/app/(root)/(main)/HeroSection";
import UserStats from "@/components/UserStats";

export default function HomePage() {
  return (
    <div className="w-full h-full max-w-4xl mx-auto space-y-6 sm:space-y-8 xl:space-y-8">
      <HeroSection />
      <FeaturesSection />
      <UserStats></UserStats>
    </div>
  );
}
