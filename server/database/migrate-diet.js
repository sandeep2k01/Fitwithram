/**
 * Run this once in Supabase SQL Editor to add diet tracking tables.
 * Copy-paste the SQL below into your Supabase dashboard → SQL Editor.
 */

const SQL = `
-- ─── DIET TARGETS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS diet_targets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  calories    INTEGER NOT NULL DEFAULT 2000,
  protein_g   INTEGER NOT NULL DEFAULT 150,
  carbs_g     INTEGER NOT NULL DEFAULT 200,
  fat_g       INTEGER NOT NULL DEFAULT 65,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_targets_user ON diet_targets (user_id);

-- ─── DIET LOGS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS diet_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  food_name   TEXT NOT NULL,
  calories    INTEGER NOT NULL DEFAULT 0,
  protein_g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g     NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g       NUMERIC(6,2) NOT NULL DEFAULT 0,
  meal_type   TEXT NOT NULL DEFAULT 'lunch' CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_logs_user ON diet_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_diet_logs_date ON diet_logs (user_id, date DESC);
`;

console.log('Run this SQL in your Supabase SQL Editor:');
console.log(SQL);
