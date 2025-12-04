import React, { useEffect, useMemo, useState } from "react";
import api from "../../../config/api";
import "./FineHistory.css";
import { toast } from "react-toastify";

export default function FineHistoryPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numeric);
  };

  // backend returns grouped data { nomor_pinjam, books: [...] } for paid fines
  const normalizeFromGroups = (groups) => {
    const rows = [];

    groups.forEach((group) => {
      const base = {
        nomor_pinjam: group.nomor_pinjam,
        tgl_bayar: group.tgl_bayar || group.tgl_jatuh_tempo || group.tgl_kembali,
      };

      (group.books || []).forEach((book) => {
        rows.push({
          ...base,
          id_denda: book.id_denda,
          copy: book.id_buku_copy,
          judul: book.judul,
          penulis: book.penulis,
          url_foto_cover:
            book.url_foto_cover ||
            book.url_cover ||
            "/navbar/book-placeholder.png",
          hari_telat: book.hari_telat,
          total:
            book.denda_per_buku ??
            book.total_denda ??
            book.nominal_denda ??
            0,
          metode: group.metode || book.metode || "-",
          status: book.status || group.status || "paid",
        });
      });
    });

    return rows;
  };

  const loadHistory = async () => {
    try {
      const res = await api.get("member/denda/paid");
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      const normalized = normalizeFromGroups(data);

      const onlyPaid = normalized.filter((f) => {
        return f.status;
      });

      setFines(onlyPaid);
    } catch (err) {
      console.error("Error loading fine history:", err);
      toast.error(
        err?.response?.data?.message || "Gagal memuat riwayat pembayaran denda."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const totalPaid = useMemo(
    () =>
      fines.reduce((sum, item) => {
        const numeric = Number(item.total);
        return sum + (Number.isNaN(numeric) ? 0 : numeric);
      }, 0),
    [fines]
  );

  const renderSkeleton = () => (
    <div className="fh-page-container">
      <h2 className="fh-title">Fine Payment History</h2>
      <div className="fh-table-card">
        <div className="fh-table-header">
          <div>Book</div>
          <div>Copy</div>
          <div>Paid On</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        <div className="fh-table-body">
          {[1, 2, 3].map((i) => (
            <div className="fh-table-row" key={`sk-${i}`}>
              <div className="fh-col-book">
                <div className="skeleton skeleton-cover" />
                <div className="fh-book-info">
                  <div className="skeleton skeleton-text-long" />
                  <div className="skeleton skeleton-text" />
                </div>
              </div>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="fh-col-status">
                <div className="skeleton skeleton-pill" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return renderSkeleton();

  return (
    <div className="fh-page-container">
      <h2 className="fh-title">Fine Payment History</h2>

      <div className="fh-table-card">
        <div className="fh-table-header">
          <div>Book</div>
          <div>Paid on</div>
          <div>Days Late</div>
          <div>Amount</div>
          <div>Pay Method</div>
          <div>Status</div>
        </div>

        <div className="fh-table-body">
          {fines.length === 0 ? (
            <div className="fh-empty">No paid fines found.</div>
          ) : (
            fines.map((fine, idx) => {
              const key = fine.id_denda || `${fine.nomor_pinjam || "np"}-${idx}`;
              return (
                <div className="fh-table-row" key={key}>
                  <div className="fh-col-book">
                    <img
                      src={fine.url_foto_cover}
                      alt={fine.judul}
                      className="fh-book-cover"
                    />
                    <div className="fh-book-info">
                      <span className="fh-book-title">{fine.judul}</span>
                      <span className="fh-book-author">{fine.penulis}</span>
                      <span className="fh-book-copy">
                        Copy: {fine.copy || "-"}
                      </span>
                    </div>
                  </div>
                  <div>{formatDate(fine.tgl_bayar)}</div>
                  <div>{fine.hari_telat}</div>
                  <div>{formatCurrency(fine.total)}</div>
                  <div>{fine.metode}</div>
                  <div className="fh-col-status">
                    <span className="fh-status-pill fh-status-paid">
                      {fine.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="fh-summary">
          <span>Total Paid</span>
          <strong>{formatCurrency(totalPaid)}</strong>
        </div>
      </div>
    </div>
  );
}
