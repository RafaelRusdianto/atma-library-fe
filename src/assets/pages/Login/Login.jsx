import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from '../../components/NavBar/navbar';

export default function Login () {
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

    
    async function handleLogin(e){
      e.preventDefault();
      const res = await fetch('/api/login', {
        method: "post",
        body: JSON.stringify(formData),
    }); 


    const data = await res.json();

    if(data.errors){
      setErrors(data.errors);
      return;
    }else{
      localStorage.setItem('token', data.token);
      navigate('/');
      console.log(data);
      alert("Login success!");
    }

    };



  return (
    <div className="login-page">
      <div className="logo-side">
        <img src="signlogin/logo-montserrat.png" alt="logo" />
      </div>
      <div className="login-card">
        <h3 className="login-title">Glad you're back!</h3>

        <form onSubmit={handleLogin}>
         <label>Email</label>
          <input type="email" placeholder="Email" required
          value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}


          <a href="#" className="forgot-password">Forgot Password?</a>

          <button type="submit" className="btn-login">Log in</button>

          <p className="continue-text">or continue with</p>

          <div className="social-login">
            <button type="button" className="social-btn google">
              <img src="/icons/google.jpg" alt="Google" />
            </button>
            <button type="button" className="social-btn github">
              <img src="/icons/github.png" alt="GitHub" />
            </button>
            <button type="button" className="social-btn facebook">
              <img src="/icons/facebook.png" alt="Facebook" />
            </button>
          </div>

          <p className="register-text">
            Don’t have an account? {" "}
            <a href="#" onClick={() => navigate("/register")}>Register for free</a>
          </p>

          <button type="button" className="btn-back" onClick={() => navigate("/")}>← Back to Home</button>
        </form>
      </div>
    </div>
  );
};

