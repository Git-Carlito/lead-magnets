import type { FatigueResult } from "./types";
import { WhatsAppCTA } from "./WhatsAppCTA";

export function FatigueResultView({ result }: { result: FatigueResult }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <div className="border-primary/25 bg-primary/[0.125] text-primary mb-5 inline-block rounded-full border px-5 py-2 text-xs font-bold tracking-wider uppercase">
          {result.badge}
        </div>
        <h2 className="text-foreground mb-1 text-3xl font-bold md:text-4xl">
          Ton profil : <span className="text-primary">{result.title}</span>
        </h2>
      </div>

      <div className="border-border bg-card mb-4 rounded-2xl border p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2 text-base font-bold">
          <span className="text-primary">🔍</span>
          Les signaux qui ne trompent pas
        </h3>
        <ul className="space-y-3">
          {result.signals.map((signal, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary flex-shrink-0 text-sm leading-snug font-bold">▸</span>
              <span className="text-foreground/80 text-sm leading-snug">{signal}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-primary/15 bg-primary/[0.06] mb-4 rounded-2xl border p-6">
        <h3 className="text-foreground mb-3 flex items-center gap-2 text-base font-bold">
          <span>⚠️</span> Pourquoi il est impératif de changer
        </h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{result.risksIntro}</p>
        <ul className="space-y-2">
          {result.risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-sm leading-snug font-bold text-orange-400">
                →
              </span>
              <span className="text-foreground/80 text-sm leading-snug">{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border bg-card mb-8 rounded-2xl border p-6">
        <h3 className="text-foreground mb-5 flex items-center gap-2 text-base font-bold">
          <span>🏆</span> Mon conseil de champion : Plan d'action en 3 étapes
        </h3>
        <div className="space-y-5">
          {result.actions.map((action, i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-primary/[0.15] text-primary mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="text-foreground mb-1 text-sm font-semibold">{action.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WhatsAppCTA />
    </div>
  );
}
