// src/components/FeaturesSection.tsx

const features = [
  {
    emoji: "🕖",
    title: "Habit-forming",
    description:
      "Build strong morning routines with reinforcement learning, self-monitoring, and streak tracking.",
  },
  {
    emoji: "🏃",
    title: "Bed Breaker",
    description:
      "Print your personal QR code and place it where you want to start each morning. Scan it to log your time and start your day!",
  },
  {
    emoji: "📈",
    title: "Sleep Insights",
    description:
      "Analyze your wake-up trends and see how your consistency improves over time.",
  },
];

export function FeaturesSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Why Early Bird?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-surface rounded-xl shadow-sm p-5 flex flex-col items-center text-center border text-balance"
          >
            <h3 className="text-3xl text-primary font-bold mb-2 flex items-center gap-2">
              {feature.emoji}
            </h3>
            <h3 className="text-xl text-secondary font-bold mb-4">
              {feature.title}
            </h3>
            <p className="text-lg">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
