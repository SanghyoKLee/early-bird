// src/components/HeroSection.tsx

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="text-center py-12">
      <h1 className="text-5xl font-extrabold text-primary mb-4 leading-tight text-balance">
        Wake Up On Time,
        <br />
        <span className="text-secondary">Beat The Snooze</span>
      </h1>
      <p className="text-xl text-text-light mb-8">
        Fix your sleep schedule and build unstoppable morning habits. <br />
        Track your wake times and become a consistent early riser.
      </p>
      <Link
        href="/auth/register"
        className="bg-accent text-surface px-8 py-3 rounded-lg shadow font-bold text-lg hover:bg-primary transition"
      >
        Get Started
      </Link>
    </section>
  );
}
