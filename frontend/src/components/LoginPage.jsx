import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // We'll create this CSS file separately
import logo from '../assets/logo.jpg'

const LoginPage = () => {
  // console.log('LoginPage component function is running!'); // Remove debug log
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
  
  const handleRegister = () => {
    setIsActive(true);
  };

  const handleLogin = () => {
    setIsActive(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation (can keep this)
    if (!signUpForm.username || signUpForm.username === "") {
      alert("User Name can not be empty");
      return;
    }
    if (!signUpForm.password || signUpForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }
    
    // Send data to backend
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpForm),
      });

      const data = await response.json(); // Expecting MessageResponse

      if (!response.ok) {
        // Handle backend errors (e.g., username taken)
        alert(data.message || 'Sign up failed. Please try again.');
        return;
      }

      // Success
      alert(data.message); // Show success message from backend
      setSignUpForm({ username: '', email: '', password: '' }); // Reset form
      setIsActive(false); // Switch to login panel

    } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred during sign up. Please check the console and try again.');
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!signInForm.username || signInForm.username === "") {
      alert("User Name can not be empty");
      return;
    }
    if (!signInForm.password || signInForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }
    
    // Send data to backend
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signInForm),
      });

      const data = await response.json(); // Expecting JwtResponse now

      if (!response.ok) {
        // Handle backend errors (e.g., user not found, wrong password)
        alert(data.message || 'Login failed. Please try again.');
        return;
      }

      // Success: Store JWT and username
      alert('Login successful!'); // Simpler alert for now
      localStorage.setItem('jwtToken', data.token); // Store the JWT token
      localStorage.setItem('username', data.username); // Store username
      
      setSignInForm({ username: '', password: '' });
      navigate('/home'); // Navigate to home page
      
      // Maybe redirect to a logged-in page?
      // window.location.href = "/dashboard"; // Example redirect

    } catch (error) {
      console.error('Sign in error:', error);
      alert('An error occurred during sign in. Please check the console and try again.');
    }
  };

  const updateSignUpForm = (field, value) => {
    setSignUpForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSignInForm = (field, value) => {
    setSignInForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
  <header>
  <nav>
        <ul>
          <img src={logo} alt="BizNest" className="logo" />
          <li><a href="#"></a></li>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a id="q" href="#">Account Name</a></li>
        </ul>
      </nav>
      +
  </header>



      <div className={`container ${isActive ? 'active' : ''}`} id="container">
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
              id="name" 
              name="name" 
              placeholder="Username"
              value={signUpForm.username}
              onChange={(e) => updateSignUpForm('username', e.target.value)}
            />
            <input 
              type="email" 
              id="mail" 
              name="mail" 
              placeholder="Email id"
              value={signUpForm.email}
              onChange={(e) => updateSignUpForm('email', e.target.value)}
            />
            <input 
              type="password" 
              id="pass" 
              name="pass" 
              placeholder="Password"
              value={signUpForm.password}
              onChange={(e) => updateSignUpForm('password', e.target.value)}
            />
            <button type="button" onClick={handleSignUpSubmit}>Sign Up</button>
          </form>
        </div>
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
              id="name1" 
              name="name" 
              placeholder="Username"
              value={signInForm.username}
              onChange={(e) => updateSignInForm('username', e.target.value)}
            />
            <input 
              type="password" 
              id="pass1" 
              name="pass" 
              placeholder="Password"
              value={signInForm.password}
              onChange={(e) => updateSignInForm('password', e.target.value)}
            />
            <a href="#">Forget Your Password?</a>
            <button type="button" onClick={handleSignInSubmit}>Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="tb" id="login" onClick={handleLogin}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="tb" id="register" onClick={handleRegister}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;