import React from "react";
import "./Home.css";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Your Gateway to Knowledge</h1>
          <p className="hero-subtitle">
            Search the library catalog by title, author, or ISBN...
          </p>

          <div className="hero-search">
            <Search className="search-icon-home" size={20} />
            <input
              type="text"
              placeholder="Enter title, author, or ISBN here"
            />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* Exlpore Section */}
      <section className="collections-section">
        <h2>Explore Our Collections</h2>

        <div className="collections-grid">
          <div className="collection-card">
            <img src="/images/collection1.jpg" alt="" />
            <span>New Arrivals</span>
          </div>

          <div className="collection-card">
            <img src="/images/collection2.jpg" alt="" />
            <span>Faculty Recommendations</span>
          </div>

          <div className="collection-card">
            <img src="/images/collection3.jpg" alt="" />
            <span>Essential Study Guides</span>
          </div>

          <div className="collection-card">
            <img src="/images/collection4.jpg" alt="" />
            <span>Digital Archives</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Library Services & Resources</h2>

        <div className="services-grid">

          <div className="service-card">
            <h3>Borrowing & Returns</h3>
            <p>Easily check out, renew, and return books and materials.</p>
          </div>

          <div className="service-card">
            <h3>Research Assistance</h3>
            <p>Get expert help for your research and academic projects.</p>
          </div>

          <div className="service-card">
            <h3>Digital Resources</h3>
            <p>Access e-books, journals, and online databases 24/7.</p>
          </div>

          <div className="service-card">
            <h3>Study Spaces</h3>
            <p>Quiet study rooms and collaborative group areas.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
