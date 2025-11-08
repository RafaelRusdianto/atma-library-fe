import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Atma Library</h4>
          <p>Universitas Atma Jaya Yogyakarta</p>
          <p>📍 Jalan Babarsari, Yogyakarta</p>
          <p>📞 (0274) 123456</p>
          <p>📧 atmalibrary@uajy.ac.id</p>
        </div>

        <div className="footer-section">
          <h4>Library Services</h4>
          <a onClick={() => navigate("/")}>Catalog</a>
          <a>Borrow & Return</a>
          <a>E-Resources</a>
          <a>Study Room Booking</a>
          <a>Fines & Payments</a>
        </div>

        <div className="footer-section">
          <h4>Help & Support</h4>
          <a>FAQ</a>
          <a>Ask a Librarian</a>
          <a>Contact Us</a>
          <a>Library Regulations</a>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="socials">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>YouTube</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Atma Library — All Rights Reserved.<br></br>
        Powered by Atma Library System v1.0
      </div>
    </footer>
  );
}
