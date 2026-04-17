import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyWorkouts } from '../../services/workoutService';
import { getProgress, logProgress } from '../../services/progressService';
import { getTodayDiet, getWeeklyDiet, logMeal, deleteMeal } from '../../services/dietService';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js modules once
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

/* ─── helpers ─── */
const macroColor = { protein_g: '#e85d00', carbs_g: '#f59e0b', fat_g: '#6366f1' };
const mealTypeLabel = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner', snack: '🍎 Snack' };

const SidebarButton = ({ icon, label, tab, active, onClick }) => (
  <button
    onClick={() => onClick(tab)}
    className={`dash-link ${active ? 'active' : ''}`}
    style={{ border: 'none', width: '100%', textAlign: 'left', background: active ? '' : 'transparent', cursor: 'pointer' }}
  >
    {icon} {label}
  </button>
);

/* ─── Icon components (inline SVG) ─── */
const IconOverview  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
const IconWorkouts  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconProgress  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;
const IconDiet      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
const IconSettings  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9"/></svg>;

/* ════════════════════ OVERVIEW ════════════════════ */
const OverviewTab = ({ user, progressLog, streak, workouts, setActiveTab }) => {
  const userName = user?.name || 'Athlete';
  const userGoal = user?.goal || 'strength';
  const capGoal = userGoal.charAt(0).toUpperCase() + userGoal.slice(1);

  return (
    <>
      <header className="dash-header">
        <div>
          <h1 className="dash-h1">Welcome back, {userName} 👋</h1>
          <p className="dash-sub">Your {capGoal} training overview for today.</p>
        </div>
        <Link to="/payment" className="btn-primary" style={{ padding: '10px 20px' }}>Upgrade Plan</Link>
      </header>

      <section className="stat-grid">
        <div className="dash-stat-card">
          <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#e85d00" strokeWidth="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div className="stat-val">{progressLog.length}</div>
          <div className="stat-label">Workouts done</div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#e85d00" strokeWidth="2" width="20" height="20"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          <div className="stat-val">{streak} 🔥</div>
          <div className="stat-label">Current streak</div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#e85d00" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div className="stat-val">{user?.is_paid ? 'Pro ⭐' : 'Free'}</div>
          <div className="stat-label">Plan status</div>
        </div>
      </section>

      {workouts.length > 0 && (
        <section className="workout-panel">
          <div className="panel-title">
            Today's Schedule
            <span className="text-sm font-normal text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="workout-list">
            <div className="workout-item">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{workouts[0].title}</h4>
                <p className="text-sm text-gray-500">{workouts[0].description} • {workouts[0].duration} mins</p>
              </div>
              <button onClick={() => setActiveTab('workouts')} className="btn-outline">Go to Workouts</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

/* ════════════════════ WORKOUTS ════════════════════ */
const WorkoutsTab = ({ plan, workouts, onComplete }) => (
  <>
    <header className="dash-header">
      <div>
        <h1 className="dash-h1">Your Training Plan</h1>
        <p className="dash-sub">{plan?.name || 'Custom Plan'} • {plan?.frequency}</p>
      </div>
    </header>
    <div style={{ marginTop: '1.5rem' }}>
      {workouts.length === 0 ? (
        <div className="workout-panel"><p className="text-gray-500">No workouts found for your plan.</p></div>
      ) : (
        <div className="workout-list">
          {workouts.map((w, i) => (
            <div key={w.id} className="workout-item">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Day {i + 1}: {w.title}</h4>
                <p className="text-sm text-gray-500">{w.description}</p>
                <span style={{ fontSize: '12px', color: '#e85d00', fontWeight: 600 }}>⏱ {w.duration} mins</span>
              </div>
              <button onClick={() => onComplete(w.id, w.title)} className="btn-outline" style={{ whiteSpace: 'nowrap' }}>
                ✓ Mark Done
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

/* ════════════════════ PROGRESS (Charts) ════════════════════ */
const ProgressTab = ({ progressLog, streak }) => {
  // Last 7 days completion chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const completionData = last7.map(date =>
    progressLog.filter(p => p.date === date).length
  );

  const barData = {
    labels: last7.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [{
      label: 'Workouts Completed',
      data: completionData,
      backgroundColor: 'rgba(232,93,0,0.7)',
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const statusCounts = progressLog.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {});
  const doughnutData = {
    labels: ['Completed', 'Skipped', 'Partial'],
    datasets: [{
      data: [statusCounts.completed || 0, statusCounts.skipped || 0, statusCounts.partial || 0],
      backgroundColor: ['#e85d00', '#fbbf24', '#6366f1'],
      borderWidth: 0,
    }]
  };

  return (
    <>
      <header className="dash-header">
        <div><h1 className="dash-h1">Progress Analytics</h1><p className="dash-sub">Track your consistency and results.</p></div>
        <div className="dash-stat-card" style={{ padding: '12px 20px', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '24px' }}>🔥</span>
          <div><div className="stat-val" style={{ fontSize: '20px' }}>{streak}</div><div className="stat-label">Day Streak</div></div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Bar chart */}
        <div className="dash-stat-card" style={{ padding: '1.5rem' }}>
          <div className="panel-title" style={{ marginBottom: '1rem' }}>Last 7 Days Activity</div>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}/>
        </div>
        {/* Doughnut */}
        <div className="dash-stat-card" style={{ padding: '1.5rem' }}>
          <div className="panel-title" style={{ marginBottom: '1rem' }}>Session Breakdown</div>
          <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '65%' }}/>
        </div>
      </div>

      <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>Full Activity Log</div>
        <table className="admin-table">
          <thead><tr><th>Date</th><th>Workout</th><th>Status</th><th>Notes</th></tr></thead>
          <tbody>
            {progressLog.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>No workouts logged yet. Start training!</td></tr>
            ) : progressLog.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{new Date(p.date).toLocaleDateString()}</td>
                <td className="text-sm text-gray-500 font-mono">{p.workout_id?.slice(0, 8)}...</td>
                <td><span className={`status-badge ${p.status === 'completed' ? 'active' : 'inactive'}`}>{p.status}</span></td>
                <td className="text-gray-500">{p.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ════════════════════ DIET ════════════════════ */
const DietTab = () => {
  const [dietData, setDietData] = useState({ logs: [], totals: {}, targets: {} });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', meal_type: 'lunch' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDiet = useCallback(async () => {
    try {
      const [todayRes, weeklyRes] = await Promise.all([getTodayDiet(), getWeeklyDiet()]);
      setDietData(todayRes.data || { logs: [], totals: {}, targets: {} });
      setWeeklyData(weeklyRes.data?.weekly || []);
    } catch (e) { toast.error('Diet table not set up yet — run the SQL migration first.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDiet(); }, [fetchDiet]);

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!form.food_name || !form.calories) return toast.error('Food name and calories are required');
    setSubmitting(true);
    try {
      await logMeal({ ...form, calories: parseInt(form.calories) });
      toast.success(`${form.food_name} logged!`);
      setForm({ food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', meal_type: 'lunch' });
      fetchDiet();
    } catch { toast.error('Failed to log meal'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteMeal(id); toast.success('Removed'); fetchDiet(); }
    catch { toast.error('Failed to remove'); }
  };

  const { totals = {}, targets = {}, logs = [] } = dietData;

  // Calories line chart for the week
  const lineData = {
    labels: weeklyData.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [{
      label: 'Calories',
      data: weeklyData.map(d => d.calories),
      fill: true,
      borderColor: '#e85d00',
      backgroundColor: 'rgba(232,93,0,0.1)',
      tension: 0.4,
      pointBackgroundColor: '#e85d00',
    }]
  };

  const macroPercent = (val, target) => target ? Math.min(100, Math.round((val / target) * 100)) : 0;

  if (loading) return <div style={{ padding: '2rem', color: '#999' }}>Loading nutrition data...</div>;

  return (
    <>
      <header className="dash-header">
        <div><h1 className="dash-h1">Nutrition Tracker</h1><p className="dash-sub">Log your meals and track macros in real time.</p></div>
      </header>

      {/* Macro rings */}
      <div className="stat-grid" style={{ marginTop: '1.5rem' }}>
        {[
          { label: 'Calories', val: totals.calories || 0, target: targets.calories || 2000, unit: 'kcal', color: '#e85d00' },
          { label: 'Protein', val: Math.round(totals.protein_g || 0), target: targets.protein_g || 150, unit: 'g', color: '#22c55e' },
          { label: 'Carbs', val: Math.round(totals.carbs_g || 0), target: targets.carbs_g || 200, unit: 'g', color: '#f59e0b' },
          { label: 'Fat', val: Math.round(totals.fat_g || 0), target: targets.fat_g || 65, unit: 'g', color: '#6366f1' },
        ].map(m => (
          <div key={m.label} className="dash-stat-card">
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="stat-label">{m.label}</span>
                <span style={{ fontSize: '12px', color: '#999' }}>{m.val}/{m.target}{m.unit}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${macroPercent(m.val, m.target)}%`, background: m.color, height: '100%', borderRadius: '8px', transition: 'width 0.4s' }}/>
              </div>
              <div className="stat-val" style={{ marginTop: '8px', fontSize: '22px' }}>{m.val}<span style={{ fontSize: '12px', color: '#999', fontWeight: 400 }}>{m.unit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly calories chart */}
      {weeklyData.length > 0 && (
        <div className="dash-stat-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <div className="panel-title" style={{ marginBottom: '1rem' }}>Weekly Calorie Trend</div>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}/>
        </div>
      )}

      {/* Add meal form */}
      <div className="dash-stat-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>Log a Meal</div>
        <form onSubmit={handleAddMeal} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Food Name *</label>
            <input className="form-input" placeholder="e.g. Chicken Rice" value={form.food_name} onChange={e => setForm({...form, food_name: e.target.value})} required style={{ padding: '8px 12px', fontSize: '13px' }}/>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Calories (kcal) *</label>
            <input className="form-input" type="number" placeholder="350" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} required style={{ padding: '8px 12px', fontSize: '13px' }}/>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Protein (g)</label>
            <input className="form-input" type="number" placeholder="30" value={form.protein_g} onChange={e => setForm({...form, protein_g: e.target.value})} style={{ padding: '8px 12px', fontSize: '13px' }}/>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Carbs (g)</label>
            <input className="form-input" type="number" placeholder="45" value={form.carbs_g} onChange={e => setForm({...form, carbs_g: e.target.value})} style={{ padding: '8px 12px', fontSize: '13px' }}/>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Fat (g)</label>
            <input className="form-input" type="number" placeholder="10" value={form.fat_g} onChange={e => setForm({...form, fat_g: e.target.value})} style={{ padding: '8px 12px', fontSize: '13px' }}/>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Meal Type</label>
            <select className="form-input" value={form.meal_type} onChange={e => setForm({...form, meal_type: e.target.value})} style={{ padding: '8px 12px', fontSize: '13px' }}>
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="dinner">🌙 Dinner</option>
              <option value="snack">🍎 Snack</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '9px 20px', fontSize: '13px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
            {submitting ? 'Logging...' : '+ Add Meal'}
          </button>
        </form>
      </div>

      {/* Today's food log table */}
      <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>Today's Food Log</div>
        <table className="admin-table">
          <thead><tr><th>Food</th><th>Meal</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th></th></tr></thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999' }}>No meals logged today.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id}>
                <td className="font-medium">{log.food_name}</td>
                <td><span className="status-badge admin">{mealTypeLabel[log.meal_type] || log.meal_type}</span></td>
                <td className="font-medium">{log.calories} kcal</td>
                <td>{log.protein_g}g</td>
                <td>{log.carbs_g}g</td>
                <td>{log.fat_g}g</td>
                <td>
                  <button onClick={() => handleDelete(log.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ════════════════════ SETTINGS ════════════════════ */
const SettingsTab = ({ user }) => (
  <>
    <header className="dash-header">
      <div><h1 className="dash-h1">Account Settings</h1><p className="dash-sub">Your profile and subscription details.</p></div>
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      <div className="dash-stat-card" style={{ padding: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>Profile Information</div>
        {[
          { label: 'Full Name', value: user?.name },
          { label: 'Email Address', value: user?.email },
          { label: 'Fitness Goal', value: user?.goal?.toUpperCase() },
          { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
        ].map(field => (
          <div key={field.label} className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '4px' }}>{field.label}</label>
            <div style={{ padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: '#111' }}>{field.value || '—'}</div>
          </div>
        ))}
      </div>
      <div className="dash-stat-card" style={{ padding: '1.5rem' }}>
        <div className="panel-title" style={{ marginBottom: '1rem' }}>Subscription</div>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>{user?.is_paid ? '⭐' : '🚀'}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '0.5rem' }}>{user?.is_paid ? 'Pro Member' : 'Free Trial'}</div>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>
            {user?.is_paid ? 'You have full access to all training programs and features.' : 'Upgrade to Pro to unlock all programs, personal coaching, and priority support.'}
          </p>
          {!user?.is_paid && <Link to="/payment" className="btn-primary" style={{ padding: '12px 28px' }}>Upgrade to Pro — ₹2,499</Link>}
        </div>
      </div>
    </div>
  </>
);

/* ════════════════════ MAIN DASHBOARD ════════════════════ */
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [plan, setPlan] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [progressLog, setProgressLog] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [wRes, pRes] = await Promise.all([getMyWorkouts(), getProgress(user.id)]);
        setPlan(wRes.data.plan);
        setWorkouts(wRes.data.workouts || []);
        setProgressLog(pRes.data.progress || []);
        setStreak(pRes.data.streak || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => { logout(); toast.success('Logged out'); window.location.href = '/'; };

  const handleCompleteWorkout = async (workoutId, title) => {
    try {
      await logProgress({ workout_id: workoutId, status: 'completed', date: new Date().toISOString().split('T')[0] });
      toast.success(`✅ ${title} logged! Streak updated.`);
      const pRes = await getProgress(user.id);
      setProgressLog(pRes.data.progress || []);
      setStreak(pRes.data.streak || 0);
    } catch { toast.error('Failed to log workout'); }
  };

  const switchTab = (tab) => { setActiveTab(tab); setSidebarOpen(false); window.scrollTo(0, 0); };

  const navItems = [
    { tab: 'overview', label: 'Overview', icon: <IconOverview/> },
    { tab: 'workouts', label: 'Workouts', icon: <IconWorkouts/> },
    { tab: 'progress', label: 'Progress', icon: <IconProgress/> },
    { tab: 'diet', label: 'Diet', icon: <IconDiet/> },
    { tab: 'settings', label: 'Settings', icon: <IconSettings/> },
  ];

  const renderContent = () => {
    if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Syncing your data...</div>;
    switch (activeTab) {
      case 'workouts': return <WorkoutsTab plan={plan} workouts={workouts} onComplete={handleCompleteWorkout}/>;
      case 'progress': return <ProgressTab progressLog={progressLog} streak={streak}/>;
      case 'diet':     return <DietTab/>;
      case 'settings': return <SettingsTab user={user}/>;
      default:         return <OverviewTab user={user} progressLog={progressLog} streak={streak} workouts={workouts} setActiveTab={setActiveTab}/>;
    }
  };

  return (
    <div className="dashboard-layout animate-left">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>}
      <button className="mobile-dash-toggle" onClick={() => setSidebarOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', marginBottom:'3rem' }}>
          <Link to="/" className="dash-logo" style={{ marginBottom: 0 }}>FitWithRam</Link>
          <button className="mobile-dash-toggle" style={{ position:'relative', top:0, left:0, display: sidebarOpen?'flex':'none', border:'none', boxShadow:'none' }} onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav className="dash-nav">
          {navItems.map(({ tab, label, icon }) => (
            <SidebarButton key={tab} tab={tab} label={label} icon={icon} active={activeTab === tab} onClick={switchTab}/>
          ))}
        </nav>

        <button onClick={handleLogout} className="dash-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
      </aside>

      <main className="dash-main animate-up">
        {renderContent()}
      </main>
    </div>
  );
};

export default UserDashboard;
