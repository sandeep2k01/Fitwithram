// Force restart
const express = require('express');
const cors = require('cors');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dietRoutes = require('./routes/dietRoutes');

const app = express();

// ─── MIDDLEWARE ─────────────────────────────────────────
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API ROUTES ────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/diet', dietRoutes);

// ─── HEALTH CHECK ──────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏋️ FitWithRam API is running!',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      plans: '/api/plans',
      workouts: '/api/workouts',
      progress: '/api/progress',
      payment: '/api/payment',
      admin: '/api/admin',
      diet: '/api/diet',
    },
  });
});

// ─── 404 HANDLER ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────
app.use(errorHandler);

// ─── START SERVER ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 FitWithRam server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}\n`);
});
