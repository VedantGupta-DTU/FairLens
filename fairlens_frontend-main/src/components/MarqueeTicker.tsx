export default function MarqueeTicker() {
  const items = [
    '🔴 UP Loans — 28% SC/ST approval vs 71% General',
    '🟡 Gender Gap — Female approval 45% vs Male 62%',
    '🟢 Age Fairness — DI 0.95 (Passed)',
    '📊 4 Fairness Tests Available',
    '🇮🇳 Built for India — Hindi + English Support',
    '⚡ 30-Second Average Audit Time',
    '🛡️ Disparate Impact · Equalized Odds · Group Balance',
    '🤖 Powered by Grok AI (xAI)',
  ]

  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden py-4 border-y border-white/[0.06] bg-black/30">
      <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] font-medium">
            {item}
            <span className="w-1 h-1 rounded-full bg-[var(--color-coral)]/40" />
          </span>
        ))}
      </div>
      <style>{`
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
          width: max-content;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  )
}
