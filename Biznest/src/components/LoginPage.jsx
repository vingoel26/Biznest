import { useState, useEffect } from 'react';
import './LoginPage.css'; // We'll create this CSS file separately
import logo from '../assets/logo.jpg'

const LoginPage = () => {
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
  
  // Initial user database with test account
  const [users, setUsers] = useState({
    usernames: ["test"],
    emails: ["abc@gmail.com"],
    passwords: ["12345678"]
  });

  const handleRegister = () => {
    setIsActive(true);
  };

  const handleLogin = () => {
    setIsActive(false);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!signUpForm.username || signUpForm.username === "") {
      alert("User Name can not be empty");
      return;
    }
    else if (signUpForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }
    
    // Register the new user
    setUsers(prevUsers => ({
      usernames: [...prevUsers.usernames, signUpForm.username],
      emails: [...prevUsers.emails, signUpForm.email],
      passwords: [...prevUsers.passwords, signUpForm.password]
    }));
    
    alert("Registered! Please Login");
    
    // Reset form and switch to login mode
    setSignUpForm({ username: '', email: '', password: '' });
    setIsActive(false);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!signInForm.username || signInForm.username === "") {
      alert("User Name can not be empty");
      return;
    }
    else if (signInForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }
    
    // Check if username exists
    const userIndex = users.usernames.indexOf(signInForm.username);
    
    if (userIndex !== -1) {
      // In a real app, you would also check if the password matches
      // For now, we're just checking if username exists, like in the original code
      window.location.href = "/WDA-assignment/home-page/homepage.html";
    } else {
      alert("Try again");
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