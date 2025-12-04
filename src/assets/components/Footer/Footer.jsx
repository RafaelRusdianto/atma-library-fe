import "./Footer.css";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Atma Library</h4>
          <p>Atma University</p>
          <p>📍 742 Evergreen Terrace, Springfield</p>
          <p>📞 (0274) 563248</p>
          <p>📧 atmalibrary@uajy.ac.id</p>
        </div>

        <div className="footer-section">
          <h4>Library Services</h4>
          <a onClick={() => navigate("/catalog")}>Catalog</a>
          <a onClick={() => navigate("/support")}>Support</a>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="socials">
            <a href="https://www.instagram.com/">Instagram</a>
            <a href="https://www.facebook.com/">Facebook</a>
            <a href="https://www.youtube.com/">YouTube</a>
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
