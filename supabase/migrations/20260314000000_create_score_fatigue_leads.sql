-- Migration : table pour stocker les leads du quiz Score de Fatigue
-- Champs : prénom, nom, téléphone (pas d'email — intentionnel)
CREATE TABLE score_fatigue_leads (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom      text        NOT NULL,
  nom         text        NOT NULL,
  telephone   text        NOT NULL,
  lead_magnet text        NOT NULL DEFAULT 'score-fatigue',
  answers     jsonb,
  result      text,
  created_at  timestamptz DEFAULT now()
);
