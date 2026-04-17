import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="site-nav">
      {/* Logo */}
      <Link to="/" className="nav-logo">
        FitWithRam
      </Link>

      {/* Desktop Links */}
      <div className="nav-links">
        <a href="#programs">Programs</a>
        <a href="#training">Training</a>
        <a href="#pricing">Pricing</a>

        {user ? (
          <Link
            to={user.role === 'admin' ? '/admin' : '/dashboard'}
            className="btn-primary"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Log in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu">
          <a href="#programs" onClick={() => setMobileOpen(false)}>Programs</a>
          <a href="#training" onClick={() => setMobileOpen(false)}>Training</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary" style={{ textAlign: 'center' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link to="/register" className="btn-primary" style={{ textAlign: 'center' }} onClick={() => setMobileOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
