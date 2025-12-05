import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "./OnGoing.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function OnGoingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // --- helper: bayar 1 denda sekarang di halaman ini ---
  const payFineNow = async (fineId, fineAmount) => {
    // pilih metode bayar
    const choose = await Swal.fire({
      title: "Choose payment method",
      html: `
        <p style="margin-bottom: 4px; font-size: 14px;">
          You are about to pay a fine of <strong>${fineAmount.toLocaleString(
        "id-ID"
      )}</strong>.
        </p>
      `,
      input: "select",
      inputOptions: {
        cash: "Cash (pay at desk)",
        transfer: "Bank Transfer",
        qris: "QRIS",
        ewallet: "E-Wallet",
      },
      inputPlaceholder: "Select method",
      showCancelButton: true,
      confirmButtonText: "Pay",
      cancelButtonText: "Cancel",
    });

    if (!choose.isConfirmed || !choose.value) {
      return;
    }

    const metode = choose.value; // cash / transfer / qris / ewallet

    try {
      const payload = {
        id_denda: [fineId], // bayar 1 denda saja
        metode,
      };

      const res = await api.post("/member/denda/bayar", payload);

      toast.success(res.data?.message || "Fine payment success.");
      await Swal.fire({
        icon: "success",
        title: "Payment Success",
        html: `
          <p style="font-size: 14px;">
            Fine <strong>Rp${fineAmount.toLocaleString(
          "id-ID"
        )}</strong> has been paid.<br/>
            Method: <strong>${metode}</strong>
          </p>
        `,
      });

      // reload ongoing & fines nanti akan otomatis kosong untuk denda ini
      loadOnGoing();
    } catch (err) {
      console.error("Error paying fine:", err);
      toast.error(
        err?.response?.data?.message || "Failed to pay the fine. Please try again."
      );
    }
  };

  // --- kembaliin 1 buku - CEK DENDA & PILIH BAYAR SEKARANG / NANTI ---
  const handleReturn = async (item) => {
    if (item.status_detail !== "borrowed") return;

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
      const { is_late, fine_amount, fine_id } = res.data.data || {};

      // kalau ada denda
      if (is_late && fine_amount > 0 && fine_id) {
        const payChoice = await Swal.fire({
          icon: "warning",
          title: "Book Returned with Fine",
          html: `
            <p style="margin-bottom: 6px; font-size: 14px;">
              The book <strong>"${item.judul}"</strong> has been returned.
            </p>
            <p style="margin-bottom: 6px; font-size: 14px;">
              There is a late fine of <strong>Rp${fine_amount.toLocaleString(
            "id-ID"
          )}</strong>.
            </p>
            <p style="font-size: 13px; color:#4b5563;">
              You can pay it now or later on the <strong>Fines</strong> page.
            </p>
          `,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "Pay Now",
          denyButtonText: "Pay Later",
          confirmButtonColor: "#16a34a",
          denyButtonColor: "#2563eb",
        });

        if (payChoice.isConfirmed) {
          // BAYAR SEKARANG di halaman ini
          await payFineNow(fine_id, fine_amount);
        } else if (payChoice.isDenied) {
          // BAYAR NANTI → denda akan muncul di halaman Fines
          await Swal.fire({
            icon: "info",
            title: "Fine Recorded",
            html: `
              <p style="margin-bottom: 4px; font-size: 14px;">
                The fine has been recorded as <strong>unpaid</strong>.
              </p>
              <p style="font-size: 13px;">
                You can pay it later from the <strong>Fines</strong> menu.
              </p>
            `,
            timer: 2200,
            showConfirmButton: false,
          });
        }
      } else {
        // tidak ada denda
        await Swal.fire({
          icon: "success",
          title: "Book Returned",
          text: "The book has been successfully returned.",
          timer: 1700,
          showConfirmButton: false,
        });
      }

      loadOnGoing();
    } catch (err) {
      console.error("Return error:", err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to return this book. Please try again."
      );
    }
  };

  // kembaliin semua buku (tanpa logika denda di sini dulu)
  const handleReturnAll = async () => {
    const hasBorrowed = rows.some((r) => r.status_detail === "borrowed");
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

  const hasBorrowed = rows.some((r) => r.status_detail === "borrowed");

  // loading state
  if (loading) {
    return (
      <div className="cart-page-container">
        <h2 className="cart-title">On-going</h2>

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
      <h2 className="cart-title">On-going</h2>

      <div className="bh-table-card ongoing-table-card">
        <div className="ongoing-table-header">
          <div>Book Title</div>
          <div>Author</div>
          <div>Borrowed On</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        <div className="ongoing-table-body">
          {rows.length === 0 ? (
            <div className="cart-empty">You have no on-going borrowings.</div>
          ) : (
            rows.map((item, idx) => {
              const isBorrowed = item.status_detail === "borrowed";

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
