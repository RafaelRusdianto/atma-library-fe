import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/NavBar/navbar';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h3 className="login-title">Create Your Account</h3>

        <form>
          <label>Nama</label>
          <input type="text" placeholder="Nama" required />

          <label>Username</label>
          <input type="text" placeholder="Username" required />

          <label>Password</label>
          <input type="password" placeholder="Password" required />

          <label>Alamat</label>
          <input type="text" placeholder="Alamat" required />

          <label>Email</label>
          <input type="email" placeholder="Email" required />

          <label>No. Telepon</label>
          <input type="text" placeholder="08xxxxxxxxxx" required />

          <button type="submit" className="btn-login">Register</button>

          <p className="register-text">
            Already have an account?{" "}
            <a onClick={() => navigate("/login")}>Login here</a>
          </p>

          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
