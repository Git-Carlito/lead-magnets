import { WhatsAppCTA } from "./WhatsAppCTA";

export function AllGoodResult() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 text-center duration-500">
      <div className="mb-6 text-6xl">🤔</div>

      <h2 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
        Qu'est-ce que tu fous là
        <br />
        <span className="text-green-500">si tout va bien ?</span>
      </h2>

      <div className="border-border bg-card mx-auto mb-6 max-w-sm rounded-2xl border p-6 text-left">
        <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
          Soit tu es vraiment en pleine forme : auquel cas bravo, tu fais partie des{" "}
          <strong className="text-foreground">3% de dirigeants</strong> dans ce cas.
        </p>
        <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
          Soit tu es passé un peu vite sur les réponses.{" "}
          <span className="text-muted-foreground">On ne juge pas.</span>
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          Dans tous les cas, un échange avec moi ne peut pas faire de mal. La prévention, c'est
          aussi pour les gens qui vont bien : et les dirigeants qui anticipent sont ceux qui{" "}
          <strong className="text-foreground">ne tombent jamais vraiment</strong>.
        </p>
      </div>

      <WhatsAppCTA />
    </div>
  );
}
