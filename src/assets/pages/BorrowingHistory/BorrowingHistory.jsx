import React from "react";
import { Search, Calendar, ArrowUpDown } from "lucide-react";
import "./BorrowingHistory.css";
// ❌ HAPUS: import ProfileLayout from "../ProfileLayout/ProfileLayout";



const historyData = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    cover: "/covers/hobbit.jpg",
    borrowDate: "13 Oct 2025",
    returnDate: "17 Oct 2025",
    statusType: "on-time",
    statusText: "Returned on Time",
  },
  {
    id: 2,
    title: "Jurassic Park",
    author: "Michael Crichton",
    cover: "/covers/jurassic.jpg",
    borrowDate: "20 Oct 2025",
    returnDate: "30 Oct 2025",
    statusType: "fine",
    statusText: "Fine: Rp7.500",
  },
  {
    id: 3,
    title: "Moby-Dick; or, The Whale",
    author: "Herman Melville",
    cover: "/covers/mobydick.jpg",
    borrowDate: "01 Nov 2025",
    returnDate: "03 Nov 2025",
    statusType: "on-time",
    statusText: "Returned on Time",
  },
];


export default function BorrowedHistory() {
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
          />
        </div>

        <button className="bh-toolbar-btn">
          <Calendar size={16} />
          <span>Filter by Date</span>
        </button>

        <button className="bh-toolbar-btn bh-toolbar-btn-primary">
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

        {historyData.map((item, idx) => (
          <div
            key={item.id}
            className={
              "bh-table-row" +
              (idx === historyData.length - 1 ? " bh-last-row" : "")
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
              <span>{item.returnDate}</span>
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
