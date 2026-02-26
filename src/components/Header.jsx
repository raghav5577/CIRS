import './header.css';

function Header(){
    return(
        <header className="header">
            <div className="header-left">
                <img className='header-logo' src="/logo.png" alt="CIRS Logo" />
                <h1 id="header-title">CIRS</h1>
            </div>
            <div className="header-right">
                <img className='avatar-img' src="/" alt="avatar-img" />
                <button className="account">Account</button>
            </div>

        </header>
    );

};
export default Header;