import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import campusImage from '../assets/campus.jpg';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleLogin(e) {
    e.preventDefault();
    try {
        const user = await login(formData.email, formData.password);
        
        if (user.role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords don't match!");
    }
    try {
      const user = await register(formData);
        
        if (user.role === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/dashboard');
        }
    } catch (error) {
        alert(error.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div
          className="login-left"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,76,124,0.84), rgba(59,76,124,0.84)), url(' + campusImage + ')',
          }}
        >
          <div className="brand">
            <i className="fa-solid fa-bullhorn"></i>
            <span>CIRS</span>
          </div>

          <h1>
            {activeTab === 'login'
              ? 'Make Your Campus Better, Together.'
              : 'Join CIRS Today.'}
          </h1>

          <p>
            {activeTab === 'login'
              ? 'Report issues, track resolutions, and contribute to a safer, more efficient university environment.'
              : 'Create your account to report campus issues and track updates in one place.'}
          </p>

          <div className="left-note">
            <i className="fa-solid fa-shield"></i>
            <span>Secure enterprise-grade authentication for all university members.</span>
          </div>
        </div>

        <div className="login-right">
          <div className="tabs">
            <button
              className={activeTab === 'login' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={activeTab === 'signup' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            <>
              <h2>Welcome Back</h2>
              <p className="sub">Enter your credentials to access your dashboard.</p>

              <form className="login-form" onSubmit={handleLogin}>
                <label>University Email</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-user"></i>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="EnrollmentNo@uni.edu.in or email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="label-row">
                  <label>Password</label>
                  <a href="#">Forgot password?</a>
                </div>

                <div className="input-wrap">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="login-submit" type="submit">
                  Login
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Create Account</h2>
              <p className="sub">Register with your university credentials.</p>

              <form className="login-form" onSubmit={handleSignup}>
                <label>Full Name</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-user"></i>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Alex Johnson" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label>University Email</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-envelope"></i>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@uni.edu" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label>Register As</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-graduation-cap"></i>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="role-select"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="maintenance">Maintenance Staff</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <label>Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label>Confirm Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-lock"></i>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="login-submit" type="submit">
                  Sign Up
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </>
          )}

          <div className="divider">OR CONTINUE WITH</div>

          <button className="sso-btn" type="button">
            <i className="fa-solid fa-graduation-cap"></i>
            Sign in with University SSO
          </button>

          <div className="meta">
            <span>© 2026 CIRS Platform</span>
            <div className="meta-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Help Desk</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;