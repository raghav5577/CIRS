import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
        <span className="header-title">CIRS Portal</span>
      </div>

      <nav className="header-nav">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#faqs" className="nav-link">FAQs</a>
        <a href="#contact" className="nav-link">Contact</a>
      </nav>

      <div className="header-right">
        <button className="login-btn">Login</button>
        <div className="user-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b4c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Header;