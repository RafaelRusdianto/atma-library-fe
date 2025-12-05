import { useState } from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };
  
   // Ambil state dari AuthContext
  const { isLoggedIn, role, user } = useAuth();
  const fotoProfil =
    user?.url_foto_profil || "/icons/blank-pfp.png";
  return (
    <nav className="navbar">
      <div className="nav-left-col">
        <a onClick={() => handleNav("/")}>
          <img src="/navbar/logo.png" alt="logo" className="navbar-logo" />
        </a>
      </div>

      <button
        className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-center-col ${menuOpen ? "nav-open" : ""}`}>
        <ul className="nav-links">
          {/*navbar utk umum*/}
          <li className={isActive("/catalog") ? "nav-active" : ""} onClick={() => handleNav("/catalog")}>Catalog</li>
          <li className={isActive("/support") ? "nav-active" : ""}  onClick={() => handleNav("/support")}>Support</li>

          {/*navbar utk user*/}
          {isLoggedIn && role === "member" && (
            <>
              <li className={isActive("/on-going") ? "nav-active" : ""}  onClick={() => handleNav("/on-going")}>On-Going</li>
              <li className={isActive("/fines") ? "nav-active" : ""}  onClick={() => handleNav("/fines")}>Fines</li>
              <li className={isActive("/cart") ? "nav-active" : ""}  onClick={() => handleNav("/cart")}>Cart</li>
            </>
          )}

          {/*navbar utk staff*/}
          {isLoggedIn && role === "petugas" && (
            <>
              <li className={isActive("/managebooks") ? "nav-active" : ""}  onClick={() => handleNav("/managebooks")}>Manage Books</li>
              <li className={isActive("/borrow-requests") ? "nav-active" : ""}  onClick={() => handleNav("/borrow-requests")}>Borrow Requests</li>
              <li className={isActive("/members") ? "nav-active" : ""}  onClick={() => handleNav("/members")}>Member List</li>
              <li className={isActive("/reports") ? "nav-active" : ""}  onClick={() => handleNav("/reports")}>Reports</li>
            </>
          )}

        </ul>
      </div>

      <div className="nav-right-col">
        {/*kalo logged in, show:  */}
        {!isLoggedIn ? (
          <>
            <button className="regis-btn" onClick={() => handleNav("/register")}>Register</button>
            <button className="sgnin-btn" onClick={() => handleNav("/login")}>Log In</button>
          </>
        ) : (
          <button className="pfp-btn" onClick={() => handleNav("/profile")}>
            <img src={fotoProfil} alt="pfp" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
