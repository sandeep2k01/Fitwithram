require('dotenv').config({ path: '../.env' });
const supabase = require('../config/supabase');

async function migrate() {
  // Test INSERT to diet_targets — this will error if the table doesn't exist, 
  // telling us we need to create it via Supabase SQL editor
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'srinivasdamera555@gmail.com')
    .single();

  if (!user) { console.log('User not found'); return; }
  console.log('User found:', user.id);

  // Try upserting diet targets
  const { data, error } = await supabase
    .from('diet_targets')
    .upsert({ 
      user_id: user.id, 
      calories: 2200, 
      protein_g: 160, 
      carbs_g: 220, 
      fat_g: 70,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('TABLE MISSING - Please run this SQL in Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS diet_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  calories INTEGER NOT NULL DEFAULT 2000,
  protein_g INTEGER NOT NULL DEFAULT 150,
  carbs_g INTEGER NOT NULL DEFAULT 200,
  fat_g INTEGER NOT NULL DEFAULT 65,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diet_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_g NUMERIC(6,2) NOT NULL DEFAULT 0,
  meal_type TEXT NOT NULL DEFAULT 'lunch' CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_logs_user ON diet_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_diet_logs_date ON diet_logs (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_diet_targets_user ON diet_targets (user_id);
      `);
    } else {
      console.log('Error:', error.message);
    }
  } else {
    console.log('Diet targets upserted successfully!', data);
  }
}

migrate().catch(console.error);
