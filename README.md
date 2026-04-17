# FitWithRam

> **A production-grade, full-stack fitness SaaS platform** — personalized training programs, real-time progress analytics, nutrition tracking, and Razorpay-powered subscriptions. Built with Node.js, React 18, and PostgreSQL (Supabase).

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-02042B?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What is FitWithRam?

FitWithRam is a complete fitness coaching platform that operates like a real SaaS product. Users register, get assigned a personalized training plan based on their fitness goal (Strength / Cardio / HIIT), log workouts, track nutrition macros, and upgrade to a Pro subscription via Razorpay.

Admins get a fully functional control panel to monitor members, review payment transactions, and manage training programs — all backed by real-time data from PostgreSQL.

---

## Architecture

```
fitwithram/
├── client/                  # React 18 frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Footer, Guards)
│   │   ├── context/         # AuthContext — global JWT state
│   │   ├── pages/
│   │   │   ├── Landing.jsx  # Marketing landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Payment.jsx  # Razorpay checkout
│   │   │   ├── user/
│   │   │   │   └── Dashboard.jsx  # User dashboard (5 tabs)
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx  # Admin panel (3 tabs)
│   │   └── services/        # Axios API layer (auth, workout, progress, diet, payment)
│   └── index.css            # Global design system (CSS variables, components)
│
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Business logic (auth, workout, progress, diet, payment, admin)
│   ├── middleware/          # JWT auth guard, role-based admin guard, error handler
│   ├── routes/              # Express routers (auth, plans, workouts, progress, diet, payment, admin)
│   ├── services/            # Data access layer (Supabase queries)
│   ├── utils/               # JWT sign/verify, bcrypt hash, standard response wrapper
│   ├── config/              # Supabase client, environment validation
│   └── database/
│       └── schema.sql       # Full PostgreSQL schema + seed data
```

---

## Database Schema

The platform runs on **7 tables**:

| Table | Purpose |
|---|---|
| `users` | Accounts with role (`user`/`admin`), goal (`strength`/`cardio`/`hiit`), paid status |
| `plans` | Training program definitions (Strength Training, Cardio, HIIT) |
| `workouts` | Individual exercises per plan with duration |
| `progress` | Per-user workout completion log with streak computation |
| `payments` | Razorpay order + payment ID ledger with status |
| `diet_targets` | Per-user daily macro targets (calories, protein, carbs, fat) |
| `diet_logs` | Per-meal nutrition entries with meal type and date |

---

## Feature Set

### User Dashboard
- **Overview** — live stats: workouts done, streak, subscription status
- **Workouts** — personalized plan loaded by goal (`strength → Strength Training`, etc.), "Mark Done" logs to DB instantly and refreshes streak
- **Progress** — Chart.js bar chart (7-day activity), doughnut chart (session breakdown), full activity log table
- **Diet / Nutrition Tracker** — log meals with calories + macros, real-time macro progress bars vs daily targets, weekly calorie line chart
- **Settings** — profile card + subscription tier UI

### Admin Dashboard
- **Customers** — live user table with goal, join date, paid status, role badges
- **Programs** — real-time training program registry from DB
- **Payments** — full Razorpay transaction ledger (order ID, customer, amount, status)
- Live stats: Total Users, Paid Members, Monthly Revenue (₹)

### Auth & Security
- JWT authentication (7-day expiry, `HS256`)
- bcrypt password hashing (10 rounds)
- Role-based access control middleware (`auth` + `admin` guards)
- Protected route guards on the frontend (React Router)
- Environment variable validation at server startup — crashes early if secrets are missing

### Payments
- Razorpay order creation (`/api/payment/create-order`)
- Webhook-free HMAC signature verification on the server
- `users.is_paid` flag updated on successful payment
- Test mode and production mode via env swap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Chart.js, react-chartjs-2 |
| Styling | Vanilla CSS (custom design system, glassmorphism, CSS variables) |
| Backend | Node.js 18, Express 4 |
| Database | PostgreSQL via Supabase (row-level security disabled for service key) |
| Auth | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| Payments | Razorpay (India) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Razorpay](https://dashboard.razorpay.com) account (test mode works)

### 1 — Database Setup

Go to **Supabase → SQL Editor** and run `server/database/schema.sql`. This creates all tables and seeds the 3 training programs + sample workouts.

For diet tracking, also run:
```sql
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
```

### 2 — Backend Setup

```bash
cd server
cp .env.example .env   # fill in your keys
npm install
node server.js         # starts on :5000
```

**`server/.env` required variables:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-random-256bit-secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3 — Frontend Setup

```bash
cd client
cp .env.example .env   # fill in values
npm install
npm run dev            # starts on :5173
```

**`client/.env` required variables:**
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4 — Create Your Admin Account

Register a normal account at `/register`, then run:

```bash
cd server
node make-admin.js
```

Edit `make-admin.js` to set your email before running.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/profile` | ✅ | Get logged-in user profile |

### Workouts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/workouts/my-workouts` | ✅ User | Get workouts for user's goal-based plan |
| GET | `/api/workouts/:planId` | ✅ User | Get workouts by plan ID |
| POST | `/api/workouts` | ✅ Admin | Create a new workout |

### Progress
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/progress` | ✅ User | Log a completed workout |
| GET | `/api/progress/:userId` | ✅ User | Get progress log + streak |

### Diet
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/diet/today` | ✅ User | Today's meals + totals vs targets |
| GET | `/api/diet/weekly` | ✅ User | Weekly calorie/macro grouped by day |
| POST | `/api/diet` | ✅ User | Log a meal |
| DELETE | `/api/diet/:id` | ✅ User | Delete a meal entry |
| PUT | `/api/diet/targets` | ✅ User | Update daily macro targets |

### Payment
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/payment/create-order` | ✅ User | Create Razorpay order |
| POST | `/api/payment/verify` | ✅ User | Verify HMAC signature, unlock Pro |
| GET | `/api/payment/key` | ✅ User | Get public Razorpay key ID |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | ✅ Admin | Platform-wide stats |
| GET | `/api/admin/users` | ✅ Admin | All user accounts |
| GET | `/api/admin/payments` | ✅ Admin | Full payment ledger |

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect this repository, set root directory to `server`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `server/.env` in Render's dashboard

### Frontend → Vercel

1. Import this repository on [vercel.com](https://vercel.com)
2. Set root directory to `client`
3. Framework: **Vite**
4. Add environment variables:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://fitwithram-api.onrender.com`)
   - `VITE_RAZORPAY_KEY_ID` → your live Razorpay key

### Switch to Live Payments

In `server/.env`, swap:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-live-secret
```
And update `client/.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
```

---

## Security Notes

- **Service key never exposed to the browser** — Supabase service role key lives only in the Node.js process
- **JWT validated on every protected route** — middleware rejects expired or tampered tokens with `401`
- **Role guard prevents privilege escalation** — non-admin JWTs are rejected at the `admin` middleware level
- **HMAC signature verified server-side** — Razorpay payment verification is never trusted from the client
- **Passwords never returned in API responses** — stripped via object destructuring before JWT issuance
- **Startup validation** — server refuses to boot if `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, or `JWT_SECRET` are missing

---

## License

MIT © 2025 Ram Coach — FitWithRam
