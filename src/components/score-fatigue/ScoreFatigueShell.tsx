// ============================================================
// ScoreFatigueShell.tsx
// Composant principal du quiz "Score de Fatigue"
// Auteur : Charles Denis — Coach pour dirigeants
//
// Flux : quiz → gate (formulaire lead) → résultats
// Les résultats ne sont accessibles QU'après soumission du formulaire
// ============================================================

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────

type FatigueType = "physique" | "mentale" | "emotionnelle" | "sociale";
type Phase = "quiz" | "gate" | "result";

interface FatigueOption {
  label: string;
  value: string;
  type: FatigueType;
}

interface FatigueQuestion {
  id: string;
  question: string;
  options: FatigueOption[];
}

interface FatigueResult {
  key: FatigueType;
  titre: string;
  badge: string;
  couleur: string;
  description: string;
  symptomes: string[];
  impact: string;
  solution: string;
}

// ─── Questions du quiz ───────────────────────────────────────

const QUESTIONS: FatigueQuestion[] = [
  {
    id: "q1",
    question:
      "Quand tu te réveilles le matin, comment tu te sens le plus souvent ?",
    options: [
      {
        label: "Physiquement épuisé — comme si je n'avais pas dormi",
        value: "q1_p",
        type: "physique",
      },
      {
        label: "La tête lourde — du mal à démarrer mentalement",
        value: "q1_m",
        type: "mentale",
      },
      {
        label: "Vidé intérieurement — sans envie ni élan",
        value: "q1_e",
        type: "emotionnelle",
      },
      {
        label: "J'appréhende déjà les interactions de la journée",
        value: "q1_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q2",
    question:
      "Dans ta vie de dirigeant, qu'est-ce qui te vide le plus d'énergie ?",
    options: [
      {
        label: "Toujours en mouvement — mon corps ne suit plus vraiment",
        value: "q2_p",
        type: "physique",
      },
      {
        label:
          "La surcharge de décisions — trop de choses à gérer simultanément",
        value: "q2_m",
        type: "mentale",
      },
      {
        label: "Porter les émotions de mon équipe et de ma famille",
        value: "q2_e",
        type: "emotionnelle",
      },
      {
        label: "L'isolement du dirigeant — personne ne comprend vraiment",
        value: "q2_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q3",
    question: "Le soir, qu'est-ce qui t'empêche le plus de décompresser ?",
    options: [
      {
        label: "Mon corps ne se détend pas — tensions et douleurs persistantes",
        value: "q3_p",
        type: "physique",
      },
      {
        label: "Les pensées tournent en boucle — impossible de m'arrêter",
        value: "q3_m",
        type: "mentale",
      },
      {
        label: "Un sentiment de vide ou de tristesse qui s'installe",
        value: "q3_e",
        type: "emotionnelle",
      },
      {
        label: "La pression de devoir encore gérer les autres",
        value: "q3_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q4",
    question: "Quel est l'impact de ta fatigue sur tes proches ?",
    options: [
      {
        label: "Je suis absent physiquement — toujours quelque chose à faire",
        value: "q4_p",
        type: "physique",
      },
      {
        label: "Je suis là mais ma tête est complètement ailleurs",
        value: "q4_m",
        type: "mentale",
      },
      {
        label: "Je suis irritable ou je me ferme sans raison claire",
        value: "q4_e",
        type: "emotionnelle",
      },
      {
        label: "Je me sens profondément seul même entouré de ma famille",
        value: "q4_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q5",
    question: "Ce qui te ressourcerait vraiment, c'est…",
    options: [
      {
        label: "Dormir profondément et que mon corps récupère enfin",
        value: "q5_p",
        type: "physique",
      },
      {
        label: "Me vider la tête — sans écran ni décision à prendre",
        value: "q5_m",
        type: "mentale",
      },
      {
        label: "Parler à quelqu'un qui comprend vraiment ce que je vis",
        value: "q5_e",
        type: "emotionnelle",
      },
      {
        label: "Retrouver une vraie connexion avec moi-même et mes proches",
        value: "q5_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q6",
    question: "Parmi ces symptômes, lequel te correspond le plus ?",
    options: [
      {
        label: "Douleurs chroniques, tensions, corps qui crie stop",
        value: "q6_p",
        type: "physique",
      },
      {
        label: "Concentration en baisse, oublis, décisions difficiles",
        value: "q6_m",
        type: "mentale",
      },
      {
        label: "Irritabilité, tristesse, difficulté à ressentir de la joie",
        value: "q6_e",
        type: "emotionnelle",
      },
      {
        label: "Sentiment d'incompréhension et de solitude profonde",
        value: "q6_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q7",
    question: "Si tu pouvais changer une chose demain, ce serait…",
    options: [
      {
        label: "Retrouver de l'énergie physique et un corps qui récupère",
        value: "q7_p",
        type: "physique",
      },
      {
        label: "Avoir la tête claire et prendre des décisions avec fluidité",
        value: "q7_m",
        type: "mentale",
      },
      {
        label: "Retrouver ma joie de vivre et mon enthousiasme",
        value: "q7_e",
        type: "emotionnelle",
      },
      {
        label: "Me sentir vraiment compris et soutenu",
        value: "q7_s",
        type: "sociale",
      },
    ],
  },
  {
    id: "q8",
    question: "Ta plus grande peur si tu ne changes rien…",
    options: [
      {
        label: "M'effondrer physiquement ou tomber sérieusement malade",
        value: "q8_p",
        type: "physique",
      },
      {
        label: "Perdre en performance, en créativité et en leadership",
        value: "q8_m",
        type: "mentale",
      },
      {
        label: "M'éloigner de qui je suis vraiment et de ceux que j'aime",
        value: "q8_e",
        type: "emotionnelle",
      },
      {
        label: "Me retrouver encore plus seul et incompris",
        value: "q8_s",
        type: "sociale",
      },
    ],
  },
];

// ─── Résultats détaillés par type de fatigue ─────────────────

const RESULTATS: Record<FatigueType, FatigueResult> = {
  physique: {
    key: "physique",
    titre: "Fatigue Physique",
    badge: "Ton corps crie stop",
    couleur: "#FF4444",
    description:
      "Ton corps est en mode survie. Trop sollicité depuis trop longtemps, il ne récupère plus normalement. Tu dors — mais tu ne te reposes pas vraiment. Tu avances — mais sur les réserves, pas sur la vitalité. Le pire ? Tu l'as normalisé.",
    symptomes: [
      "Réveil épuisé malgré 7-8h de sommeil",
      "Tensions musculaires chroniques (nuque, dos, mâchoires)",
      "Énergie fluctuante avec des \"coups de barre\" brutaux",
      "Corps qui \"tient\" grâce à la volonté, pas à la vitalité",
    ],
    impact:
      "Cette fatigue physique touche directement ta capacité à être présent : avec ta famille, dans tes décisions, dans ton leadership. Un corps épuisé produit un dirigeant épuisé — même quand tu le caches bien.",
    solution:
      "La solution n'est pas de \"se reposer\" pendant le week-end. C'est de comprendre pourquoi ton corps ne récupère plus — et d'agir sur les causes profondes. C'est exactement ce que je travaille avec mes clients dirigeants.",
  },
  mentale: {
    key: "mentale",
    titre: "Fatigue Mentale",
    badge: "Ton cerveau est en surchauffe",
    couleur: "#FF9500",
    description:
      "Ton cerveau tourne en permanence à 120%. Les décisions s'accumulent, les pensées ne s'arrêtent jamais — même quand tu essaies de te reposer. Tu fonctionnes encore, mais avec de moins en moins de clarté. Et tu le ressens dans chaque choix.",
    symptomes: [
      "Concentration difficile, oublis fréquents",
      "Difficulté à prendre des décisions avec clarté",
      "Pensées en boucle — impossible de vraiment \"décrocher\"",
      "Créativité et vision stratégique en berne",
    ],
    impact:
      "La surcharge mentale est insidieuse : tu n'as pas l'air épuisé de l'extérieur, mais ta capacité à diriger, à innover et à être pleinement présent diminue chaque semaine.",
    solution:
      "Réduire la charge mentale ne veut pas dire en faire moins. Ça veut dire restructurer ta manière de fonctionner — avec des systèmes qui libèrent ton cerveau pour ce qui compte vraiment.",
  },
  emotionnelle: {
    key: "emotionnelle",
    titre: "Fatigue Émotionnelle",
    badge: "Ton réservoir est à sec",
    couleur: "#A855F7",
    description:
      "Tu donnes énormément aux autres — ton équipe, ta famille, tes clients — sans avoir le temps ni l'espace pour te recharger. Tu n'es pas faible : tu portes trop depuis trop longtemps, sans soutien réel. Et personne ne le voit.",
    symptomes: [
      "Irritabilité ou fermeture émotionnelle soudaine",
      "Sentiment de vide ou de tristesse sans raison claire",
      "Difficulté à ressentir de la joie, même dans les bons moments",
      "Impression de porter le poids de tout le monde",
    ],
    impact:
      "La fatigue émotionnelle touche le plus profond : ta capacité à aimer, à connecter, à être le père et le mari que tu veux être. Elle s'installe en silence et se transforme en mal-être profond si elle n'est pas adressée.",
    solution:
      "Ce n'est pas une faiblesse — c'est le signe que tu as des standards élevés et que tu te sacrifies pour les autres. Mon accompagnement t'aide à te retrouver, à recharger ton réservoir sans tout lâcher.",
  },
  sociale: {
    key: "sociale",
    titre: "Fatigue Sociale & Isolement",
    badge: "Tu portes tout, seul",
    couleur: "#10B981",
    description:
      "En tant que dirigeant, tu es entouré de monde — mais profondément seul. Tu ne peux pas vraiment te confier à tes équipes, tu ne veux pas inquiéter ta famille. Tu avances, mais sans personne à tes côtés qui comprend vraiment le poids du leadership.",
    symptomes: [
      "Sentiment d'être incompris même par ses proches",
      "Masque du \"dirigeant fort\" que tu portes en permanence",
      "Les interactions sociales t'épuisent plutôt que te ressourcent",
      "Impression que personne ne peut vraiment t'aider",
    ],
    impact:
      "Cet isolement amplifie tous les autres types de fatigue. Sans espace pour décompresser, sans quelqu'un qui comprend vraiment le poids du leadership, tout devient plus lourd.",
    solution:
      "Ce que tu cherches — sans forcément le nommer — c'est quelqu'un qui comprend. Quelqu'un à qui parler sans filtre, qui t'accompagne sans jugement. C'est précisément le rôle que je joue avec mes clients.",
  },
};

// ─── Calcul du résultat dominant ─────────────────────────────

function calculerResultat(answers: Record<string, string>): FatigueResult {
  // Initialisation des scores par type
  const scores: Record<FatigueType, number> = {
    physique: 0,
    mentale: 0,
    emotionnelle: 0,
    sociale: 0,
  };

  // Pour chaque réponse, on trouve le type correspondant et on incrémente
  Object.values(answers).forEach((valeurReponse) => {
    for (const question of QUESTIONS) {
      const option = question.options.find((o) => o.value === valeurReponse);
      if (option) {
        scores[option.type]++;
        break;
      }
    }
  });

  // Le type avec le score le plus élevé est le type dominant
  const typeDominant = (Object.keys(scores) as FatigueType[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  return RESULTATS[typeDominant];
}

// ─── Composant principal ──────────────────────────────────────

export function ScoreFatigueShell() {
  // État de navigation entre les phases
  const [phase, setPhase] = useState<Phase>("quiz");
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [enTransition, setEnTransition] = useState(false);
  const [resultat, setResultat] = useState<FatigueResult | null>(null);

  // Champs du formulaire lead
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurFormulaire, setErreurFormulaire] = useState("");

  const questionActuelle = QUESTIONS[indexQuestion];
  const estDerniereQuestion = indexQuestion === QUESTIONS.length - 1;
  const progressionPct = (indexQuestion / QUESTIONS.length) * 100;

  // Gestion de la sélection d'une réponse avec transition
  function handleSelectionOption(valeur: string) {
    if (enTransition) return;
    setEnTransition(true);

    const nouvellesReponses = {
      ...reponses,
      [questionActuelle.id]: valeur,
    };
    setReponses(nouvellesReponses);

    // Délai pour l'animation de transition
    setTimeout(() => {
      if (estDerniereQuestion) {
        // Calcul du résultat avant affichage du formulaire
        const res = calculerResultat(nouvellesReponses);
        setResultat(res);
        setPhase("gate");
      } else {
        setIndexQuestion((i) => i + 1);
      }
      setEnTransition(false);
    }, 450);
  }

  // Gestion de la soumission du formulaire lead
  async function handleSoumettreFormulaire(e: React.FormEvent) {
    e.preventDefault();
    setErreurFormulaire("");

    // Validation des champs obligatoires
    if (!prenom.trim() || !nom.trim() || !telephone.trim()) {
      setErreurFormulaire(
        "Tous les champs sont obligatoires pour accéder à ton analyse."
      );
      return;
    }

    setEnvoiEnCours(true);

    try {
      // Insertion dans Supabase — table dédiée score_fatigue_leads
      await getSupabase().from("score_fatigue_leads").insert({
        prenom: prenom.trim(),
        nom: nom.trim(),
        telephone: telephone.trim(),
        lead_magnet: "score-fatigue",
        answers: reponses,
        result: resultat?.key,
      });
    } catch (erreur) {
      // Si Supabase n'est pas encore configuré, on continue quand même
      console.warn("Supabase non configuré — on continue sans enregistrer :", erreur);
    } finally {
      setEnvoiEnCours(false);
      // On affiche les résultats dans tous les cas
      setPhase("result");
    }
  }

  // ── Rendu : Phase QUIZ ──────────────────────────────────────

  if (phase === "quiz") {
    return (
      <div
        className="transition-all duration-300"
        style={{ opacity: enTransition ? 0 : 1, transform: enTransition ? "translateY(8px)" : "translateY(0)" }}
      >
        {/* Barre de progression */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium tracking-widest uppercase text-gray-500">
              Question {indexQuestion + 1} / {QUESTIONS.length}
            </span>
            <span className="text-xs font-bold text-[#FF0000]">
              {Math.round(progressionPct)}%
            </span>
          </div>
          <div className="w-full h-[3px] bg-[#1C1C1C] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressionPct}%`,
                background: "linear-gradient(90deg, #FF0000, #FF9595)",
              }}
            />
          </div>
        </div>

        {/* Texte de la question */}
        <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-8">
          {questionActuelle.question}
        </h2>

        {/* Options de réponse */}
        <div className="space-y-3">
          {questionActuelle.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelectionOption(option.value)}
              disabled={enTransition}
              className="w-full text-left px-5 py-4 rounded-2xl border border-[#252525] bg-[#111111] text-gray-300 text-sm leading-snug transition-all duration-150 cursor-pointer hover:border-[#FF0000] hover:bg-[#180000] hover:text-white disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-4">
                {/* Pastille de sélection */}
                <div className="w-4 h-4 rounded-full border border-[#333] group-hover:border-[#FF0000] flex-shrink-0 transition-colors duration-150" />
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Rendu : Phase GATE (formulaire lead) ───────────────────

  if (phase === "gate") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* En-tête du formulaire */}
        <div className="text-center mb-8">
          {/* Badge "Quiz terminé" */}
          <div className="inline-flex items-center gap-2 bg-[#180000] border border-[#FF0000]/30 text-[#FF9595] px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
            <span>✓</span>
            <span>Quiz terminé — Ton analyse est prête</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Accède à ton profil de fatigue
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
            Remplis tes informations ci-dessous. Je t'enverrai ton analyse
            personnalisée et pourrai te contacter directement.
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSoumettreFormulaire}
          className="space-y-4 max-w-sm mx-auto"
        >
          {/* Prénom */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Prénom <span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              autoComplete="given-name"
              className="w-full bg-[#111111] border border-[#252525] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF0000] transition-colors duration-200"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Nom <span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ton nom de famille"
              autoComplete="family-name"
              className="w-full bg-[#111111] border border-[#252525] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF0000] transition-colors duration-200"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Téléphone <span className="text-[#FF0000]">*</span>
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              autoComplete="tel"
              className="w-full bg-[#111111] border border-[#252525] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF0000] transition-colors duration-200"
            />
          </div>

          {/* Message d'erreur */}
          {erreurFormulaire && (
            <div className="bg-[#180000] border border-[#FF0000]/30 rounded-xl px-4 py-3">
              <p className="text-[#FF9595] text-xs">{erreurFormulaire}</p>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={envoiEnCours}
            className="w-full font-bold py-4 px-6 rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{
              background: envoiEnCours
                ? "#991111"
                : "linear-gradient(135deg, #FF0000, #CC0000)",
              color: "white",
            }}
          >
            {envoiEnCours
              ? "Chargement de ton analyse…"
              : "Découvrir mon profil de fatigue →"}
          </button>

          {/* Mention RGPD */}
          <p className="text-center text-gray-600 text-xs leading-relaxed">
            🔒 Tes informations restent confidentielles.
            <br />
            Aucun spam — juste ton analyse et un contact humain.
          </p>
        </form>
      </div>
    );
  }

  // ── Rendu : Phase RÉSULTATS ─────────────────────────────────

  if (phase === "result" && resultat) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Badge de type */}
        <div className="text-center mb-8">
          <div
            className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-5"
            style={{
              backgroundColor: `${resultat.couleur}20`,
              color: resultat.couleur,
              border: `1px solid ${resultat.couleur}40`,
            }}
          >
            {resultat.badge}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Ton profil :{" "}
            <span style={{ color: resultat.couleur }}>{resultat.titre}</span>
          </h2>
        </div>

        {/* Description principale */}
        <div className="bg-[#111111] border border-[#252525] rounded-2xl p-6 mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            {resultat.description}
          </p>
        </div>

        {/* Symptômes / signaux */}
        <div className="bg-[#111111] border border-[#252525] rounded-2xl p-6 mb-4">
          <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span style={{ color: resultat.couleur }}>🔍</span>
            Les signaux qui ne trompent pas
          </h3>
          <ul className="space-y-3">
            {resultat.symptomes.map((symptome, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 mt-0.5 font-bold"
                  style={{ color: resultat.couleur }}
                >
                  ▸
                </span>
                <span className="text-gray-300 text-sm leading-snug">
                  {symptome}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{
            backgroundColor: `${resultat.couleur}10`,
            border: `1px solid ${resultat.couleur}25`,
          }}
        >
          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <span>⚡</span> Ce que ça change dans ta vie
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {resultat.impact}
          </p>
        </div>

        {/* Solution */}
        <div className="bg-[#111111] border border-[#252525] rounded-2xl p-6 mb-8">
          <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
            <span>💡</span> La voie vers la reconstruction
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {resultat.solution}
          </p>
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <a
            href="https://charlesdenis.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full font-bold py-4 px-8 rounded-xl text-sm text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #FF0000, #CC0000)",
            }}
          >
            Parler à Charles — Réserver un appel gratuit →
          </a>
          <p className="text-gray-600 text-xs mt-3">
            Appel de découverte · Gratuit · Sans engagement
          </p>
        </div>
      </div>
    );
  }

  return null;
}
