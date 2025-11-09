import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from '../../components/NavBar/navbar';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero‐inner">
          <h1>Welcome to Atma Library</h1>
          <p>Your material, your research, our collection.</p>
          <div className="search‐box">
            <input type="text" placeholder="Search catalog or articles…" />
            <button className="search-btn">SEARCH</button>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>Library Services</h2>
        <div className="services‐grid">
          <div className="service">
            <h3>Borrow & Return</h3>
            <p>Find out how to borrow, renew and return materials.</p>
          </div>
          <div className="service">
            <h3>Study Spaces</h3>
            <p>Reserve rooms or find a quiet spot in the library.</p>
          </div>
          <div className="service">
            <h3>Digital Collections</h3>
            <p>Explore our rich digital archives and e-resources.</p>
          </div>
          <div className="service">
            <h3>Ask a Librarian</h3>
            <p>Get support and guidance from our expert team.</p>
          </div>
        </div>
      </section>

      <section className="collections">
        <h2>Featured Collections</h2>
        <div className="collections‐grid">
          <div className="collection">
            <img src="/images/collection1.jpg" alt="Collection 1" />
            <h4>Special Manuscripts</h4>
          </div>
          <div className="collection">
            <img src="/images/collection2.jpg" alt="Collection 2" />
            <h4>Digital Archives</h4>
          </div>
          <div className="collection">
            <img src="/images/collection3.jpg" alt="Collection 3" />
            <h4>Rare Books</h4>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;