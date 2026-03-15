import { useState } from "react";

import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type FatigueType = "physical" | "mental" | "emotional" | "social" | "neutral";
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

interface ActionItem {
  title: string;
  description: string;
}

interface FatigueResult {
  key: string;
  title: string;
  badge: string;
  signals: string[];
  risksIntro: string;
  risks: string[];
  actions: ActionItem[];
}

const QUESTIONS: FatigueQuestion[] = [
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

const RESULTS: Record<string, FatigueResult> = {
  physical: {
    key: "physical",
    title: "Fatigue Physique Chronique",
    badge: "Ton corps est en dette d'énergie",

    signals: [
      "Réveil épuisé malgré 7-8h de sommeil : le repos ne régénère plus vraiment",
      "Tensions chroniques dans la nuque, les épaules et le bas du dos",
      "Coup de barre systématique entre 14h et 16h : énergie en chute libre",
      "Digestion perturbée, intestins irritables, ventre tendu le soir",
      "Tu tiens grâce à la caféine et à la volonté : pas à ta vitalité réelle",
    ],
    risksIntro:
      "Ton corps t'envoie des signaux depuis un moment. Tu les connais. T'as juste appris à les ignorer. Voilà ce qui se passe si ça continue :",
    risks: [
      "Ton corps tourne en mode survie 24h/24. Résultat : tu tombes malade plus souvent, tu récupères 3 fois moins vite, et tu mets tout sur le compte du 'stress'. C'est pas du stress. C'est ton corps qui commence à céder.",
      "Après 40 ans, tenir dans cet état double les risques cardiaques. Le cœur paie en silence ce que tu continues d'ignorer. Et il ne prévient pas avant de lâcher.",
      "Mauvais sommeil répété depuis 6 mois, c'est le chemin direct vers des problèmes de glycémie. Pas une hypothèse. Une progression documentée sur des millions de cas.",
      "Le corps ne demande pas la permission avant de lâcher. Un matin, il dit stop. Et là, t'as plus le choix. L'arrêt qui suit dure en moyenne 3 à 6 mois. Tu peux encore l'éviter.",
    ],
    actions: [
      {
        title: "Choisis une heure de coucher et tiens-la 7 jours",
        description:
          "22h30 si tu te lèves à 6h30. 23h si tu te lèves à 7h. L'heure importe peu. Ce qui compte, c'est que ton cerveau sache à quelle heure la nuit commence. Parce que ton horloge interne ne se règle pas avec du café. Elle se règle avec de la régularité. 7 jours. Pas d'exception.",
      },
      {
        title: "Marche 15 minutes demain matin avant ton téléphone",
        description:
          "Avant le café. Avant les mails. Mets tes chaussures et sors. Le matin, ton cortisol est au pic naturellement. La lumière du soleil et le mouvement fixent ce pic à la bonne heure. Résultat : tu t'endors plus facilement le soir et tu te lèves moins cassé. C'est de la biologie, pas de la motivation.",
      },
      {
        title: "Bloque 2 séances de 25 minutes dans ton agenda",
        description:
          "Pas besoin de salle de sport. Ton salon suffit. Squat, pompes, gainage. 25 minutes, intense, c'est fini. Ton corps n'est pas fatigué parce qu'il en fait trop. Il est fatigué parce qu'il ne fait plus rien. C'est pas pareil.",
      },
    ],
  },

  mental: {
    key: "mental",
    title: "Fatigue Cognitive Avancée",
    badge: "Ton cerveau tourne à vide",

    signals: [
      "Impossible de finir une tâche avant d'en commencer une autre : ton esprit saute en permanence",
      "Sentiment de « tête pleine » qui ne lâche pas, même le weekend",
      "Oublis fréquents (mots, prénoms, rendez-vous) qui ne t'arrivaient pas avant",
      "2 heures de réunion t'épuisent autant qu'une journée entière de travail",
      "Tu lis 3 phrases, ton esprit part ailleurs : la concentration profonde a disparu",
    ],
    risksIntro:
      "T'as l'impression de fonctionner encore. C'est ça le problème. Parce que pendant ce temps, voilà ce qui se passe en coulisses :",
    risks: [
      "Un cerveau surchargé prend des décisions à 60% de ses capacités. Les décisions les plus importantes de ta boîte, tu les prends avec un cerveau à moitié HS. Pas parce que t'es nul. Parce que t'es épuisé.",
      "L'anxiété empêche de dormir. Le manque de sommeil amplifie l'anxiété. Et ça tourne tout seul. Tu vas pas sortir de là à la force du poignet.",
      "Ton cerveau ne s'arrête pas d'un coup. Il coupe progressivement : d'abord l'envie de créer, puis la vision long terme, puis l'envie de te battre pour ton projet. T'avances encore. Sans trop savoir pourquoi.",
      "Beaucoup de dirigeants font une dépression sans le savoir. La façade tient, alors personne ne voit rien. Même pas eux. C'est le profil le plus souvent diagnostiqué trop tard.",
    ],
    actions: [
      {
        title: "Identifie 3 décisions à déléguer et envoie le message",
        description:
          "Tu as des décisions dans la tête qui n'ont rien à faire là. Des trucs que ton équipe peut gérer sans toi. Identifie-en 3 ce matin. Envoie les messages avant le déjeuner. Chaque décision que tu gardes pour toi, c'est de la RAM occupée pour rien. Et ton cerveau en a une quantité limitée par jour. Utilise-la sur ce qui compte vraiment.",
      },
      {
        title: "5 minutes avec un carnet avant de dormir",
        description:
          "Ton cerveau ne s'éteint pas quand tu fermes les yeux. Il continue à tourner sur tout ce que tu n'as pas vidé. Sors-le de ta tête. Note les décisions en suspens, les trucs à ne pas oublier, ce qui tourne en boucle. Pas pour les résoudre. Juste pour les poser quelque part. Ton cerveau se calme parce qu'il sait que rien ne va être oublié. Dès la première semaine, tu dors différemment.",
      },
      {
        title: "Supprime ou délègue 2 réunions inutiles demain",
        description:
          "Regarde ton agenda de demain. Il y a au moins 2 réunions où ta présence change rien au résultat. Tu le sais déjà. Le cerveau en fatigue cognitive a besoin de plages vides pour récupérer sa capacité décisionnelle. Sans ces plages, toutes les autres actions ne servent à rien.",
      },
    ],
  },

  emotional: {
    key: "emotional",
    title: "Épuisement Émotionnel Profond",
    badge: "Tu donnes sans jamais te recharger",

    signals: [
      "Irritabilité soudaine et disproportionnée : tu t'emportes pour des détails que tu supportais avant",
      "Cynisme grandissant : les projets qui t'enthousiasmaient avant te laissent froid",
      "Difficulté à ressentir de la joie, même dans les moments familiaux importants",
      "Sentiment de vide intérieur : tu fonctionnes, tu performes, mais tu ne vis plus vraiment",
      "Le weekend ne recharge pas : tu repars le lundi aussi vide que tu étais arrivé",
    ],
    risksIntro:
      "L'épuisement émotionnel, c'est le plus difficile à voir parce qu'il touche pas ta boîte. Il touche qui tu es. Et ça, c'est plus dur à réparer :",
    risks: [
      "Sans agir, t'as 6 chances sur 10 de tomber en dépression dans les prochains mois. Je dis pas ça pour faire peur. Je dis ça parce que ce chiffre existe et que t'as encore le temps d'agir.",
      "Ta femme, tes enfants, ils absorbent ton irritabilité et ton vide sans comprendre pourquoi tu changes. Tu t'éloignes d'eux sans le vouloir. Et eux, ils souffrent en silence de l'autre côté.",
      "T'es tellement rentré dans ton rôle de patron que t'as oublié qui t'es en dehors. Et si ce rôle vacille un jour, t'as plus grand chose sur quoi t'appuyer. Ça arrive plus vite qu'on croit.",
      "Le sentiment de pas être à ta place, de pas mériter ce que t'as, ça empire quand t'es vidé émotionnellement. Et ça finit par paralyser des décisions que t'aurais prises sans hésiter avant.",
    ],
    actions: [
      {
        title: "Appelle quelqu'un à qui tu parles sans être « le patron »",
        description:
          "Tu as des rôles partout. Le patron au bureau. Le père à la maison. Le mari le soir. Le fils le dimanche. Il te faut un endroit où t'es juste toi. Un ami. Un frère. Un pote d'avant la boîte. 30 minutes sans rôle à jouer. Si cette personne n'existe plus dans ta vie, c'est ça le vrai problème. Pas ta fatigue.",
      },
      {
        title: "Fais une chose sans aucune utilité productive cette semaine",
        description:
          "Ton cerveau émotionnel se vide parce qu'il n'y a plus de plaisir pur dans ta semaine. Tout est utile. Tout est rentable. Tout sert à quelque chose. Un sport que tu aimais à 25 ans. Un film au cinéma seul. Un dîner avec ta femme sans parler boulot. Une seule chose. Bloque-la comme un RDV client. Parce que toi aussi, t'as besoin de recharger.",
      },
      {
        title: "Ce soir, dis 3 choses que tu as bien faites. À voix haute.",
        description:
          "Pas dans ta tête. À voix haute. Seul dans ta voiture, dans ta salle de bain, peu importe. Un dirigeant passe ses journées à chercher ce qui ne va pas. C'est son job. Mais ce réflexe-là, il déborde sur comment tu te vois toi-même. Et petit à petit, tu te vois comme quelqu'un qui n'en fait jamais assez. 3 choses. Ce soir. À voix haute.",
      },
    ],
  },

  social: {
    key: "social",
    title: "Isolement du Dirigeant",
    badge: "Tu portes tout, entouré mais seul",

    signals: [
      "Tu gères tout toi-même car « c'est plus simple que d'expliquer » : même ce qui pourrait être délégué",
      "Tu évites les appels non planifiés : chaque interaction non prévue te coûte de l'énergie",
      "Sentiment que personne ne peut vraiment comprendre ce que tu vis au fond",
      "Sourire de façade au bureau et à la maison : tu joues un rôle en permanence",
      "Les réunions et les dîners te vident plutôt qu'ils ne te ressourcent",
    ],
    risksIntro:
      "Seul à la tête, ça a l'air de fonctionner. Jusqu'au moment où ça ne fonctionne plus. Et là ça va vite :",
    risks: [
      "Être seul de façon chronique augmente les risques de mourir prématurément de 26%. C'est pas une métaphore, c'est de la médecine. Et ça commence bien avant qu'on se sente 'vraiment seul'.",
      "Sans quelqu'un pour te renvoyer un miroir honnête, tu prends tes décisions avec des angles morts que tu ne vois plus toi-même. Et ces angles morts, ils coûtent cher en business.",
      "Être seul de façon chronique stresse le corps autant que fumer 15 cigarettes par jour. Ton corps le paie, même si ta tête fait semblant que tout va bien.",
      "Ta femme et tes enfants sentent le mur. Ils ne savent pas comment te rejoindre là où tu es. Et cette distance, elle grandit chaque semaine sans que personne ne le dise.",
    ],
    actions: [
      {
        title: "Ce soir, envoie un message à 3 personnes perdues de vue",
        description:
          "Pas un email pro. « Ça fait longtemps, on s'appelle cette semaine ? » Trois messages. Ce soir. L'isolement du dirigeant ça s'installe pas d'un coup. C'est la semaine chargée qui devient deux semaines, puis six mois. Et un jour tu réalises que t'as plus vraiment d'amis, juste des contacts. Commence ce soir. Trois messages.",
      },
      {
        title: "Trouve un groupe de pairs dirigeants",
        description:
          "3 ou 4 CEO que tu respectes. Un déjeuner mensuel. Format simple : chacun amène un vrai problème. Pas de façade. Pas de « nous on va bien ». Ce que tu ne peux pas dire à ton équipe, tu peux le dire là. C'est le seul endroit où t'es compris sans avoir besoin d'expliquer. Envoie le premier message cette semaine.",
      },
      {
        title: "Fixe un dîner avec ta femme cette semaine, sans enfants",
        description:
          "Une règle : pas de boulot. Pas de « t'as vu le dossier machin ». Juste vous deux. Je dis pas ça pour faire joli. Je le dis parce que les dirigeants que j'accompagne en isolement profond ont souvent tous le même point commun. Leur couple est devenu une logistique. Prévois-le ce soir dans l'agenda.",
      },
    ],
  },

  mental_physical: {
    key: "mental_physical",
    title: "Double Fatigue : Corps & Cerveau",
    badge: "Corps cassé, tête qui lâche",

    signals: [
      "Corps épuisé ET tête saturée : aucun répit, ni physiquement ni mentalement",
      "Le sommeil ne récupère pas car le cerveau reste en alerte toute la nuit",
      "Café + volonté = tes seuls carburants : tu fonctionnes sur les réserves",
      "Incapacité à faire des choses simples le soir : lire, te détendre, être pleinement présent",
      "Tu sais que tu devrais « te reposer » mais tu ne sais plus comment faire",
    ],
    risksIntro:
      "Corps à plat et tête à plat en même temps, ça s'accumule deux fois plus vite. Voilà ce que ça donne si rien ne change :",
    risks: [
      "Entre 40 et 55 ans, tenir dans cet état sous pression double les risques d'hypertension et d'AVC. C'est pas la fatigue seule qui est dangereuse. C'est la double fatigue.",
      "Ton cerveau reste en alerte même la nuit. Du coup le sommeil ne répare rien. Et sans récupération nocturne, tu t'enfonces un peu plus chaque semaine. Pas dramatiquement. Progressivement.",
      "Corps et cerveau ne lâchent pas d'un coup. Ils cèdent progressivement. Et quand le dernier verrou saute, l'arrêt qui suit n'est plus un choix. C'est une conséquence.",
      "Un double burnout, ça prend en moyenne 3 à 6 mois à réparer. Pas une semaine de vacances. Pas 'je lève le pied un peu'. 3 à 6 mois d'arrêt complet. Tu peux encore éviter ça.",
    ],
    actions: [
      {
        title: "Coucher à 22h30, réveil à 6h30, tenu 7 jours d'affilée",
        description:
          "Quand le corps et le cerveau sont à plat en même temps, le sommeil est le seul levier qui travaille sur les deux simultanément. Durant le sommeil profond, ton cerveau élimine les déchets métaboliques accumulés dans la journée. C'est littéralement un nettoyage neurologique. Sans ça, la fatigue cognitive s'accumule d'une nuit à l'autre. 7 jours. Heure fixe. Sans exception.",
      },
      {
        title: "Pas de décision pro après 19h",
        description:
          "Ton cortisol redescend naturellement en fin de journée. C'est une conception qui date de l'évolution. Le soir, ton cerveau passe en mode consolidation, pas en mode décision. Forcer des décisions le soir sur un cerveau déjà à plat, c'est doubler le temps de récupération nécessaire. Zéro mail pro. Zéro sujet business après 19h. J'applique ça depuis des années. Le premier mois c'est inconfortable. Après ça devient non-négociable.",
      },
      {
        title: "2 séances de 30 minutes cette semaine, rien d'autre",
        description:
          "30 minutes chez toi. L'objectif n'est pas la performance. L'objectif c'est de relancer la circulation, abaisser le cortisol résiduel, et signaler à ton système nerveux que le danger est passé. Parce que ton corps en double fatigue est en état d'alerte chronique. Le mouvement est le seul message qu'il comprend vraiment.",
      },
    ],
  },

  emotional_physical: {
    key: "emotional_physical",
    title: "Fatigue Corps & Âme",
    badge: "Ton énergie vitale est à sec",

    signals: [
      "Corps épuisé ET réservoir émotionnel vide : tu n'as plus rien à donner à personne",
      "Les petits plaisirs physiques ont disparu : manger avec appétit, bouger par envie",
      "Tu te sens parfois « hors de ton corps » : spectateur de ta propre vie",
      "Les émotions sortent par crises après des semaines de silence intérieur",
      "Les vacances ne rechargent ni le corps ni le cœur : tu rentres aussi vide",
    ],
    risksIntro:
      "Quand le corps et le moral partent en même temps, le corps cherche d'autres façons de s'exprimer. Et ça se voit :",
    risks: [
      "Des douleurs qui apparaissent sans raison médicale claire, des maux de dos, des tensions chroniques. C'est pas dans ta tête. C'est dans ton corps. Qui exprime ce que t'as plus la force de porter autrement.",
      "Eczéma, ventre irritable, migraines récurrentes sans déclencheur. C'est pas des coïncidences. C'est ce qui arrive quand l'épuisement émotionnel reste sans réponse trop longtemps.",
      "T'es là physiquement. Mais ta famille te sent ailleurs. Les liens s'effilochent doucement, pas à cause d'un truc précis, juste parce que t'es plus vraiment présent.",
      "Si toute ton identité tient à ton rôle de patron, et que ce rôle vacille un jour, t'as plus rien sur quoi te tenir. Ça arrive. Et là, tout part en même temps.",
    ],
    actions: [
      {
        title: "10 minutes de marche demain matin sans ton téléphone",
        description:
          "10 minutes dehors, seul, sans rien dans les oreilles. Pas pour faire du sport. Pour créer une coupure entre la nuit et la journée. Quand le corps et le moral sont à plat en même temps, le matin est le moment le plus dangereux. Tu te réveilles déjà en déficit. Ces 10 minutes, elles te remettent dans ton corps avant que la journée prenne le contrôle.",
      },
      {
        title: "Note une émotion que tu as ressentie aujourd'hui",
        description:
          "« J'ai ressenti [émotion] quand [situation]. » C'est tout. Pas d'analyse. Pas de solution. Juste nommer. Les dirigeants qui cumulent fatigue physique et fatigue morale ont souvent arrêté de ressentir. Pas parce qu'ils n'ont plus d'émotions. Parce qu'ils n'ont plus le temps de les remarquer. Et ce qui n'est pas remarqué s'accumule. 2 minutes, ce soir.",
      },
      {
        title: "Reprends une activité que tu avais avant ta boîte",
        description:
          "Qu'est-ce que tu faisais à 28 ans le samedi matin ? Un sport. Une balade. Un truc qui n'avait aucun rapport avec ton business. Bloque une heure cette semaine. Ton corps et ton moral ont besoin d'un signal que ta vie ne se résume pas à ta boîte. C'est pas du luxe. C'est de la maintenance.",
      },
    ],
  },

  physical_social: {
    key: "physical_social",
    title: "Isolement & Épuisement Physique",
    badge: "Seul avec un corps à bout",

    signals: [
      "Corps épuisé ET sentiment de solitude profonde : une combinaison particulièrement lourde",
      "Tu évites les sorties car tu n'as plus l'énergie de « jouer le rôle » en société",
      "Les activités sociales t'épuisent physiquement : même un dîner d'amis te vide",
      "Tu préfères annuler plutôt qu'affronter la fatigue du paraître",
      "Les vacances ne te ressourcent plus : tu rentres aussi vide que tu es parti",
    ],
    risksIntro:
      "Corps épuisé et solitude en même temps, c'est une spirale qui se referme seule. Voilà comment :",
    risks: [
      "Moins t'as d'énergie, moins tu sors. Moins tu sors, plus c'est dur de sortir. À un moment, tu ne sors plus. Pas parce que tu veux pas. Parce que t'en as plus la force.",
      "Corps épuisé et manque de contact humain ensemble, ça affaiblit ton système immunitaire deux fois plus vite. Ton corps paie les deux en même temps.",
      "Ton réseau se vide en silence. Dans 12 à 18 mois, tu verras l'impact direct sur tes opportunités. Les connexions perdues, ça ne se reconstruit pas aussi vite que ça se perd.",
      "Corps fatigué et solitude ensemble, c'est le terrain le plus documenté pour glisser vers la dépression. T'es pas obligé d'attendre d'y être pour agir.",
    ],
    actions: [
      {
        title: "Inscris-toi à un sport en groupe cette semaine",
        description:
          "Le sport seul, c'est bien. Le sport avec d'autres, c'est différent. Quand tu joues au padel avec des amis, ton cerveau libère de l'ocytocine. C'est la molécule du lien social. Elle abaisse le cortisol et réduit la fatigue physique perçue. Moi je vais à la boxe 2 fois par semaine. C'est la seule routine que je ne négocie jamais. Padel, tennis, foot, peu importe. Mais trouve quelque chose avec des gens.",
      },
      {
        title: "Marche 20 minutes ce soir avant de rentrer chez toi",
        description:
          "Gare ta voiture plus loin. 20 minutes à pied entre le bureau et la maison. C'est le sas de décompression que ton cerveau n'a jamais. Tu passes du mode « patron sous pression » au mode « père et mari ». Sans cette transition, tu rentres avec tout le stress de la journée sur les épaules. Ta femme et tes enfants reçoivent la version épuisée et tendue. Ils méritent mieux. Toi aussi.",
      },
      {
        title: "Ce week-end, prévois une activité physique avec un ami",
        description:
          "Pas un dîner. Une activité où le corps bouge. Randonnée, padel, vélo, peu importe. Le mouvement avec quelqu'un d'autre, ça règle les deux problèmes en même temps. Envoie le message ce soir.",
      },
    ],
  },

  emotional_mental: {
    key: "emotional_mental",
    title: "Surcharge Mentale & Vide Émotionnel",
    badge: "Tu penses trop, tu ressens plus",

    signals: [
      "Tu analyses tout de façon compulsive : même tes émotions deviennent des problèmes à résoudre",
      "Sentiment d'être « déconnecté » de tes propres ressentis : tu sais mais ne ressens plus",
      "Tu as perdu le sens de ce que tu fais vraiment : le « pourquoi profond » s'est évaporé",
      "Les décisions difficiles t'obsèdent la nuit mais te laissent étrangement froid le jour",
      "Tu fonctionnes encore : mais sur pilote automatique, sans étincelle",
    ],
    risksIntro:
      "Quand la tête tourne en boucle et que t'arrives plus à ressentir quoi que ce soit, voilà ce qui s'installe si rien ne change :",
    risks: [
      "T'arrives plus à trouver du plaisir dans ce qui te plaisait avant. Même les trucs qui comptaient vraiment. Si tu laisses ça s'installer, ça glisse vers la dépression. Pas d'un coup. Progressivement.",
      "Tes équipes le sentent avant toi. Tes décisions deviennent froides, tu te coupes progressivement des gens. Les meilleurs partent, pas à cause d'un conflit, mais parce qu'ils sentent que t'es plus vraiment là.",
      "T'es là physiquement. Mais ta femme te sent absent. Une relation ne se brise pas dans un éclat. Elle s'use dans l'absence silencieuse de mois et d'années.",
      "Quand le sens de ce que tu fais disparaît, t'es à deux doigts de prendre des décisions que tu regretteras. Quitter ce que t'as construit. Lâcher ce qui comptait. Pas dans un moment de lucidité. Dans un moment de vide.",
    ],
    actions: [
      {
        title: "5 minutes pour toi avant que la maison s'anime",
        description:
          "Dans ta voiture avant de rentrer. Dans le jardin après le dîner. 5 minutes les yeux fermés. Tu laisses les pensées défiler sans les attraper. Ton cerveau en surcharge mentale traite en permanence. Il n'a jamais de mode pause. Cette coupure, même courte, abaisse les marqueurs inflammatoires liés au stress chronique. Ce n'est pas de la méditation. C'est juste donner à ton cerveau 5 minutes sans input.",
      },
      {
        title: "Note une chose qui t'a marqué cette semaine",
        description:
          "Quelque chose qui t'a touché. Qui t'a mis en colère. Qui t'a surpris. Note-le. Un dirigeant en surcharge mentale et vide émotionnel vit dans sa tête, jamais dans ses ressentis. Le résultat, c'est un homme qui prend de bonnes décisions business et de mauvaises décisions humaines. Parce qu'il ne sait plus lire ce qu'il ressent. Ça commence par remarquer. Juste remarquer.",
      },
      {
        title: "Fais ce que t'as envie de faire",
        description:
          "Pas ce qui est utile. Pas ce qui est rentable. Ce que t'as envie. Un week-end avec des amis. Un restaurant que tu aimes vraiment. Un truc qui te fait sourire. Ton cerveau émotionnel se reconstruit par le plaisir spontané. Pas par les obligations bien gérées.",
      },
    ],
  },

  mental_social: {
    key: "mental_social",
    title: "Surcharge Cognitive & Solitude",
    badge: "Seul dans ta tête, seul dans ta vie",

    signals: [
      "Tu fuis les conversations car tu n'as plus de bande passante cognitive pour les autres",
      "Les interactions sociales te coûtent énormément : même avec tes proches",
      "Tu réponds en pilote automatique dans les réunions et les dîners familiaux",
      "Tu te retrouves à penser à autre chose pendant les conversations importantes",
      "Sentiment d'être « le seul à vraiment comprendre » les enjeux : et ce poids t'isole",
    ],
    risksIntro:
      "Tête saturée et seul à la fois, ça forme une boucle. La tête tourne, personne pour t'aider à la vider. Et ça donne ça :",
    risks: [
      "Seul avec ta tête, tu tournes en rond dans tes propres biais sans t'en rendre compte. Tu prends des décisions dans un angle de vue de plus en plus étroit. Et ton business en paie le prix.",
      "Cerveau saturé et solitude, c'est le terrain idéal pour l'anxiété de fond et la dépression masquée. Tu peux fonctionner encore des mois comme ça. Mais à un moment, ça cède.",
      "Tes amis, tes pairs, tes vrais contacts, ils s'effacent progressivement. En période de crise, t'auras personne à qui vraiment appeler. Et les crises arrivent toujours au pire moment.",
      "T'as de moins en moins de recul sur ce que tu fais. Tu rates des évidences que tout le monde voit sauf toi. Ton équipe le voit. Tes associés le voient. Toi pas encore.",
    ],
    actions: [
      {
        title: "Délègue une décision demain matin",
        description:
          "Une seule. La moins stratégique de ta journée. Avant d'ouvrir ta messagerie perso. Les dirigeants que j'accompagne avec ce profil portent en moyenne 3 fois plus de décisions qu'ils ne devraient. Pas parce que les autres ne sont pas capables. Parce qu'ils ont pris l'habitude de tout faire eux-mêmes. Et cette habitude coûte cher cognitivement. Une décision déléguée par jour. Sur une semaine, tu vas sentir la différence.",
      },
      {
        title: "Ce week-end, appelle un ami et parle-lui de ce qui te pèse",
        description:
          "Pas « ça va bien, toi ? ». Un vrai échange. 20 minutes. Un cerveau saturé qui tourne en boucle dans sa propre tête finit par confondre ses peurs avec la réalité. Un regard extérieur, même non expert, débloque souvent ce que des heures de réflexion seul ne débloquent pas. La solitude cognitive, ça s'appelle ça. Et ça se soigne avec du contact humain réel.",
      },
      {
        title: "Chaque vendredi soir, 10 minutes pour vider ta semaine",
        description:
          "Ce qui est fait. Ce qui reste. Ce qui te préoccupe encore. Mon week-end commence à ce moment-là. Pas quand je ferme l'ordinateur. Quand j'ai tout sorti de ma tête sur le papier. C'est la seule façon d'être vraiment présent chez moi le vendredi soir. Dès la première semaine, tes proches sentent la différence.",
      },
    ],
  },

  all_good: {
    key: "all_good",
    title: "Tout va bien apparemment",
    badge: "Sérieusement ?",

    signals: [],
    risksIntro: "",
    risks: [],
    actions: [],
  },

  emotional_social: {
    key: "emotional_social",
    title: "Vide Émotionnel & Solitude Profonde",
    badge: "Tu souffres en silence depuis trop longtemps",

    signals: [
      "Tu te sens incompris par tous : équipe, famille, amis : même par ceux qui t'aiment vraiment",
      "Les conversations superficielles te pèsent énormément : tu cherches de la profondeur mais n'oses pas",
      "Tu as des choses importantes à dire mais tu ne sais plus à qui ni comment les dire",
      "Une tristesse sourde s'est installée : pas assez forte pour crier, mais toujours là",
      "Tu te demandes parfois si les autres ressentent la même chose ou si c'est juste toi",
    ],
    risksIntro:
      "C'est le profil le plus dur à porter parce que t'es seul à l'intérieur. Et à l'extérieur, ça tient encore. Donc personne ne voit rien. Voici pourquoi c'est urgent :",
    risks: [
      "C'est le profil qui présente le risque le plus élevé de dépression sévère parmi les 15. Je te le dis pas pour te faire peur. Je te le dis pour que tu agisses maintenant, pas dans 3 semaines.",
      "Les dirigeants qui finissent par se suicider ressemblent souvent à ce profil : performants en façade, personne ne les entend en dedans. Personne ne l'avait vu venir. Ne minimise pas ce que tu vis.",
      "Tes proches veulent t'aider. Mais comme tu ne montres rien, ils ne savent pas comment. Et eux aussi se sentent impuissants. Cette distance grossit chaque semaine sans que personne ne le dise.",
      "Dans cet état, on prend des décisions qu'on regrette. Sa boîte, sa famille, sa santé. Des décisions irréversibles prises dans un moment de vide. Et regrettées après.",
    ],
    actions: [
      {
        title: "Prends rendez-vous avec moi aujourd'hui",
        description:
          "Pas cette semaine. Aujourd'hui. Ce profil-là, je le connais bien. C'est souvent celui qui attend le plus longtemps avant de demander de l'aide. Parce qu'il est habitué à gérer seul. Parce qu'il pense que ça va passer. Ça ne passe pas. Ça s'accumule. On en parle ensemble. Sans jugement. C'est mon métier.",
      },
      {
        title: "Ce soir, envoie un vrai message à quelqu'un de confiance",
        description:
          "« Je ne vais pas super bien en ce moment. J'aurais besoin d'en parler. » Juste ça. Pas d'explication. Pas de justification. Je le dis à tous mes clients dans cette situation : envoie-le ce soir. Parce que demain, tu trouves une raison de ne pas le faire. Et dans 6 mois, t'es toujours au même endroit.",
      },
      {
        title: "Ce soir, dis 3 choses que tu as bien faites. À voix haute.",
        description:
          "Une main sur la poitrine. Trois choses. C'est le truc le plus dur quand ça fait des mois que tu te négliges. Le vide émotionnel chez un dirigeant, c'est souvent ça au fond. Un homme qui a appris à prendre soin de tout le monde sauf de lui-même. Ton cerveau peut se recâbler. Mais ça commence par ce soir.",
      },
    ],
  },

  emotional_mental_physical: {
    key: "emotional_mental_physical",
    title: "Triple Épuisement : Corps, Cerveau & Émotions",
    badge: "Tu es à bout sur tous les fronts sauf un",

    signals: [
      "Corps épuisé, tête saturée ET réservoir émotionnel à sec : tu fonctionnes encore, mais tu ne sais plus comment",
      "Réveil épuisé, journée à survivre, soirée à tenir : le repos ne répare plus rien",
      "Tu ressens de moins en moins, comme une anesthésie progressive de tout ce qui compte",
      "Les décisions te coûtent doublement : cognitivement ET émotionnellement",
      "Tu n'es pas seul, mais tu n'as plus l'énergie de vraiment te connecter aux autres",
    ],
    risksIntro:
      "Les trois en même temps, ça s'accélère vite. Et ça ne se voit pas de l'extérieur. C'est ça qui est dangereux :",
    risks: [
      "Quand les trois lâchent en même temps, le burnout complet peut arriver sans prévenir. Pas le burn-out dont tout le monde parle. Celui qui impose 6 à 12 mois d'arrêt médical.",
      "Ton cerveau commence à couper les émotions pour se protéger. Et avec les émotions, il coupe aussi l'envie, l'empathie, et la capacité à voir ce qui compte. Tu tournes encore. Mais à vide.",
      "T'as encore des gens autour de toi. Mais chaque semaine que tu laisses passer sans rien faire, tu t'en éloignes un peu plus. À un moment, ils arrêtent de cogner à la porte.",
      "Les décisions que tu prends dans cet état ne sont plus vraiment les tiennes. T'es trop épuisé pour peser les choses correctement. Et ton business absorbe des erreurs que t'aurais jamais faites avant.",
    ],
    actions: [
      {
        title: "Couche-toi tôt ce soir et préviens ta famille",
        description:
          "Quand les trois sont à plat, le sommeil est la seule chose qui travaille sur tout simultanément. C'est pendant le sommeil profond que le cortisol chute, que les émotions se consolident, que le cerveau se nettoie. 22h00, au lit. Pas de téléphone. Pas de Netflix. Préviens ta femme ce soir même : c'est pas une lubie, c'est une nécessité médicale. Les premiers effets arrivent en 4 ou 5 jours.",
      },
      {
        title: "Demain, appelle quelqu'un et dis-lui vraiment où t'en es",
        description:
          "Pas « ça va, c'est chargé ». Ce qui se passe vraiment. 20 minutes. Tu n'as pas besoin qu'il résolve quoi que ce soit. Juste qu'il entende. Verbaliser un état d'épuisement à quelqu'un qui t'écoute abaisse le cortisol en quelques minutes. Ce n'est pas anecdotique. C'est mesuré. C'est souvent le premier vrai soulagement depuis des mois.",
      },
      {
        title: "Cette semaine : rien de pro après 19h, sans exception",
        description:
          "Pas de « juste ce mail rapide ». RIEN. Si t'as pas fini avant 19h, c'est un problème d'organisation, pas de temps. Cette règle seule, tenue une semaine, change la qualité de ton sommeil, ton humeur au réveil, et l'énergie que tu as pour ta famille. Une semaine. Tu verras.",
      },
    ],
  },

  mental_physical_social: {
    key: "mental_physical_social",
    title: "Corps Épuisé, Tête Saturée, Tribu Perdue",
    badge: "Tu fonctionnes encore, mais de plus en plus seul",

    signals: [
      "Corps épuisé ET cerveau saturé, mais tu ressens encore les choses : tu n'es pas anesthésié",
      "Tu fuis les interactions sociales parce que tu n'as plus la bande passante pour les gérer",
      "Tu gères tout seul par réflexe, même ce que tu pourrais déléguer",
      "Ton réseau s'érode sans que tu t'en rendes vraiment compte",
      "Tu performes encore en façade, mais tu sais que les réserves sont presque à zéro",
    ],
    risksIntro:
      "Corps épuisé, tête pleine, seul à gérer tout ça. C'est une combinaison qui avance vite et en silence. Voilà où elle mène :",
    risks: [
      "Chaque jour dans cet état, tu décides avec 40% de capacité en moins. Tu prends les mêmes décisions qu'avant, mais avec la moitié du cerveau. Et tu le remarques de moins en moins. C'est ça le vrai problème.",
      "Tes contacts s'espacent. Dans 12 à 18 mois, tu verras l'impact direct sur tes opportunités. Pas les opportunités en théorie. Celles qui te passent vraiment sous le nez.",
      "Corps épuisé et tête saturée se nourrissent l'un l'autre. Le corps bloque la récupération mentale. La tête bloque la récupération physique. Sans sortir de cette boucle, elle ne s'arrête pas seule.",
      "L'isolement amplifie tout. Sans quelqu'un pour te dire 'hé, t'as tort là', tu t'enfonces dans des directions que t'aurais jamais prises avec un regard extérieur.",
    ],
    actions: [
      {
        title: "7h de sommeil minimum cette semaine, heure fixe",
        description:
          "Pas 6h45. 7h minimum. Ton corps et ton cerveau en surcharge ont besoin de cycles complets pour récupérer. Un cycle de sommeil dure 90 minutes. En dessous de 7h, tu coupes le dernier cycle. C'est exactement là que se fait la récupération cognitive. Choisis ton heure ce soir. Tiens-la à ±15 minutes toute la semaine.",
      },
      {
        title: "Délègue 2 décisions demain avant d'ouvrir tes mails",
        description:
          "Identifie-les ce soir. Prépare les messages. Envoie-les demain matin avant d'ouvrir ta messagerie perso. Parce que si tu ouvres les mails en premier, tu seras en mode réactif pour le reste de la journée. Et les décisions à déléguer, elles ne partiront jamais.",
      },
      {
        title: "Ce week-end, prévois une heure en dehors de ta famille et de ton équipe",
        description:
          "Un déjeuner avec un pair. Un sport avec un ami. Quelqu'un qui te voit en dehors de tous tes rôles. Ta famille t'aime. Ton équipe te respecte. Mais ni l'un ni l'autre ne peut te donner ce qu'un pair te donne. Ce sentiment d'être compris sans avoir à expliquer.",
      },
    ],
  },

  emotional_physical_social: {
    key: "emotional_physical_social",
    title: "Corps, Moral et Liens à Reconstruire",
    badge: "Tu penses encore, mais ton corps et ton moral sont à zéro",

    signals: [
      "Corps épuisé, réservoir émotionnel vide ET sentiment de solitude profonde",
      "Tu penses encore clairement, mais tu n'as plus l'énergie de passer à l'action",
      "Tu évites les gens non pas par choix mais parce que ça te coûte trop",
      "Tu te sens incompris, même par les proches qui t'aiment vraiment",
      "Ton corps exprime ce que tu ne peux plus contenir : tensions, maux sans cause claire",
    ],
    risksIntro:
      "T'as encore la tête froide. C'est la bonne nouvelle. C'est aussi la seule chose qui te reste. Et sans action, même ça finit par lâcher :",
    risks: [
      "Corps épuisé et moral à plat ensemble, c'est le terrain le plus direct pour une vraie dépression. Pas la tristesse passagère. Celle qui t'immobilise et qui prend du temps à réparer.",
      "Ton corps parle déjà. Des douleurs qui arrivent sans raison, le ventre irritable, des tensions que tu mets sur le compte du boulot. C'est pas le boulot. C'est ton corps qui exprime ce que t'arrives plus à sortir autrement.",
      "Sans liens vrais, le vide émotionnel s'approfondit. Et l'isolement et le moral à plat ensemble, ça s'aggrave chaque semaine. Pas d'un coup. Progressivement.",
      "Aujourd'hui tu penses encore clairement. Mais quand le corps et le moral sont à plat depuis trop longtemps, la clarté finit par partir aussi.",
    ],
    actions: [
      {
        title: "Marche 20 minutes chaque matin avant tout le reste",
        description:
          "Avant le café. Avant les mails. Mets tes chaussures et sors. Ces 20 minutes agissent simultanément sur les trois problèmes. Le corps se réveille et le cortisol se régule. Le moral remonte parce que le mouvement libère de la dopamine. Et t'es seul avec toi-même, sans rôle à jouer. Le premier matin c'est dur. À partir du troisième, tu comprends pourquoi.",
      },
      {
        title: "Ce soir : « Je ne vais pas super bien, on se voit ? »",
        description:
          "Juste cette phrase. À ta femme. À un ami proche. Ton moral à plat coupe l'élan naturel de te connecter aux autres. C'est un mécanisme de protection. Ton cerveau pense qu'il protège ton énergie en évitant le contact. En réalité, il t'isole. Contourne-le. Envoie le message maintenant.",
      },
      {
        title: "Ce week-end, fais une activité physique avec quelqu'un",
        description:
          "Padel, randonnée, vélo. Peu importe. Corps qui bouge et contact humain réel. Les deux leviers les plus puissants sur ce profil, combinés en une heure.",
      },
    ],
  },

  emotional_mental_social: {
    key: "emotional_mental_social",
    title: "Tête Saturée, Moral à Plat, Seul",
    badge: "Physiquement debout, intérieurement à genoux",

    signals: [
      "Cerveau saturé, réservoir émotionnel vide ET isolement progressif : ton corps est le seul levier intact",
      "Tu penses trop, tu ressens de moins en moins, tu te retrouves seul avec tout ça",
      "Les interactions te coûtent tellement que tu les évites, même avec les proches",
      "Tu fonctionnes encore physiquement, mais de l'intérieur tout tourne en boucle",
      "Sentiment de déconnexion de toi-même et des autres, comme si tu regardais ta vie de l'extérieur",
    ],
    risksIntro:
      "Tête saturée, moral à plat et solitude en même temps. Ça forme une boucle fermée. Les trois se renforcent. Et ton corps, c'est ton seul point de sortie :",
    risks: [
      "La tête saturée coupe les émotions. Le vide émotionnel isole encore plus. La solitude surcharge encore plus la tête. Tu vois la boucle. Elle ne s'arrête pas seule.",
      "Seul dans ta tête sans personne pour te donner un retour honnête, t'es en train de rater des évidences que tu verrais en deux minutes avec un regard extérieur. Et ça a un coût.",
      "Moral à plat et solitude ensemble, c'est le terrain le plus documenté pour une dépression masquée. Tu fonctionnes encore. Mais chaque semaine, ça coûte un peu plus cher.",
      "Tes équipes le sentent avant toi. Pas forcément à travers ce que tu dis. À travers ce que t'es plus. Et les meilleurs savent lire ça.",
    ],
    actions: [
      {
        title: "3 séances de 25 minutes cette semaine, pas seul",
        description:
          "Ton corps est le seul levier encore intact. Et c'est une bonne nouvelle. Parce que 25 minutes d'effort intense libèrent du BDNF. C'est la protéine qui stimule la neuroplasticité, réduit l'anxiété et améliore l'humeur. Les effets durent 4 à 6 heures après la séance. Si tu le fais avec quelqu'un, tu règles aussi l'isolement. Padel, muscu, HIIT. Court, intense, pas seul.",
      },
      {
        title: "Chaque soir : 3 lignes dans un carnet, format imposé",
        description:
          "Une chose qui t'a touché dans la journée. Une tâche qui tourne dans ta tête, pour la sortir. Une chose qui s'est bien passée. 3 minutes. C'est tout. En 7 jours, tu dors mieux. En 14 jours, t'es moins à cran. Ce n'est pas de la philosophie. C'est de la régulation du système nerveux autonome par l'écriture. Et ça marche.",
      },
      {
        title: "Prends rendez-vous avec moi",
        description:
          "Les trois problèmes se renforcent mutuellement sur ce profil. La tête saturée empire le moral. Le moral à plat coupe le lien social. L'isolement surcharge encore plus la tête. Pour casser cette boucle, il faut un regard extérieur. C'est exactement ce que je fais. Ce n'est pas une faiblesse de demander de l'aide. C'est la décision la plus intelligente que tu puisses prendre.",
      },
    ],
  },

  emotional_mental_physical_social: {
    key: "emotional_mental_physical_social",
    title: "Épuisement Total",
    badge: "Plus rien ne tient. Ni le corps, ni la tête, ni le moral, ni les liens",

    signals: [
      "Corps, cerveau, émotions ET lien social : les quatre sont à plat en même temps",
      "Tu tiens encore par habitude, pas par énergie",
      "Chaque interaction, chaque décision, chaque effort te coûte plus que tu ne le récupères",
      "Tu as l'impression d'être spectateur de ta propre vie",
      "Tu le sais, au fond. Mais tu continues parce que tu ne sais pas comment faire autrement",
    ],
    risksIntro:
      "Les quatre en même temps. C'est plus de la fatigue, c'est une urgence silencieuse. Et le problème avec les urgences silencieuses, c'est que personne ne voit rien jusqu'au moment où tout lâche :",
    risks: [
      "Un burnout à ce stade, il ne prévient pas. Il frappe. Et la récupération prend entre 12 et 18 mois. Pas une semaine de vacances, pas 'je ralentis un peu'. 12 à 18 mois. T'as encore le choix d'éviter ça.",
      "Ton corps accumule une dette qu'il ne peut plus rembourser à la force de la volonté. Le cœur, la glycémie, le système immunitaire, tout est sollicité en même temps.",
      "Ta femme sent le mur. Tes enfants le sentent. Ton équipe aussi. Mais tout le monde attend que tu fasses le premier pas. Et pendant ce temps, la distance grandit.",
      "Dans cet état, on prend des décisions qu'on regrette. Quitter quelque chose. Lâcher quelqu'un. Des décisions irréversibles prises dans un moment de vide total. Pas de lucidité. Du vide.",
    ],
    actions: [
      {
        title: "Appelle ton médecin aujourd'hui. Pas cette semaine. Aujourd'hui.",
        description:
          "Quatre fronts à plat simultanément, ce n'est plus de la gestion du stress. C'est une urgence médicale silencieuse. Ton médecin peut évaluer où t'en es et t'éviter l'arrêt brutal non choisi. Passe cet appel avant de fermer cette page. Les dirigeants que j'ai accompagnés dans cette situation ont tous dit la même chose après : « J'aurais dû appeler 6 mois plus tôt. »",
      },
      {
        title: "Ce soir, dis à quelqu'un de proche vraiment où t'en es",
        description:
          "Pas « c'est une période compliquée ». « Je suis épuisé et j'ai besoin d'aide. » Une phrase. À ta femme. À un ami. Je sais que t'as l'habitude de gérer seul. Mais là, gérer seul, c'est ce qui t'a amené ici.",
      },
      {
        title: "Demain matin : une seule chose. Marche 10 minutes dehors.",
        description:
          "Pas un programme. Pas un plan de remise en forme. Une chose. 10 minutes. Demain matin. Sans téléphone, sans podcast. Quand tout s'effondre en même temps, le mouvement minimal est le point d'entrée universel. Ton corps, ton cerveau et tes émotions reçoivent tous un signal de vie. Une seule chose.",
      },
    ],
  },
};

function calculateResult(answers: Record<string, string>): FatigueResult {
  type ActiveType = "physical" | "mental" | "emotional" | "social";
  const scores: Record<ActiveType, number> = {
    physical: 0,
    mental: 0,
    emotional: 0,
    social: 0,
  };

  Object.values(answers).forEach((answerValue) => {
    for (const question of QUESTIONS) {
      const option = question.options.find((o) => o.value === answerValue);
      if (option && option.type !== "neutral") {
        scores[option.type as ActiveType]++;
        break;
      }
    }
  });

  const totalActive = Object.values(scores).reduce((sum, s) => sum + s, 0);
  if (totalActive === 0) {
    return RESULTS["all_good"];
  }

  const sorted = (Object.keys(scores) as ActiveType[]).sort((a, b) => scores[b] - scores[a]);
  const [first, second, third, fourth] = sorted;
  const topScore = scores[first];

  // A type is "dominant" if within 1 point of top score AND has >= 2 answers
  const isDominant = (t: ActiveType) => scores[t] >= topScore - 1 && scores[t] >= 2;

  if (isDominant(second) && isDominant(third) && isDominant(fourth)) {
    const quadKey = [first, second, third, fourth].sort().join("_");
    if (quadKey in RESULTS) return RESULTS[quadKey];
  }

  if (isDominant(second) && isDominant(third)) {
    const tripleKey = [first, second, third].sort().join("_");
    if (tripleKey in RESULTS) return RESULTS[tripleKey];
  }

  if (isDominant(second)) {
    // Canonical key: types sorted alphabetically for consistency
    const doubleKey = [first, second].sort().join("_");
    if (doubleKey in RESULTS) return RESULTS[doubleKey];
  }

  return RESULTS[first];
}

export function ScoreFatigueShell() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inTransition, setInTransition] = useState(false);
  const [result, setResult] = useState<FatigueResult | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const currentQuestion = QUESTIONS[questionIndex];
  const isLastQuestion = questionIndex === QUESTIONS.length - 1;
  const progressPct = (questionIndex / QUESTIONS.length) * 100;

  function handleSelectOption(value: string) {
    if (inTransition) return;
    setInTransition(true);

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);

    // Delay for transition animation
    setTimeout(() => {
      if (isLastQuestion) {
        const res = calculateResult(newAnswers);
        setResult(res);
        setPhase("gate");
      } else {
        setQuestionIndex((i) => i + 1);
      }
      setInTransition(false);
    }, 450);
  }

  function handleGoBack() {
    if (questionIndex > 0 && !inTransition) {
      setQuestionIndex((i) => i - 1);
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setFormError("Tous les champs sont obligatoires pour accéder à ton analyse.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 6) {
      setFormError("Merci d'entrer un numéro de téléphone valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      await getSupabase().from("leads").insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        lead_magnet: "sleep-score",
        answers,
        result: result?.key,
      });
    } catch (error) {
      console.warn("Supabase not configured, continuing without saving:", error);
    } finally {
      setIsSubmitting(false);
      setPhase("result");
    }
  }

  if (phase === "quiz") {
    return (
      <div
        className={cn(
          "transition-all duration-300",
          inTransition ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between">
            <div className="w-16 flex-shrink-0">
              {questionIndex > 0 && (
                <button
                  onClick={handleGoBack}
                  disabled={inTransition}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 3L4.5 7L8.5 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Retour
                </button>
              )}
            </div>

            <span className="text-muted-foreground text-center text-xs font-medium tracking-widest uppercase">
              Question {questionIndex + 1} / {QUESTIONS.length}
            </span>

            <div className="flex w-16 flex-shrink-0 justify-end">
              <span className="text-primary text-xs font-bold">{Math.round(progressPct)}%</span>
            </div>
          </div>
          <div className="bg-muted h-[3px] w-full overflow-hidden rounded-full">
            <div
              className="from-primary to-primary/40 h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <h2 className="text-foreground mb-8 text-base leading-snug font-bold md:text-2xl">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                disabled={inTransition}
                className={cn(
                  "group w-full cursor-pointer rounded-2xl border px-5 py-4 text-left text-sm leading-snug transition-all duration-150 disabled:cursor-not-allowed",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground/80 hover:border-primary hover:bg-primary/10 hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-150",
                      isSelected
                        ? "border-primary bg-primary border-2"
                        : "border-muted group-hover:border-primary border",
                    )}
                  >
                    {isSelected && <div className="bg-foreground h-1.5 w-1.5 rounded-full" />}
                  </div>
                  <span>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === "gate") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 text-center">
          <div className="border-primary/30 bg-primary/10 text-primary/70 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wider uppercase">
            <span>✓</span>
            <span>Quiz terminé : Ton analyse est prête</span>
          </div>

          <h2 className="text-foreground mb-3 text-2xl font-bold md:text-3xl">
            Accède à ton profil de fatigue
          </h2>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
            Remplis tes informations ci-dessous. Je t'enverrai ton analyse personnalisée et pourrai
            te contacter directement.
          </p>
        </div>

        <form onSubmit={handleSubmitForm} className="mx-auto max-w-sm space-y-4">
          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
              Prénom <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ton prénom"
              autoComplete="given-name"
              className="border-border bg-card text-foreground placeholder-muted-foreground/70 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
              Nom <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ton nom de famille"
              autoComplete="family-name"
              className="border-border bg-card text-foreground placeholder-muted-foreground/70 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
              Téléphone <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const cleanedValue = e.target.value.replace(/[^0-9\s+\-().]/g, "");
                setPhone(cleanedValue);
              }}
              placeholder="+33 6 12 34 56 78"
              autoComplete="tel"
              inputMode="tel"
              className="border-border bg-card text-foreground placeholder-muted-foreground/70 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none"
            />
          </div>

          {formError && (
            <div className="border-primary/30 bg-primary/10 rounded-xl border px-4 py-3">
              <p className="text-primary/70 text-xs">{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "text-primary-foreground mt-2 w-full rounded-xl px-6 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              isSubmitting ? "bg-primary/50" : "from-primary to-primary/80 bg-gradient-to-br",
            )}
          >
            {isSubmitting ? "Chargement de ton analyse…" : "Découvrir mon profil de fatigue →"}
          </button>

          <p className="text-muted-foreground/70 text-center text-xs leading-relaxed">
            🔒 Tes informations restent confidentielles.
            <br />
            Aucun spam : juste ton analyse et un contact humain.
          </p>
        </form>
      </div>
    );
  }

  if (phase === "result" && result?.key === "all_good") {
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

        <a
          href="https://wa.me/971585909220?text=Bonjour%20Charles%2C%20je%20viens%20de%20faire%20ton%20test%20de%20fatigue.%20J%27aimerais%20en%20parler%20avec%20toi."
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground mb-3 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(135deg,#25D366,#128C7E)] px-8 py-4 text-sm font-bold transition-all duration-200 hover:opacity-90"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Parler à Charles sur WhatsApp
        </a>
        <p className="text-muted-foreground/70 text-xs">
          Réponse rapide · Gratuit · Sans engagement
        </p>
      </div>
    );
  }

  if (phase === "result" && result) {
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
                <span className="text-primary mt-0.5 flex-shrink-0 font-bold">▸</span>
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
                <span className="mt-0.5 flex-shrink-0 font-bold text-orange-400">→</span>
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

        <div className="text-center">
          <a
            href="https://wa.me/971585909220?text=Bonjour%20Charles%2C%20je%20viens%20de%20faire%20ton%20test%20de%20fatigue.%20J%27aimerais%20en%20parler%20avec%20toi."
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(135deg,#25D366,#128C7E)] px-8 py-4 text-sm font-bold transition-all duration-200 hover:opacity-90"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Parler à Charles sur WhatsApp
          </a>
          <p className="text-muted-foreground/70 mt-3 text-xs">
            Réponse rapide · Gratuit · Sans engagement
          </p>
        </div>
      </div>
    );
  }

  return null;
}
