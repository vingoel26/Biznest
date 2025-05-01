import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/logo.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [signInForm, setSignInForm] = useState({
    username: '',
    password: ''
  });

  const handleRegister = () => setIsActive(true);
  const handleLogin = () => setIsActive(false);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!signUpForm.username) {
      alert("User Name can not be empty");
      return;
    }
    if (signUpForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Sign up failed. Please try again.');
        return;
      }

      alert(data.message);
      setSignUpForm({ username: '', email: '', password: '' });
      setIsActive(false);
    } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred during sign up. Please try again.');
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!signInForm.username) {
      alert("User Name can not be empty");
      return;
    }
    if (signInForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Login failed. Please try again.');
        return;
      }

      alert('Login successful!');
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('username', data.username);

      setSignInForm({ username: '', password: '' });
      navigate('/home');
    } catch (error) {
      console.error('Sign in error:', error);
      alert('An error occurred during sign in. Please try again.');
    }
  };

  const updateSignUpForm = (field, value) => {
    setSignUpForm(prev => ({ ...prev, [field]: value }));
  };

  const updateSignInForm = (field, value) => {
    setSignInForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <img src={logo} alt="BizNest" className="logo" />
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a id="q" href="#">Account Name</a></li>
          </ul>
        </nav>
      </header>

      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input 
              type="text" 
              placeholder="Username"
              value={signUpForm.username}
              onChange={(e) => updateSignUpForm('username', e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email"
              value={signUpForm.email}
              onChange={(e) => updateSignUpForm('email', e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password"
              value={signUpForm.password}
              onChange={(e) => updateSignUpForm('password', e.target.value)}
            />
            <button type="button" onClick={handleSignUpSubmit}>Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            </div>
            <span>or use your email</span>
            <input 
              type="text" 
              placeholder="Username"
              value={signInForm.username}
              onChange={(e) => updateSignInForm('username', e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password"
              value={signInForm.password}
              onChange={(e) => updateSignInForm('password', e.target.value)}
            />
            <a href="#">Forgot Your Password?</a>
            <button type="button" onClick={handleSignInSubmit}>Sign In</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button className="tb" id="login" onClick={handleLogin}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all site features</p>
              <button className="tb" id="register" onClick={handleRegister}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
