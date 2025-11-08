import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <span className="logo">Atma Library</span>

      <ul className="nav-links">
        <li>Dashboard</li>
        <li>Katalog</li>
        <li>Support</li>
      </ul>

      <div className="nav-left">
        <button className="regis-btn" onClick={() => navigate("/register")}>Register</button>
        <button className="sgnin-btn" onClick={() => navigate("/login")}>Log In</button>
      </div>
    </nav>
  );
}

export default Navbar;
