import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "./OnGoing.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function OnGoingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  //index peminjaman yg on-going
  const loadOnGoing = async () => {
    try {
      const res = await api.get("/peminjaman/getPendingAndBorrowed");
      console.log("ON-GOING RESPONSE:", res.data);

      const data = res.data.data || [];
      setRows(data);
    } catch (err) {
      console.error("Error loading On-going:", err);
      toast.error("Failed to load on-going borrow data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOnGoing();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // kembaliin 1 buku
  const handleReturn = async (item) => {
    if (item.status_peminjaman !== "borrowed") return;

    const confirm = await Swal.fire({
      title: "Return this book?",
      text: `You are returning "${item.judul}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, return",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await api.put("member/peminjaman/kembali", {
        nomor_pinjam: item.nomor_pinjam,
        id_buku_copy: item.id_buku_copy,
      });

      console.log("RETURN RESPONSE:", res.data);

      await Swal.fire({
        icon: "success",
        title: "Book Returned",
        text: "The book has been successfully returned.",
        timer: 1700,
        showConfirmButton: false,
      });

      loadOnGoing();
    } catch (err) {
      console.error("Return error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to return this book. Please try again."
      );
    }
  };

  // kembaliin semua buku
  const handleReturnAll = async () => {
    const hasBorrowed = rows.some((r) => r.status_peminjaman === "borrowed");
    if (!hasBorrowed) {
      toast.info("There are no borrowed books to return.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Return all books?",
      text: "All borrowed books in this list will be returned.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, return all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await api.put("member/peminjaman/kembaliSemua");
      console.log("RETURN ALL RESPONSE:", res.data);

      await Swal.fire({
        icon: "success",
        title: "All Books Returned",
        text: "All borrowed books have been successfully returned.",
        timer: 1700,
        showConfirmButton: false,
      });

      loadOnGoing();
    } catch (err) {
      console.error("Return-all error:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to return all books. Please try again."
      );
    }
  };

  const hasBorrowed = rows.some((r) => r.status_peminjaman === "borrowed");

  // tampilan laoding
  if (loading) {
    return (
      <div className="cart-page-container">
        <h2 className="cart-title">On-going Borrow</h2>

        <div className="bh-table-card ongoing-table-card">
          <div className="ongoing-table-header">
            <div>Book Title</div>
            <div>Author</div>
            <div>Borrowed On</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="ongoing-table-body">
            {[1, 2, 3].map((i) => (
              <div className="ongoing-table-row" key={i}>
                <div className="bh-col-title">
                  <div className="skeleton skeleton-cover" />
                  <div className="skeleton skeleton-text-long" />
                </div>
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-pill" />
                <div className="skeleton skeleton-pill" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2 className="cart-title">On-going Borrow</h2>

      <div className="bh-table-card ongoing-table-card">
        {/* HEADER */}
        <div className="ongoing-table-header">
          <div>Book Title</div>
          <div>Author</div>
          <div>Borrowed On</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* BODY */}
        <div className="ongoing-table-body">
          {rows.length === 0 ? (
            <div className="cart-empty">You have no on-going borrowings.</div>
          ) : (
            rows.map((item, idx) => {
              const isBorrowed = item.status_peminjaman === "borrowed";

              return (
                <div
                  className="ongoing-table-row"
                  key={item.id_buku_copy + "-" + idx}
                >
                  <div className="bh-col-title">
                    <img
                      src={item.url_foto_cover}
                      alt={item.judul}
                      className="bh-book-cover"
                    />
                    <span className="bh-book-title">{item.judul}</span>
                  </div>

                  <div>{item.penulis}</div>

                  <div>{formatDate(item.tgl_pinjam)}</div>

                  <div className="bh-col-status">
                    <span
                      className={
                        "bh-status-pill " +
                        (isBorrowed
                          ? "bh-status-borrowed"
                          : "bh-status-pending")
                      }
                    >
                      {isBorrowed ? "Borrowed" : "Pending"}
                    </span>
                  </div>

                  <div className="bh-col-actions">
                    <button
                      type="button"
                      onClick={() => handleReturn(item)}
                      disabled={!isBorrowed}
                      className={
                        "bh-action-btn " +
                        (!isBorrowed ? "bh-action-btn-disabled" : "")
                      }
                    >
                      Return
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ACTION BAR – RETURN ALL */}
      <div className="ongoing-actions">
        <button
          type="button"
          onClick={handleReturnAll}
          disabled={!hasBorrowed}
          className={
            "ongoing-return-all-btn " +
            (!hasBorrowed ? "ongoing-return-all-btn-disabled" : "")
          }
        >
          Return All Books
        </button>
      </div>
    </div>
  );
}
