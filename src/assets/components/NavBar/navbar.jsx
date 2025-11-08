import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      
      <div className="nav-left-col">
        <a onClick={() => navigate("/")}>
          <img src="/logo.png" alt="logo" className="navbar-logo"/>
        </a>
      </div>

      <div className="nav-center-col">
        <ul className="nav-links">
          <li>Dashboard</li>
          <li>Catalog</li>
          <li>Support</li>
        </ul>
      </div>

      <div className="nav-right-col">
        <button className="regis-btn" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="sgnin-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>

    </nav>
  );
}

export default Navbar;
