import type { FatigueQuestion, FatigueType } from "./types";

export const QUESTIONS: FatigueQuestion[] = [
  {
    id: "q1",
    question: "Quand tu te réveilles le matin, comment tu te sens le plus souvent ?",
    options: [
      {
        label: "Je suis épuisé avant même de commencer",
        value: "q1_p",
        type: "physical",
      },
      {
        label: "Je suis dans le brouillard",
        value: "q1_m",
        type: "mental",
      },
      {
        label: "Je n'ai aucune envie de me lever",
        value: "q1_e",
        type: "emotional",
      },
      {
        label: "J'appréhende déjà les gens de la journée",
        value: "q1_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q1_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q2",
    question: "Dans ta vie de dirigeant, qu'est-ce qui te vide le plus d'énergie ?",
    options: [
      {
        label: "Mon corps ne tient plus le rythme",
        value: "q2_p",
        type: "physical",
      },
      {
        label: "J'ai trop de choses à gérer en même temps",
        value: "q2_m",
        type: "mental",
      },
      {
        label: "Je porte tout le monde sur mes épaules",
        value: "q2_e",
        type: "emotional",
      },
      {
        label: "Je me sens seul dans mon rôle",
        value: "q2_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q2_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q3",
    question: "Le soir, qu'est-ce qui t'empêche le plus de décompresser ?",
    options: [
      {
        label: "Mon corps reste tendu, je n'arrive pas à lâcher",
        value: "q3_p",
        type: "physical",
      },
      {
        label: "Ma tête tourne en boucle",
        value: "q3_m",
        type: "mental",
      },
      {
        label: "Je ressens un vide ou une tristesse",
        value: "q3_e",
        type: "emotional",
      },
      {
        label: "Je dois encore gérer les autres",
        value: "q3_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q3_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q4",
    question: "Quel est l'impact de ta fatigue sur tes proches ?",
    options: [
      {
        label: "Je suis toujours absent, jamais vraiment là",
        value: "q4_p",
        type: "physical",
      },
      {
        label: "Je suis là sans vraiment être là",
        value: "q4_m",
        type: "mental",
      },
      {
        label: "Je suis irritable ou je me referme",
        value: "q4_e",
        type: "emotional",
      },
      {
        label: "Je me sens seul même avec eux",
        value: "q4_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q4_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q5",
    question: "Ce qui te ressourcerait vraiment, c'est…",
    options: [
      {
        label: "Dormir vraiment et récupérer",
        value: "q5_p",
        type: "physical",
      },
      {
        label: "Me vider la tête, zéro décision",
        value: "q5_m",
        type: "mental",
      },
      {
        label: "Parler à quelqu'un qui comprend vraiment",
        value: "q5_e",
        type: "emotional",
      },
      {
        label: "Me reconnecter à moi et à mes proches",
        value: "q5_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q5_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q6",
    question: "Parmi ces symptômes, lequel te correspond le plus ?",
    options: [
      {
        label: "Mon corps crie stop",
        value: "q6_p",
        type: "physical",
      },
      {
        label: "Je n'arrive plus à me concentrer",
        value: "q6_m",
        type: "mental",
      },
      {
        label: "Je suis irritable et je ne ressens plus grand chose",
        value: "q6_e",
        type: "emotional",
      },
      {
        label: "Je me sens incompris et profondément seul",
        value: "q6_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q6_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q7",
    question: "Si tu pouvais changer une chose demain, ce serait…",
    options: [
      {
        label: "Retrouver de l'énergie et un corps qui récupère",
        value: "q7_p",
        type: "physical",
      },
      {
        label: "Avoir la tête claire",
        value: "q7_m",
        type: "mental",
      },
      {
        label: "Retrouver ma joie de vivre",
        value: "q7_e",
        type: "emotional",
      },
      {
        label: "Me sentir compris et soutenu",
        value: "q7_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q7_n",
        type: "neutral",
      },
    ],
  },
  {
    id: "q8",
    question: "Ta plus grande peur si tu ne changes rien…",
    options: [
      {
        label: "M'effondrer ou tomber vraiment malade",
        value: "q8_p",
        type: "physical",
      },
      {
        label: "Perdre mes capacités et mon leadership",
        value: "q8_m",
        type: "mental",
      },
      {
        label: "M'éloigner de ceux que j'aime",
        value: "q8_e",
        type: "emotional",
      },
      {
        label: "Finir encore plus seul",
        value: "q8_s",
        type: "social",
      },
      {
        label: "Je me sens bien sur cet aspect",
        value: "q8_n",
        type: "neutral",
      },
    ],
  },
];

/** Flat lookup: option value → fatigue type (built once at module load) */
export const OPTION_TYPE_MAP: Map<string, FatigueType> = new Map(
  QUESTIONS.flatMap((q) => q.options.map((o) => [o.value, o.type] as const)),
);
