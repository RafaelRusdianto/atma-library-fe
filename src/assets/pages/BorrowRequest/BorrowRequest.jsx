import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";
import "./BorrowRequest.css";
import Swal from "sweetalert2";

export default function BorrowRequestPage() {
  const [loans, setLoans] = useState([]);       
  const [loading, setLoading] = useState(true);
  const [processingKey, setProcessingKey] = useState(null);
  const defaultProfile = "/icons/blank-pfp.png";

  // normalize media URL from backend (absolute or storage-relative)
  const buildMediaUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const cleaned = `storage/${path}`;
    return `${base}/${cleaned}`;
  };

  // helper: group rows per nomor_pinjam
  const groupByLoan = (rows) => {
    const map = {};

    rows.forEach((row) => {
      const rawProfile = row.url_foto_profil;
      const normalizedProfile = buildMediaUrl(rawProfile);

      if (!map[row.nomor_pinjam]) {
        map[row.nomor_pinjam] = {
          nomor_pinjam: row.nomor_pinjam,
          tgl_pinjam: row.tgl_pinjam,
          member_profile: normalizedProfile,
          member_name: row.nama,
          member_id: row.id_member,
          details: [],
        };
      }

      map[row.nomor_pinjam].details.push({
        id_buku_copy: row.id_buku_copy,
        judul: row.judul,
        penulis: row.penulis,
        url_foto_cover: row.url_foto_cover,
      });
    });

    return Object.values(map);
  };

  // load semua request pending
  const loadRequests = async () => {
    try {
      const res = await api.get("/petugas/pendingRequests");
      console.log("BORROW REQUEST RESPONSE:", res.data);

      const data = res.data.data || [];
      const grouped = groupByLoan(data);
      setLoans(grouped);
    } catch (err) {
      toast.error("Failed to load borrow requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
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

  // Approve satu PEMINJAMAN (semua detail di dalamnya)
  const handleApproveLoan = async (loan) => {
    const confirm = await Swal.fire({
      title: "Approve this borrowing?",
      text: `Approve all books in loan #${loan.nomor_pinjam} for ${loan.member_name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#163ca3ff",
    });

    if (!confirm.isConfirmed) return;

    try {
      const key = `loan-${loan.nomor_pinjam}`;
      setProcessingKey(key);

      const res = await api.put(
            `/petugas/peminjaman/${loan.nomor_pinjam}/update`,{status: "approved"}
          );

      console.log("APPROVE LOAN RESPONSE:", res.data);
      toast.success(`Loan #${loan.nomor_pinjam} approved.`);

      await Swal.fire({
        icon: "success",
        title: "Approved",
        text: "The borrow request has been approved.",
        timer: 1500,
        showConfirmButton: false,
      });

      loadRequests();
    } catch (err) {
      console.error("Approve loan error:", err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to approve this loan. Please try again."
      );
    } finally {
      setProcessingKey(null);
    }
  };

  const handleRejectLoan = async (loan) => {
    const confirm = await Swal.fire({
      title: "Reject this borrowing?",
      text: `Reject all books in loan #${loan.nomor_pinjam} for ${loan.member_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      const key = `loan-${loan.nomor_pinjam}`;
      setProcessingKey(key);

      const res = await api.put(
        `/petugas/peminjaman/${loan.nomor_pinjam}/update`,
        {
          status: "rejected",
        }
      );

      console.log("REJECT LOAN RESPONSE:", res.data);
      toast.info(`Loan #${loan.nomor_pinjam} rejected.`);

      await Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "The borrow request has been rejected.",
        timer: 1500,
        showConfirmButton: false,
      });

      loadRequests();
    } catch (err) {
      console.error("Reject loan error:", err);
      toast.error(
        err?.response?.data?.message ||
        "Failed to reject this loan. Please try again."
      );
    } finally {
      setProcessingKey(null);
    }
  };

  // Approve semua peminjaman pending
  const handleApproveAll = async () => {
    if (loans.length === 0) {
      toast.info("There are no pending requests to approve.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Approve all requests?",
      text: "All pending borrow requests will be approved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2533cfff",
    });

    if (!confirm.isConfirmed) return;

    try {
      setProcessingKey("ALL");
      const payload = {
        status: "approved",
        nomor_pinjam: loans.map(l => l.nomor_pinjam), 
      };
      const res = await api.put("/petugas/peminjaman/approve/all", payload);
      console.log("APPROVE ALL RESPONSE:", res.data);

      await Swal.fire({ icon: "success", title: "All Approved", text: "All pending borrow requests have been approved.", timer: 1600, showConfirmButton: false });
      loadRequests();
    } catch (err) {
      console.error("Approve-all error:", err);
      toast.error(err?.response?.data?.message || "Failed to approve all requests. Please try again.");
    } finally {
      setProcessingKey(null);
    }
  };

  // reject semua peminjaman yang pending
  const handleRejectAll = async () => {
    if (loans.length === 0) {
      toast.info("There are no pending requests to reject.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Reject all requests?",
      text: "All pending borrow requests will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {

      setProcessingKey("ALL-REJECT");
      const payload = {
        status: "rejected",
        nomor_pinjam: loans.map(l => l.nomor_pinjam), 
      };

      const res = await api.put("/petugas/peminjaman/approve/all", payload);
      console.log("REJECT ALL RESPONSE:", res.data);

      await Swal.fire({
        icon: "success",
        title: "All Rejected",
        text: "All pending borrow requests have been rejected.",
        timer: 1600,
        showConfirmButton: false
      });

      loadRequests();

    } catch (err) {
      console.error("Reject-all error:", err);
      toast.error(err?.response?.data?.message || "Failed to reject all requests. Please try again.");
    } finally {
      setProcessingKey(null);
    }
  };


  // skeleton loading screen
  if (loading) {
    return (
      <div className="request-page-container">
        <div className="request-header">
          <h2 className="request-title">Borrow Requests</h2>
          <p className="request-subtitle">Manage incoming book loan requests: approve or decline requests from users.</p>
        </div>

        <div className="request-cards">

          {[1, 2].map((i) => (
            <div className="request-card skeleton-request-cards " key={i}>
              <div className="skeleton skeleton-text-long" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="request-card-books">

                {[1, 2].map((j) => (
                  <div className="request-book-item" key={j}>
                    <div className="skeleton skeleton-cover" />
                    <div className="request-book-info">
                      <div className="skeleton skeleton-text-long" />
                      <div className="skeleton skeleton-text" />
                    </div>
                  </div>
                ))}
                
              </div>
              <div className="request-card-actions">
                <div className="skeleton skeleton-pill" />
                <div className="skeleton skeleton-pill" />
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

 
  return (
    <div className="request-page-container">

      <div className="request-header">
        <h2 className="request-title">Borrow Requests</h2>
        <p className="request-subtitle">Manage incoming book loan requests: approve or decline requests from users.</p>
      </div>

      <div className="request-shell">
        <div className="request-shell-body">

          {/* card list peminjaman*/}
          {loans.length === 0 ? (
            
            <div className="request-empty">
              There are no pending borrow requests.
            </div>

          ) : (

            <div className="request-cards">
              {loans.map((loan) => {
                const key = `loan-${loan.nomor_pinjam}`;
                const isProcessing = processingKey === key;

                return (
                  <div className="request-card" key={key}>

                    {/* header loan */}
                    <div className="request-card-header">
                      <div>

                        <div className="request-loan-id">
                          Loan #{loan.nomor_pinjam}
                        </div>

                        <div className="request-loan-date">
                          Borrowed on {formatDate(loan.tgl_pinjam)}
                        </div>

                      </div>

                      <div className="request-card-member">

                        <img
                          src={loan.member_profile}
                          alt={loan.member_name}
                          className="request-member-avatar"
                        />

                        <div className="request-member-info">
                        
                          <span className="request-member-name">
                            {loan.member_name}
                          </span>

                          <span className="request-member-id">
                            ID:{loan.member_id}
                          </span>

                        </div>

                      </div>
                    </div>

                    {/* list buku di peminjaman ini */}
                    <div className="request-card-books">

                      {loan.details.map((book) => (
                        <div
                          className="request-book-item"
                          key={book.id_buku_copy}
                        >

                          <img
                            src={book.url_foto_cover}
                            alt={book.judul}
                            className="request-book-cover"
                          />

                          <div className="request-book-info">

                            <span className="request-book-title">
                              {book.judul}
                            </span>
                            <span className="request-book-author">
                              {book.penulis}
                            </span>
                           
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* tombol action per loan */}
                    <div className="request-card-actions">

                      <button
                        type="button"
                        onClick={() => handleApproveLoan(loan)}
                        disabled={isProcessing}
                        className="request-btn request-btn-approve"
                      >
                        {isProcessing ? "Processing..." : "Approve Loan"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRejectLoan(loan)}
                        disabled={isProcessing}
                        className="request-btn request-btn-reject"
                      >
                        {isProcessing ? "Processing..." : "Reject Loan"}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* tombol action all loan */}
      <div className="request-actions request-actions-bo">

        <button
          type="button"
          onClick={handleApproveAll}
          disabled={loans.length === 0 || processingKey === "ALL"}
          className={
            "request-approve-all-btn " +
            (loans.length === 0 || processingKey === "ALL"  ? "request-approve-all-btn-disabled" : "")
          }
        >
          {processingKey === "ALL" ? "Approving..." : "Approve All"}
        </button>

        <button
          type="button"
          onClick={handleRejectAll}
          disabled={loans.length === 0 || processingKey === "ALL-REJECT"}
          className={
            "request-approve-all-btn request-reject-all-btn " +
            (loans.length === 0 || processingKey === "ALL-REJECT" ? "request-approve-all-btn-disabled" : "")
          }
        >
          {processingKey === "ALL-REJECT" ? "Rejecting..." : "Reject All"}
        </button>

      </div>

    </div>
  );
}
