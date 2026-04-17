const supabase = require('../config/supabase');
const { success, error } = require('../utils/response');

// ─── GET TODAY'S DIET LOGS ────────────────────────────────
const getTodayDiet = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: logs, error: dbError } = await supabase
      .from('diet_logs')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('date', today)
      .order('created_at');

    if (dbError) throw dbError;

    // Get targets
    const { data: targets } = await supabase
      .from('diet_targets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    // Calculate totals
    const totals = (logs || []).reduce((acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein_g: acc.protein_g + parseFloat(log.protein_g || 0),
      carbs_g: acc.carbs_g + parseFloat(log.carbs_g || 0),
      fat_g: acc.fat_g + parseFloat(log.fat_g || 0),
    }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });

    return success(res, {
      logs: logs || [],
      totals,
      targets: targets || { calories: 2000, protein_g: 150, carbs_g: 200, fat_g: 65 }
    });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch diet logs', 500);
  }
};

// ─── LOG A MEAL ───────────────────────────────────────────
const logMeal = async (req, res) => {
  try {
    const { food_name, calories, protein_g, carbs_g, fat_g, meal_type, date } = req.body;
    if (!food_name || calories === undefined) return error(res, 'food_name and calories are required', 400);

    const { data: log, error: dbError } = await supabase
      .from('diet_logs')
      .insert({
        user_id: req.user.id,
        food_name,
        calories: parseInt(calories),
        protein_g: parseFloat(protein_g || 0),
        carbs_g: parseFloat(carbs_g || 0),
        fat_g: parseFloat(fat_g || 0),
        meal_type: meal_type || 'lunch',
        date: date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return success(res, { log }, 201);
  } catch (err) {
    return error(res, err.message || 'Failed to log meal', 500);
  }
};

// ─── DELETE A MEAL ENTRY ──────────────────────────────────
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { error: dbError } = await supabase
      .from('diet_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id); // Security: only own entries

    if (dbError) throw dbError;
    return success(res, { message: 'Meal deleted' });
  } catch (err) {
    return error(res, err.message || 'Failed to delete meal', 500);
  }
};

// ─── UPDATE DIET TARGETS ──────────────────────────────────
const updateTargets = async (req, res) => {
  try {
    const { calories, protein_g, carbs_g, fat_g } = req.body;
    const { data, error: dbError } = await supabase
      .from('diet_targets')
      .upsert({
        user_id: req.user.id,
        calories: parseInt(calories || 2000),
        protein_g: parseInt(protein_g || 150),
        carbs_g: parseInt(carbs_g || 200),
        fat_g: parseInt(fat_g || 65),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (dbError) throw dbError;
    return success(res, { targets: data });
  } catch (err) {
    return error(res, err.message || 'Failed to update targets', 500);
  }
};

// ─── GET WEEKLY DIET HISTORY ──────────────────────────────
const getWeeklyDiet = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: logs, error: dbError } = await supabase
      .from('diet_logs')
      .select('date, calories, protein_g, carbs_g, fat_g')
      .eq('user_id', req.user.id)
      .gte('date', sevenDaysAgo)
      .order('date');

    if (dbError) throw dbError;

    // Group by date
    const grouped = (logs || []).reduce((acc, log) => {
      const d = log.date;
      if (!acc[d]) acc[d] = { date: d, calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
      acc[d].calories += log.calories || 0;
      acc[d].protein_g += parseFloat(log.protein_g || 0);
      acc[d].carbs_g += parseFloat(log.carbs_g || 0);
      acc[d].fat_g += parseFloat(log.fat_g || 0);
      return acc;
    }, {});

    return success(res, { weekly: Object.values(grouped) });
  } catch (err) {
    return error(res, err.message || 'Failed to fetch weekly diet', 500);
  }
};

module.exports = { getTodayDiet, logMeal, deleteMeal, updateTargets, getWeeklyDiet };
