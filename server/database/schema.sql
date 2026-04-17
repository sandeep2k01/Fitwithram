-- ══════════════════════════════════════════════════════
-- FitWithRam v2 — Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ══════════════════════════════════════════════════════

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  goal        TEXT NOT NULL DEFAULT 'strength' CHECK (goal IN ('strength', 'cardio', 'hiit')),
  is_paid     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for email lookup (login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ─── PLANS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  frequency   TEXT,
  intensity   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── WORKOUTS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  duration    INTEGER,  -- in minutes
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workouts_plan ON workouts (plan_id);

-- ─── PROGRESS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  workout_id  UUID NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'skipped', 'partial')),
  date        DATE NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON progress (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress (user_id, date DESC);

-- ─── PAYMENTS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  amount              INTEGER NOT NULL,  -- in INR
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);

-- ══════════════════════════════════════════════════════
-- SEED DATA — 3 Default Plans
-- ══════════════════════════════════════════════════════

INSERT INTO plans (name, description, frequency, intensity) VALUES
  (
    'Strength Training',
    'Build muscle, increase power, and sculpt your body with progressive overload training splits.',
    '3-5 days/week',
    'Medium to High'
  ),
  (
    'Cardio',
    'Improve cardiovascular endurance, burn fat, and boost energy with structured zone training.',
    '4-6 days/week',
    'Low to Medium'
  ),
  (
    'HIIT',
    'Maximum results in minimum time. Intense intervals to torch calories and build lean mass simultaneously.',
    '3-4 days/week',
    'High'
  )
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════════════════════
-- SEED DATA — Sample Workouts for each plan
-- ══════════════════════════════════════════════════════

-- Strength workouts
INSERT INTO workouts (plan_id, title, description, duration) VALUES
  ((SELECT id FROM plans WHERE name = 'Strength Training'), 'Bench Press', 'Flat barbell bench press — 4 sets × 8-10 reps', 45),
  ((SELECT id FROM plans WHERE name = 'Strength Training'), 'Squats', 'Barbell back squat — 4 sets × 6-8 reps', 50),
  ((SELECT id FROM plans WHERE name = 'Strength Training'), 'Deadlift', 'Conventional deadlift — 3 sets × 5 reps', 40),
  ((SELECT id FROM plans WHERE name = 'Strength Training'), 'Overhead Press', 'Standing military press — 4 sets × 8-10 reps', 35),
  ((SELECT id FROM plans WHERE name = 'Strength Training'), 'Barbell Row', 'Bent-over barbell row — 4 sets × 8-10 reps', 35);

-- Cardio workouts
INSERT INTO workouts (plan_id, title, description, duration) VALUES
  ((SELECT id FROM plans WHERE name = 'Cardio'), 'Zone 2 Run', 'Steady-state running at conversational pace', 45),
  ((SELECT id FROM plans WHERE name = 'Cardio'), 'Cycling Session', 'Moderate intensity cycling — flat terrain', 40),
  ((SELECT id FROM plans WHERE name = 'Cardio'), 'Swimming Laps', 'Freestyle swimming — continuous laps', 30),
  ((SELECT id FROM plans WHERE name = 'Cardio'), 'Jump Rope', 'Jump rope intervals — 30 sec on / 15 sec off', 20);

-- HIIT workouts
INSERT INTO workouts (plan_id, title, description, duration) VALUES
  ((SELECT id FROM plans WHERE name = 'HIIT'), 'Tabata Blast', '8 rounds: 20s all-out / 10s rest — burpees, mountain climbers', 25),
  ((SELECT id FROM plans WHERE name = 'HIIT'), 'Sprint Intervals', '10 × 100m sprints with 60s rest between', 30),
  ((SELECT id FROM plans WHERE name = 'HIIT'), 'Kettlebell Circuit', 'Swings, goblet squats, clean & press — 4 rounds', 35),
  ((SELECT id FROM plans WHERE name = 'HIIT'), 'Battle Ropes + Box Jumps', 'Alternating 30s sets — 5 rounds', 20);

-- ══════════════════════════════════════════════════════
-- SEED DATA — Admin User (password: admin123)
-- Hash generated with bcryptjs, 12 rounds
-- ══════════════════════════════════════════════════════

-- NOTE: You should generate your own hash. This is a placeholder.
-- Use the /api/auth/register endpoint to create the admin,
-- then manually update the role in Supabase dashboard:
--   UPDATE users SET role = 'admin' WHERE email = 'admin@fitwithram.com';
