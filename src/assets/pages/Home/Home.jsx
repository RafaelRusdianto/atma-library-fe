import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from '../../components/NavBar/navbar';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-card"> 
        <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Welcome to Atma Library!</h1>
        <p>Click the button below to sign in as a member</p>
        <button class="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
        </div>
    </div>
  );
}

export default Home;