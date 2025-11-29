import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "./Cart.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==== FETCH DRAFT CART ====
  const loadCart = async () => {
    try {
      const res = await api.get("/member/cart");
      console.log("CART RESPONSE:", res.data);

      const draftData = res.data.data;

      if (draftData && draftData.detail_peminjaman) {
        setDraft(draftData);
        setCart(draftData.detail_peminjaman); // array detail
      } else {
        setDraft(null);
        setCart([]);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ==== SUBMIT DRAFT ====
  const handleSubmit = async () => {
    if (!draft || cart.length === 0) return;

    const confirm = await Swal.fire({
      title: "Submit Borrow Request?",
      text: "Your draft will be sent to the librarian for approval.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      const res = await api.post("/member/cart/submit");
      console.log("SUBMIT CART RESPONSE:", res.data);

      toast.success("Borrow request submitted!");

      await Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your borrow request is now waiting for approval.",
        timer: 1800,
        showConfirmButton: false,
      });

      // refresh draft
      loadCart();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to submit borrow request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---- helper format tanggal ----
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // contoh: 29 Nov 2025
  };

  const borrowDate = draft ? formatDate(draft.tgl_pinjam) : "-";

  if (loading) {
    return (
      <div className="cart-page-container">
        <h2 className="cart-title">Borrow Draft</h2>
        <div className="bh-table-card">
          <div className="cart-loading">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2 className="cart-title">Borrow Draft</h2>

      <div className="bh-table-card">
        {/* HEADER */}
        <div className="bh-table-header">
          <div>Book Title</div>
          <div>Author</div>
          <div>Borrowed On</div>
          <div>Status</div>
        </div>

        {/* BODY: SCROLL AREA */}
        <div className="cart-table-body">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            cart.map((item) => {
              const buku = item.copy_buku?.buku;

              if (!buku) return null; // jaga-jaga kalau data belum lengkap

              return (
                <div className="bh-table-row" key={item.id_buku_copy}>
                  <div className="bh-col-title">
                    <img
                      src={buku.url_foto_cover}
                      alt={buku.judul}
                      className="bh-book-cover"
                    />
                    <span className="bh-book-title">{buku.judul}</span>
                  </div>

                  <div>{buku.penulis}</div>

                  {/* Borrowed On (sama utk semua item di draft ini) */}
                  <div>{borrowDate}</div>

                  <div className="bh-col-status">
                    <span className="bh-status-pill bh-status-draft">
                      Draft
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON – tetap di bawah card */}
      <div className="cart-actions">
        {cart.length > 0 && (
          <button
            className="cart-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Borrow Request"}
          </button>
        )}
      </div>
    </div>
  );
}
