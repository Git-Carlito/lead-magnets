import type { FatigueQuestion, FatigueType } from "./types";

export const QUESTIONS: FatigueQuestion[] = [
  {
    id: "q1",
    question: "Quand tu te réveilles le matin, comment tu te sens le plus souvent ?",
    options: [
      {
        label: "Physiquement épuisé : comme si je n'avais pas dormi",
        value: "q1_p",
        type: "physical",
      },
      {
        label: "La tête lourde : du mal à démarrer mentalement",
        value: "q1_m",
        type: "mental",
      },
      {
        label: "Vidé intérieurement : sans envie ni élan",
        value: "q1_e",
        type: "emotional",
      },
      {
        label: "J'appréhende déjà les interactions de la journée",
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
        label: "Toujours en mouvement : mon corps ne suit plus vraiment",
        value: "q2_p",
        type: "physical",
      },
      {
        label: "La surcharge de décisions : trop de choses à gérer simultanément",
        value: "q2_m",
        type: "mental",
      },
      {
        label: "Porter les émotions de mon équipe et de ma famille",
        value: "q2_e",
        type: "emotional",
      },
      {
        label: "L'isolement du dirigeant : personne ne comprend vraiment",
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
        label: "Mon corps ne se détend pas : tensions et douleurs persistantes",
        value: "q3_p",
        type: "physical",
      },
      {
        label: "Les pensées tournent en boucle : impossible de m'arrêter",
        value: "q3_m",
        type: "mental",
      },
      {
        label: "Un sentiment de vide ou de tristesse qui s'installe",
        value: "q3_e",
        type: "emotional",
      },
      {
        label: "La pression de devoir encore gérer les autres",
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
        label: "Je suis absent physiquement : toujours quelque chose à faire",
        value: "q4_p",
        type: "physical",
      },
      {
        label: "Je suis là mais ma tête est complètement ailleurs",
        value: "q4_m",
        type: "mental",
      },
      {
        label: "Je suis irritable ou je me ferme sans raison claire",
        value: "q4_e",
        type: "emotional",
      },
      {
        label: "Je me sens profondément seul même entouré de ma famille",
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
        label: "Dormir profondément et que mon corps récupère enfin",
        value: "q5_p",
        type: "physical",
      },
      {
        label: "Me vider la tête : sans écran ni décision à prendre",
        value: "q5_m",
        type: "mental",
      },
      {
        label: "Parler à quelqu'un qui comprend vraiment ce que je vis",
        value: "q5_e",
        type: "emotional",
      },
      {
        label: "Retrouver une vraie connexion avec moi-même et mes proches",
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
        label: "Douleurs chroniques, tensions, corps qui crie stop",
        value: "q6_p",
        type: "physical",
      },
      {
        label: "Concentration en baisse, oublis, décisions difficiles",
        value: "q6_m",
        type: "mental",
      },
      {
        label: "Irritabilité, tristesse, difficulté à ressentir de la joie",
        value: "q6_e",
        type: "emotional",
      },
      {
        label: "Sentiment d'incompréhension et de solitude profonde",
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
        label: "Retrouver de l'énergie physique et un corps qui récupère",
        value: "q7_p",
        type: "physical",
      },
      {
        label: "Avoir la tête claire et prendre des décisions avec fluidité",
        value: "q7_m",
        type: "mental",
      },
      {
        label: "Retrouver ma joie de vivre et mon enthousiasme",
        value: "q7_e",
        type: "emotional",
      },
      {
        label: "Me sentir vraiment compris et soutenu",
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
        label: "M'effondrer physiquement ou tomber sérieusement malade",
        value: "q8_p",
        type: "physical",
      },
      {
        label: "Perdre en performance, en créativité et en leadership",
        value: "q8_m",
        type: "mental",
      },
      {
        label: "M'éloigner de qui je suis vraiment et de ceux que j'aime",
        value: "q8_e",
        type: "emotional",
      },
      {
        label: "Me retrouver encore plus seul et incompris",
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
