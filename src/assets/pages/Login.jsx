import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // arahkan ke halaman Home
  };

  return (
    <div className="login-container">
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
                <img src="../public/google.jpg" alt="Google" />
            </button>
            <button type="button" className="social-btn github">
                <img src="../public/github.png" alt="GitHub" />
            </button>
            <button type="button" className="social-btn facebook">
                <img src="../public/facebook.png" alt="Facebook" />
            </button>
          </div>

          <p className="register-text">
            Don’t have an account? <a href="#">Register for free</a>
          </p>

          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;