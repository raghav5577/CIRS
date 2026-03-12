import './SignUp.css';

export default function SignUp() {
    return (
        <div className="signup-container">
            <h2 className='heading'>Sign Up Below</h2>
            <form className="signup-form">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder='Enter your email' required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder='Enter your password' required />

                <label htmlFor="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password" placeholder='Confirm your password' required />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}