import React from "react";
import "./Support.css";

function Support() {
  const data = {
    deskripsi:
      "Hubungi kami jika membutuhkan bantuan terkait peminjaman buku, keanggotaan, atau layanan perpustakaan lainnya.",
    email: "perpustakaan@atma.ac.id",
    telepon: "(0274) 123456",
    whatsapp: "+62 812-3456-7890",
    alamat: "Jl. Babarsari No. 1, Yogyakarta",
    instagram: "https://instagram.com/atma.library",
    facebook: "https://facebook.com/atmalibrary",
    twitter: "https://x.com/atmalibrary",
    jam_operasional: "Senin - Jumat, 08.00 - 16.00 WIB",
  };

  return (
    <div className="support-page">
      {/* HEADER ATAS SAJA */}
      <div className="header">
        <h1>Support Perpustakaan</h1>
        <p>{data.deskripsi}</p>
      </div>

      {/* DUA KARTU DI BAWAH: CONTACT & MEDIA SOSIAL */}
      <div className="support-grid">
        {/* Kartu Contact Person */}
        <div className="support-card">
          <h2 className="card-title">Contact Person</h2>
          <p className="contact-item">
            <strong>Email:</strong> {data.email}
          </p>
          <p className="contact-item">
            <strong>Telepon:</strong> {data.telepon}
          </p>
          <p className="contact-item">
            <strong>WhatsApp:</strong> {data.whatsapp}
          </p>
          <p className="contact-item">
            <strong>Alamat:</strong> {data.alamat}
          </p>
          <p className="support-note">
            Jam operasional: {data.jam_operasional}
          </p>
        </div>

        {/* Kartu Media Sosial */}
        <div className="support-card">
          <h2 className="card-title">Media Sosial</h2>
          <p className="social-desc">
            Ikuti kami di media sosial untuk update koleksi dan informasi
            terbaru.
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

            {/* X / Twitter */}
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
