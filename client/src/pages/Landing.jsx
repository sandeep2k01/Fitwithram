import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <main className="pt-16">
      {/* ═══════════════════════════════════════════
          HERO — Two Column with Image + Floating Cards
          ═══════════════════════════════════════════ */}
      <section className="hero-bg">
        <div className="hero-container">
          {/* Left — Text */}
          <div className="hero-text-col">
            <span className="hero-badge animate-up">Strength · Cardio · HIIT</span>
            <h1 className="hero-h1 animate-up d1">
              Train hard.<br />
              <span className="text-accent">Live your</span><br />
              best life.
            </h1>
            <p className="hero-p animate-up d2">
              Expert-designed fitness programs, personal coaching, and real-time progress tracking — all in one place built for you.
            </p>
            <div className="hero-ctas animate-up d3">
              <Link to="/register" className="btn-hero">Start your journey</Link>
              <a href="#programs" className="btn-hero-outline">See programs</a>
            </div>
          </div>

          {/* Right — Visual */}
          <div className="hero-visual animate-left">
            <div className="hero-blob" />
            <div className="hero-img-main">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
                alt="Athlete training"
              />
              <div className="hero-img-overlay" />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════ */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">2,400+</div>
          <div className="stat-lbl">Active members</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">3</div>
          <div className="stat-lbl">Expert programs</div>
        </div>
        <div className="stat-item stat-last">
          <div className="stat-num">98%</div>
          <div className="stat-lbl">Satisfaction rate</div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PROGRAMS — Cards with Images
          ═══════════════════════════════════════════ */}
      <section id="programs" className="sec">
        <div className="overline">Training programs</div>
        <h2 className="sec-h2">Choose your path</h2>
        <div className="sec-sub">Three science-backed programs tailored to your goals</div>

        <div className="cards-grid">
          <ProgramCard
            image="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"
            iconPath="M6 4v16M18 4v16M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"
            title="Strength trainer"
            description="Build muscle, increase power, and sculpt your body with progressive overload training splits designed by experts."
            tags={['Progressive overload', '3–5 days/week']}
          />
          <ProgramCard
            image="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80"
            iconPath="M22 12 18 12 15 21 9 3 6 12 2 12"
            isPolyline
            title="Cardio"
            description="Improve cardiovascular endurance, burn fat, and boost daily energy with structured zone training sessions."
            tags={['Zone 2 training', '4–6 days/week']}
          />
          <ProgramCard
            image="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&q=80"
            iconPath="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            title="HIIT"
            description="Maximum results in minimum time. Intense intervals to torch calories and build lean mass simultaneously."
            tags={['High intensity', '2–4 days/week']}
          />
        </div>
      </section>

      <hr className="divider" />

      {/* ═══════════════════════════════════════════
          TRAINING MODES
          ═══════════════════════════════════════════ */}
      <section id="training" className="sec sec-bg">
        <div className="overline">Ways to train</div>
        <h2 className="sec-h2">On your terms</h2>
        <div className="sec-sub">Flexible modes that fit your lifestyle</div>

        <div className="train-grid">
          <div className="train-card">
            <div className="train-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" width="24" height="24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <div>
              <h3 className="train-title">Offline training</h3>
              <p className="train-desc">Work one-on-one with Ram in person. Get hands-on coaching, real-time form corrections, and a fully personalised weekly plan.</p>
              <div className="train-tags">
                <span className="tag">Personal sessions</span>
                <span className="tag">Custom plans</span>
              </div>
            </div>
          </div>

          <div className="train-card">
            <div className="train-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" width="24" height="24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div>
              <h3 className="train-title">Online training</h3>
              <p className="train-desc">Train anywhere with live video sessions, app-based workouts, and direct messaging support from Ram. No commute needed.</p>
              <div className="train-tags">
                <span className="tag">Live sessions</span>
                <span className="tag">App access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════ */}
      <section id="pricing" className="sec">
        <div className="overline">Pricing</div>
        <h2 className="sec-h2">Simple, transparent plans</h2>
        <div className="sec-sub">Integrated end-to-end payment. No hidden fees, no surprises.</div>

        <div className="pricing-grid">
          <PricingCard
            name="Starter"
            price="999"
            desc="Online app access"
            features={['App workout access', 'Diet tracker', 'Progress analytics']}
            offFeatures={['No live sessions']}
          />
          <PricingCard
            name="Pro"
            price="2,499"
            desc="Online + live coaching"
            badge="Most popular"
            featured
            features={['Everything in Starter', '4 live video sessions', 'Custom program', 'Direct message support']}
          />
          <PricingCard
            name="Elite"
            price="4,999"
            desc="Full offline + online"
            features={['Everything in Pro', 'Unlimited in-person sessions', 'Nutrition consultation', 'Priority support']}
          />
        </div>
      </section>
    </main>
  );
};

/* ─── Sub Components ─────────────────────── */

const ProgramCard = ({ image, iconPath, isPolyline, title, description, tags }) => (
  <div className="card">
    <div className="card-img">
      <img src={image} alt={title} loading="lazy" />
      <div className="card-img-overlay" />
    </div>
    <div className="card-body">
      <div className="card-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="#e85d00" strokeWidth="1.5" width="20" height="20">
          {isPolyline ? <polyline points={iconPath} /> : <path d={iconPath} />}
        </svg>
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
      <div className="card-tags">
        {tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <div className="card-link">Explore program →</div>
    </div>
  </div>
);

const PricingCard = ({ name, price, desc, badge, featured, features = [], offFeatures = [] }) => (
  <div className={`price-card ${featured ? 'price-featured' : ''}`}>
    {badge && <div className="price-badge">{badge}</div>}
    <h3 className="price-name">{name}</h3>
    <div className="price-num">₹{price}<span className="price-per"> /mo</span></div>
    <div className="price-desc">{desc}</div>
    {features.map((f) => (
      <div key={f} className="price-feat">{f}</div>
    ))}
    {offFeatures.map((f) => (
      <div key={f} className="price-feat price-feat-off">{f}</div>
    ))}
    <Link to="/register" className={`price-btn ${featured ? 'price-btn-fill' : 'price-btn-out'}`}>
      Get started
    </Link>
  </div>
);

export default Landing;
