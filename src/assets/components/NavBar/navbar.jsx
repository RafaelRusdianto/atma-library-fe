import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // cek login status
    const auth = localStorage.getItem("auth");
    const userRole = localStorage.getItem("role");

    setIsLoggedIn(auth === "true");
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
          <li onClick={() => navigate("/catalog")}>Catalog</li>
          <li onClick={() => navigate("/support")}>Support</li>

          {/*navbar utk user*/}
          {isLoggedIn && role === "user" && (
            <>
              <li onClick={() => navigate("/ongoing")}>On-Going</li>
              <li onClick={() => navigate("/fines")}>Fines</li>
              <li onClick={() => navigate("/cart")}>Cart</li>
            </>
          )}

          {/*navbar utk staff*/}
          {isLoggedIn && role === "staff" && (
            <>
              <li onClick={() => navigate("/manage-books")}>Manage Books</li>
              <li onClick={() => navigate("/borrow-requests")}>Borrow Requests</li>
              <li onClick={() => navigate("/members")}>Member List</li>
              <li onClick={() => navigate("/reports")}>Reports</li>
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
            <img src="/icons/blank-pfp.png" alt="pfp" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
