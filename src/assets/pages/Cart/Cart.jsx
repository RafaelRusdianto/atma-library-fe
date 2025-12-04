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

  const loadCart = async () => {
    try {
      const res = await api.get("/member/cart");
      console.log("CART RESPONSE:", res.data);

      const draftData = res.data.data;

      if (draftData && draftData.detail_peminjaman) {
        setDraft(draftData);
        setCart(draftData.detail_peminjaman);
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

      const res = await api.post("/member/detailPeminjaman/submit");
      console.log("SUBMIT CART RESPONSE:", res.data);

      // toast.success("Borrow request submitted!");

      await Swal.fire({
        icon: "success",
        title: "Request Sent",
        text: "Your borrow request is now waiting for approval.",
        timer: 1800,
        showConfirmButton: false,
      });

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const borrowDate = draft ? formatDate(draft.tgl_pinjam) : "-";
  // Enable submit when there is at least one item in cart
  const hasPending = cart.length > 0;

  if (loading) {
    return (
      <div className="cart-page-container">
        <h2 className="cart-title">Borrow Cart</h2>

        <div className="bh-table-card cart-table-card">
          <div className="cart-table-header">
            <div>Book Title</div>
            <div>Author</div>
            <div>Borrowed On</div>
          </div>

          {/* Skeleton rows */}
          <div className="cart-table-body">
            {[1, 2, 3].map((i) => (
              <div className="cart-table-row" key={i}>
                <div className="bh-col-title">
                  <div className="skeleton skeleton-cover" />
                  <div className="skeleton skeleton-text-long" />
                </div>
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" />
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
      <h2 className="cart-title">Borrow Cart</h2>

      <div className="bh-table-card cart-table-card">
        {/* HEADER */}
        <div className="cart-table-header">
          <div>Book Title</div>
          <div>Author</div>
          <div>Borrowed On</div>
        </div>

        {/* BODY: SCROLL AREA */}
        <div className="cart-table-body">
          {cart.length === 0 ? (
            <div className="cart-empty">Your cart is empty.</div>
          ) : (
            cart.map((item) => {
              const buku = item.copy_buku?.buku;
              if (!buku) return null;

              return (
                <div className="cart-table-row" key={item.id_buku_copy}>
                  <div className="bh-col-title">
                    <img
                      src={buku.url_foto_cover}
                      alt={buku.judul}
                      className="bh-book-cover"
                    />
                    <span className="bh-book-title">{buku.judul}</span>
                  </div>

                  <div>{buku.penulis}</div>
                  <div>{borrowDate}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="cart-actions">
        <button
          className={
            "cart-submit-btn" +
            (!hasPending || submitting ? " cart-submit-btn-disabled" : "")
          }
          onClick={handleSubmit}
          disabled={!hasPending || submitting}
        >
          {submitting ? "Submitting..." : "Submit Borrow Request"}
        </button>
      </div>
    </div>
  );
}
