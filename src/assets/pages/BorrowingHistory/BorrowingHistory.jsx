import React, { useEffect, useState, useMemo } from "react";
import { Search, Calendar, ArrowUpDown } from "lucide-react";
import "./BorrowingHistory.css";
import api from "../../../config/api"; // sama seperti di BookDetail

export default function BorrowedHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/member/history")
      .then((res) => {
        const data = res.data?.data || [];
        setHistoryData(data);
      })
      .catch((err) => {
        console.error("Error fetching borrowing history:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    let rows = historyData;

    if (term) {
      rows = rows.filter((item) =>
        (item.title + " " + item.author).toLowerCase().includes(term)
      );
    }

    rows = [...rows].sort((a, b) => {
      const da = new Date(a.borrowDate);
      const db = new Date(b.borrowDate);
      return sortAsc ? da - db : db - da;
    });

    return rows;
  }, [historyData, search, sortAsc]);

  return (
    <>
      <h2 className="profile-section-title">Borrowing History</h2>

      {/* Search & filter bar */}
      <div className="bh-toolbar">
        <div className="bh-search-box">
          <Search size={18} className="bh-search-icon" />
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* tombol filter date belum dipakai, cuma UI */}
        <button className="bh-toolbar-btn">
          <Calendar size={16} />
          <span>Filter by Date</span>
        </button>

        <button
          className="bh-toolbar-btn bh-toolbar-btn-primary"
          type="button"
          onClick={() => setSortAsc((prev) => !prev)}
        >
          <ArrowUpDown size={16} />
          <span>Sort by Borrow Date</span>
        </button>
      </div>

      {/* History table card */}
      <section className="bh-table-card">
        {/* header row */}
        <div className="bh-table-header">
          <div className="bh-col-title">BOOK TITLE</div>
          <div className="bh-col-author">AUTHOR</div>
          <div className="bh-col-date">BORROWED ON</div>
          <div className="bh-col-date">RETURNED ON</div>
          <div className="bh-col-status">STATUS / FINE</div>
        </div>

        {loading && (
          <div className="bh-table-row">
            <div className="bh-col-title">Loading history...</div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bh-table-row">
            <div className="bh-col-title">No borrowing history yet.</div>
          </div>
        )}

        {!loading &&
          filtered.map((item, idx) => (
            <div
              key={item.id_buku_copy + item.borrowDate}
              className={
                "bh-table-row" +
                (idx === filtered.length - 1 ? " bh-last-row" : "")
              }
            >
              <div className="bh-col-title">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="bh-book-cover"
                />
                <span className="bh-book-title">{item.title}</span>
              </div>

              <div className="bh-col-author">
                <span className="bh-author-text">{item.author}</span>
              </div>

              <div className="bh-col-date">
                <span>{item.borrowDate}</span>
              </div>

              <div className="bh-col-date">
                <span>{item.returnDate || "-"}</span>
              </div>

              <div className="bh-col-status">
                <span
                  className={
                    "bh-status-pill " +
                    (item.statusType === "fine"
                      ? "bh-status-fine"
                      : "bh-status-ok")
                  }
                >
                  {item.statusText}
                </span>
              </div>
            </div>
          ))}

        <div className="bh-table-row bh-empty-row">
          <div className="bh-col-title" />
          <div className="bh-col-author" />
          <div className="bh-col-date" />
          <div className="bh-col-date" />
          <div className="bh-col-status" />
        </div>
      </section>
    </>
  );
}
