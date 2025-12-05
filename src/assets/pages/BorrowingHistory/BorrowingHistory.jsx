// BorrowingHistory.jsx
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import { Search } from "lucide-react";
import "./BorrowingHistory.css";

export default function BorrowedHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadHistory = async () => {
    try {
      const res = await api.get("/member/peminjaman/riwayat");
      setRows(res.data.data || []);
    } catch (err) {
      console.error("Error loading borrowed history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const renderStatusPill = (status) => {
    const normalized = (status || "").toString().toLowerCase().trim();

    if (normalized === "returned") {
      return (
        <span className="bh-status-pill bh-status-returned">
          Returned
        </span>
      );
    }

    if (normalized === "rejected") {
      return (
        <span className="bh-status-pill bh-status-rejected">
          Rejected
        </span>
      );
    }

    return (
      <span className="bh-status-pill bh-status-default">
        {status || "Unknown"}
      </span>
    );
  };

  const filteredRows = rows.filter((item) =>
    (item.judul + " " + item.penulis)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const renderSkeleton = () => (
    <>
      <h2 className="profile-section-title">Borrowing History</h2>
      <div className="bh-toolbar">
        <div className="bh-search-box skeleton skeleton-input" />
      </div>
      <section className="bh-table-card">
        <div className="bh-table-inner">
          <div className="bh-table-header">
            <div className="bh-col-title">Book Title</div>
            <div className="bh-col-author">Author</div>
            <div className="bh-col-date">Borrowed on</div>
            <div className="bh-col-date">Returned on</div>
            <div className="bh-col-status">Status</div>
          </div>
          {[1, 2, 3].map((i) => (
            <div className="bh-table-row" key={`sk-${i}`}>
              <div className="bh-col-title">
                <div className="bh-book-cover skeleton" />
                <div className="bh-book-title skeleton skeleton-text-long" />
              </div>
              <div className="bh-col-author">
                <div className="skeleton skeleton-text" />
              </div>
              <div className="bh-col-date">
                <div className="skeleton skeleton-text" />
              </div>
              <div className="bh-col-date">
                <div className="skeleton skeleton-text" />
              </div>
              <div className="bh-col-status">
                <div className="skeleton skeleton-pill" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  if (loading){
    return renderSkeleton();
  } 

  return (
    <>
      <h2 className="profile-section-title">Borrowing History</h2>

      <div className="bh-toolbar">
        <div className="bh-search-box">
          <Search size={18} className="bh-search-icon" />
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <section className="bh-table-card">
        <div className="bh-table-inner">
          {/* header */}
          <div className="bh-table-header">
            <div className="bh-col-title">BOOK TITLE</div>
            <div className="bh-col-author">AUTHOR</div>
            <div className="bh-col-date">BORROWED ON</div>
            <div className="bh-col-date">RETURNED ON</div>
            <div className="bh-col-status">STATUS</div>
          </div>

          {/* body */}
          {filteredRows.length === 0 ? (
            <div className="bh-empty">
              No returned/rejected books found.
            </div>
          ) : (
            paginatedRows.map((item, idx) => (
              <div
                key={`${item.nomor_pinjam}-${item.id_buku_copy}`}
                className={
                  "bh-table-row" +
                  (idx === paginatedRows.length - 1 ? " bh-last-row" : "")
                }
              >
                <div className="bh-col-title">
                  <img
                    src={item.url_foto_cover}
                    alt={item.judul}
                    className="bh-book-cover"
                  />
                  <span className="bh-book-title">{item.judul}</span>
                </div>

                <div className="bh-col-author">
                  <span className="bh-author-text">{item.penulis}</span>
                </div>

                <div className="bh-col-date">
                  {formatDate(item.tgl_pinjam)}
                </div>

                <div className="bh-col-date">
                  {formatDate(item.tgl_kembali)}
                </div>

                <div className="bh-col-status">
                  {renderStatusPill(item.status_detail)}
                </div>
              </div>
            ))
          )}
        </div>

        {filteredRows.length > 0 && (
          <div className="bh-pagination">
            <button
              type="button"
              className="bh-page-btn"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="bh-page-info">
              Page {safePage} / {totalPages}
            </span>
            <button
              type="button"
              className="bh-page-btn"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
