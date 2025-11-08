import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/NavBar/navbar';

const Register = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePasswords = (pass, confirm) => {
    if (!confirm) {
      setError("");
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match!");
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    alert("Register success!");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h3 className="login-title">Create Your Account</h3>

        <form onSubmit={handleSubmit}>
          <label>Nama</label>
          <input type="text" placeholder="Nama" required />

          <label>Username</label>
          <input type="text" placeholder="Username" required />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
              validatePasswords(e.target.value, confirmPassword);
            }}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validatePasswords(password, e.target.value);
            }}
          />

          {error && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "-5px" }}>
              {error}
            </p>
          )}

          <label>Alamat</label>
          <input type="text" placeholder="Alamat" required />

          <label>Email</label>
          <input type="email" placeholder="Email" required />

          <label>No. Telepon</label>
          <input type="text" placeholder="08xxxxxxxxxx" required />

          <button 
            type="submit" 
            className="btn-login"
            disabled={error !== ""} 
          >
            Register
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/login")}>Login here</a>
          </p>

          <button type="button" className="btn-back" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;