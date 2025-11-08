import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 
import Navbar from '../../components/NavBar/navbar';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h3 className="login-title">Glad you're back!</h3>

        <form>
          <label>Username</label>
          <input type="Username" placeholder="Username" required />

          <label>Password</label>
          <input type="password" placeholder="Password" required />

          <a href="#" className="forgot-password">Forgot Password?</a>

          <button type="submit" className="btn-login">Log in</button>

          <p className="continue-text">or continue with</p>

          <div className="social-login">
            <button type="button" className="social-btn google">
                <img src="/google.jpg" alt="Google" />
            </button>
            <button type="button" className="social-btn github">
                <img src="/github.png" alt="GitHub" />
            </button>
            <button type="button" className="social-btn facebook">
                <img src="/facebook.png" alt="Facebook" />
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

export default Login;