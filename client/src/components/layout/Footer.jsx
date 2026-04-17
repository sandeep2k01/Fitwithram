import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">FitWithRam</div>
          <p className="footer-brand-desc">
            Your complete fitness platform — expert coaching, smart tracking, and a community that keeps you going every single day.
          </p>
          <div className="footer-socials">
            {/* Twitter */}
            <div className="soc-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" width="15" height="15">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 2a4.48 4.48 0 00-4.48 4.48c0 .35.04.69.11 1.02A12.76 12.76 0 013 3.8a4.48 4.48 0 001.39 5.97 4.4 4.4 0 01-2.03-.56v.06A4.48 4.48 0 005.96 14a4.5 4.5 0 01-2.02.08 4.48 4.48 0 004.18 3.11A9 9 0 012 19.54a12.77 12.77 0 006.92 2.03c8.3 0 12.84-6.88 12.84-12.84l-.01-.58A9.16 9.16 0 0024 5.6a8.98 8.98 0 01-2.6.71A4.52 4.52 0 0023 3z" />
              </svg>
            </div>
            {/* Instagram */}
            <div className="soc-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" width="15" height="15">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            {/* YouTube */}
            <div className="soc-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" width="15" height="15">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" />
              </svg>
            </div>
          </div>
        </div>

        {/* Programs */}
        <div className="footer-col">
          <h4>Programs</h4>
          <a href="#programs">Strength trainer</a>
          <a href="#programs">Cardio</a>
          <a href="#programs">HIIT</a>
          <a href="#programs">Custom plan</a>
        </div>

        {/* Training */}
        <div className="footer-col">
          <h4>Training</h4>
          <a href="#training">Offline training</a>
          <a href="#training">Online training</a>
          <a href="#training">Schedule a session</a>
          <a href="#training">Free trial</a>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Ram</a>
          <a href="#">Blog</a>
          <a href="#">Testimonials</a>
          <a href="#">Contact us</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FitWithRam. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Refund policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
