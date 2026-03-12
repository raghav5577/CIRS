import { useNavigate } from "react-router-dom";
import './header.css';

function Header(){
    const navigate = useNavigate();

    return(
        <header className="header">
            <div className="header-left">
                {/* <img className='header-logo' src="/logo.png" alt="CIRS Logo" /> */} 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                <h1 id="header-title">CIRS</h1>
            </div>
            <nav className='header-nav'>
                <a href="home" className='nav-link'>Home</a>
                <a href="about" className='nav-link'>About</a>
                <a href="faqs" className='nav-link'>FAQs</a>
                <a href="contact" className='nav-link'>Contact</a>
            </nav>

            <div className="header-right">
                {/* <img className='avatar-img' src="/" alt="avatar-img" /> */}
                <div className='user-icon'>
                    <i class="fa-solid fa-user"></i>
                </div>
                <button className='login-btn' onClick={() => navigate('/login')}>Login</button>
                <button className='login-btn' onClick={() => navigate('/signup')}>Sign Up</button>
            </div>

        </header>
    );

};
export default Header;