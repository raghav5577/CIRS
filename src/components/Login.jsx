import './Login.css';

export default function Login() {
    return (
        <div className="login-container">
            <h2 className='heading'>Login</h2>
            <form className="login-form">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder='Enter your email' required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder='Enter your password' required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}