import { useEffect, useState } from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path;
  
   // Ambil state dari AuthContext
  const { isLoggedIn, role, user } = useAuth();

  console.log("USER NAVBAR:", user);
  const fotoProfil = user?.url_foto_profil
    ? user.url_foto_profil
    : "/icons/blank-pfp.png";

 

  console.log("Navbar - isLoggedIn:", isLoggedIn, "role:", role);
  return (
    <nav className="navbar">
      <div className="nav-left-col">
        <a onClick={() => navigate("/")}>
          <img src="/navbar/logo.png" alt="logo" className="navbar-logo" />
        </a>
      </div>

      <div className="nav-center-col">
        <ul className="nav-links">
          {/*navbar utk umum*/}
          <li className={isActive("/catalog") ? "nav-active" : ""} onClick={() => navigate("/catalog")}>Catalog</li>
          <li className={isActive("/support") ? "nav-active" : ""}  onClick={() => navigate("/support")}>Support</li>

          {/*navbar utk user*/}
          {isLoggedIn && role === "member" && (
            <>
              <li className={isActive("/ongoing") ? "nav-active" : ""}  onClick={() => navigate("/ongoing")}>On-Going</li>
              <li className={isActive("/fines") ? "nav-active" : ""}  onClick={() => navigate("/fines")}>Fines</li>
              <li className={isActive("/cart") ? "nav-active" : ""}  onClick={() => navigate("/cart")}>Cart</li>
            </>
          )}

          {/*navbar utk staff*/}
          {isLoggedIn && role === "petugas" && (
            <>
              <li className={isActive("/managebooks") ? "nav-active" : ""}  onClick={() => navigate("/managebooks")}>Manage Books</li>
              <li className={isActive("/borrow-requests") ? "nav-active" : ""}  onClick={() => navigate("/borrow-requests")}>Borrow Requests</li>
              <li className={isActive("/members") ? "nav-active" : ""}  onClick={() => navigate("/members")}>Member List</li>
              <li className={isActive("/reports") ? "nav-active" : ""}  onClick={() => navigate("/reports")}>Reports</li>
            </>
          )}

        </ul>
      </div>

      <div className="nav-right-col">
        {/*kalo logged in, show:  */}
        {!isLoggedIn ? (
          <>
            <button className="regis-btn" onClick={() => navigate("/register")}>Register</button>
            <button className="sgnin-btn" onClick={() => navigate("/login")}>Log In</button>
          </>
        ) : (
          <button className="pfp-btn" onClick={() => navigate("/profile")}>
            <img src={fotoProfil} alt="pfp" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
