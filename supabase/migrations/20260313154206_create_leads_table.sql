CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  lead_magnet text NOT NULL,
  answers jsonb,
  result text,
  created_at timestamptz DEFAULT now()
);
