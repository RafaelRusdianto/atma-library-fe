import React from "react";
import "./support.css";

function Support() {
  const data = {
    deskripsi:
      "Contact us if you need help regarding book borrowing, membership, or other library services.",
    email: "atmalibrary@uajy.ac.id",
    telepon: "(0274) 563248",
    whatsapp: "+62 111-2222-3333",
    alamat: "742 Evergreen Terrace, Springfield",
    instagram: "https://instagram.com/atma.library",
    facebook: "https://facebook.com/atmalibrary",
    twitter: "https://x.com/atmalibrary",
    jam_operasional: "Monday - Friday, 08.00 - 16.00 WIB",
  };

  return (
    <div className="support-page">
      {/* HEADER */}
      <div className="header">
        <h1>Library Support</h1>
        <p>{data.deskripsi}</p>
      </div>

      {/* GRID SECTION */}
      <div className="support-grid">

        {/* CONTACT CARD */}
        <div className="support-card">
          <h2 className="card-title">Contact Information</h2>
          <p className="contact-item">
            <strong>Email:</strong> {data.email}
          </p>
          <p className="contact-item">
            <strong>Phone:</strong> {data.telepon}
          </p>
          <p className="contact-item">
            <strong>WhatsApp:</strong> {data.whatsapp}
          </p>
          <p className="contact-item">
            <strong>Address:</strong> {data.alamat}
          </p>
          <p className="support-note">
            Operational Hours: {data.jam_operasional}
          </p>
        </div>

        {/* SOCIAL MEDIA CARD */}
        <div className="support-card">
          <h2 className="card-title">Social Media</h2>
          <p className="social-desc">
            Follow us on social media for updates on collections and the latest library information.
          </p>

          <div className="social-links">
            {/* Instagram */}
            <a
              className="social-pill instagram"
              href={data.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/icons/instagram.avif"
                alt="Instagram"
                className="social-icon-img"
              />
              <span>Instagram</span>
            </a>

            {/* Facebook */}
            <a
              className="social-pill facebook"
              href={data.facebook}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/icons/facebook.png"
                alt="Facebook"
                className="social-icon-img"
              />
              <span>Facebook</span>
            </a>

            {/* X (Twitter) */}
            <a
              className="social-pill twitter"
              href={data.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/icons/twiter.avif"
                alt="X (Twitter)"
                className="social-icon-img"
              />
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
