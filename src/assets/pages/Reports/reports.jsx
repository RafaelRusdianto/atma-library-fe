import React, { useEffect, useState } from "react";
import "./reports.css";
import api from "../../../config/api";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState("loans"); // "loans" | "fines"
  const [loans, setLoans] = useState([]);
  const [fines, setFines] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingFines, setLoadingFines] = useState(true);

  useEffect(() => {
    fetchSummary();
    fetchLoans();
    fetchFines();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/petugas/reports/summary");
      setSummary(res.data);
    } catch (error) {
      console.error("Gagal mengambil summary report:", error);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await api.get("/petugas/reports/loans");
      setLoans(res.data.data ?? res.data);
    } catch (error) {
      console.error("Gagal mengambil laporan peminjaman:", error);
    } finally {
      setLoadingLoans(false);
    }
  };

  const fetchFines = async () => {
    try {
      const res = await api.get("/petugas/reports/fines");
      setFines(res.data.data ?? res.data);
    } catch (error) {
      console.error("Gagal mengambil laporan denda:", error);
    } finally {
      setLoadingFines(false);
    }
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Reports</h1>
          <p className="reports-subtitle">
            Ringkasan aktivitas perpustakaan dan laporan transaksi peminjaman
            serta pembayaran denda.
          </p>
        </div>
      </div>

      {/* Summary cards, tanpa background biru */}
      {summary && (
        <div className="reports-summary-card">
          <div className="summary-grid">
            <div className="summary-item">
              <p className="summary-label">Total Buku</p>
              <p className="summary-value">{summary.total_buku}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Total Member</p>
              <p className="summary-value">{summary.total_member}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Peminjaman Aktif</p>
              <p className="summary-value">{summary.peminjaman_aktif}</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Total Denda Terbayar</p>
              <p className="summary-value">
                Rp {Number(summary.total_denda_bayar || 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="reports-tabs-card">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "loans" ? "active" : ""}`}
            onClick={() => setActiveTab("loans")}
          >
            Peminjaman
          </button>
          <button
            className={`tab-btn ${activeTab === "fines" ? "active" : ""}`}
            onClick={() => setActiveTab("fines")}
          >
            Denda
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "loans" ? (
            <>
              <div className="tabs-title-row">
                <h2 className="tabs-title">Laporan Peminjaman Terbaru</h2>
              </div>
              {loadingLoans ? (
                <p className="loading-text">Loading data peminjaman...</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nomor Pinjam</th>
                      <th>Tanggal Pinjam</th>
                      <th>Tanggal Kembali</th>
                      <th>Member</th>
                      <th>Jumlah Buku</th>
                      <th>Status</th>
                      <th>Total Denda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((item, index) => (
                      <tr key={item.nomor_pinjam ?? index}>
                        <td>{index + 1}</td>
                        <td>{item.nomor_pinjam}</td>
                        <td>{item.tgl_pinjam}</td>
                        <td>{item.tgl_kembali}</td>
                        <td>{item.nama_member}</td>
                        <td className="text-center">{item.jumlah_buku}</td>
                        <td>
                          <span className={`status-pill status-${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          Rp{" "}
                          {Number(item.total_denda || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {loans.length === 0 && (
                      <tr>
                        <td colSpan="8" className="empty-text">
                          Tidak ada data peminjaman.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <>
              <div className="tabs-title-row">
                <h2 className="tabs-title">Laporan Pembayaran Denda Terbaru</h2>
              </div>
              {loadingFines ? (
                <p className="loading-text">Loading data denda...</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>ID Pembayaran</th>
                      <th>Tanggal Bayar</th>
                      <th>Member</th>
                      <th>Total Bayar</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fines.map((item, index) => (
                      <tr key={item.id_pembayaran ?? index}>
                        <td>{index + 1}</td>
                        <td>{item.id_pembayaran}</td>
                        <td>{item.tgl_bayar}</td>
                        <td>{item.nama_member}</td>
                        <td>
                          Rp{" "}
                          {Number(item.total_bayar || 0).toLocaleString("id-ID")}
                        </td>
                        <td>{item.keterangan}</td>
                      </tr>
                    ))}
                    {fines.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-text">
                          Tidak ada data pembayaran denda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
