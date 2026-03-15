CREATE TYPE lead_magnet_type AS ENUM ('sleep-score');

ALTER TABLE leads
  DROP COLUMN email,
  DROP COLUMN name,
  ADD COLUMN first_name text NOT NULL,
  ADD COLUMN last_name text NOT NULL,
  ALTER COLUMN phone SET NOT NULL,
  ALTER COLUMN lead_magnet TYPE lead_magnet_type USING lead_magnet::lead_magnet_type;
