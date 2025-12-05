import React, { useEffect, useMemo, useState } from "react";
import api from "../../../config/api";
import "./Fines.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function FinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // simpan id_denda yang dipilih (sesuai backend)
  const [selectedDendaIds, setSelectedDendaIds] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

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

  // Id unik untuk key di React (boleh id_denda atau fallback)
  const getFineKey = (fine, idx) => {
    const baseKey = fine.id_denda;
    return `${baseKey}-${idx}`;
  };

  const fetchFines = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("member/denda");
      const groups = Array.isArray(res.data?.data) ? res.data.data : [];

      // Flatten grouped response from backend into simple row list
      const flattened = groups.flatMap((group) =>
        (group.books || []).map((book) => ({
          ...book,
          nomor_pinjam: group.nomor_pinjam,
          tgl_jatuh_tempo: group.tgl_jatuh_tempo,
        }))
      );

      const onlyUnpaid = flattened.filter((item) => {
        const status = (item.status || "").toString().toLowerCase();
        return status === "" || status === "unpaid" || status === "belum";
      });

      setFines(onlyUnpaid);
      setSelectedDendaIds([]); // reset pilihan tiap refresh
      setSelectAllChecked(false);
    } catch (err) {
      console.error("Error loading unpaid fines:", err);
      toast.error(
        err?.response?.data?.message ||
          "Gagal memuat daftar denda yang belum dibayar."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);


  // TOTAL & JUMLAH hanya untuk yang dipilih
  const selectedSummary = useMemo(() => {
    let total = 0;
    let count = 0;

    fines.forEach((fine) => {
      if (!fine.id_denda) return;
      if (selectedDendaIds.includes(fine.id_denda)) {
        count++;
        const nominal = fine.denda_per_buku ;
        const numeric = Number(nominal);
        if (!Number.isNaN(numeric)) {
          total += numeric;
        }
      }
    });

    return { count, total };
  }, [fines, selectedDendaIds]);

  // Toggle checklist satu denda
  const handleToggleFine = (fine) => {
    if (!fine.id_denda) {
      toast.error("ID denda tidak ditemukan.");
      return;
    }

    const id = fine.id_denda;
    setSelectedDendaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    const selectableIds = fines
      .map((f) => f.id_denda)
      .filter((id) => id !== undefined && id !== null);

    if (selectableIds.length === 0) {
      toast.info("Tidak ada denda yang bisa dipilih.");
      return;
    }

    const allSelected = selectableIds.every((id) =>
      selectedDendaIds.includes(id)
    );

    if (allSelected) {
      setSelectedDendaIds([]);
      setSelectAllChecked(false);
    } else {
      setSelectedDendaIds(selectableIds);
      setSelectAllChecked(true);
    }
  };

  
  useEffect(() => {
    const selectableIds = fines
      .map((f) => f.id_denda)
      .filter((id) => id !== undefined && id !== null);

    if (selectableIds.length === 0) {
      if (selectAllChecked) setSelectAllChecked(false);
      return;
    }

    const allSelected = selectableIds.every((id) =>
      selectedDendaIds.includes(id)
    );
    if (allSelected !== selectAllChecked) {
      setSelectAllChecked(allSelected);
    }
  }, [fines, selectedDendaIds, selectAllChecked]);

const handlePaySelected = async () => {
  if (selectedSummary.count === 0) {
    toast.info("Pilih denda yang ingin dibayar terlebih dahulu.");
    return;
  }

  const result = await Swal.fire({
    title: "Choose payment method",
    html: `
      <p style="margin-bottom: 4px; font-size: 14px;">
        You are about to pay <strong>${selectedSummary.count}</strong> fines.
      </p>
      <p style="margin-bottom: 12px; font-size: 14px;">
        Total amount: <strong>${formatCurrency(selectedSummary.total)}</strong>
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
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#9ca3af",
  });

  if (!result.isConfirmed || !result.value) return;

  const metode = result.value; // cash / transfer / qris / ewallet

  try {
    const payload = {
      id_denda: selectedDendaIds,
      metode,
    };

    const res = await api.post("member/denda/bayar", payload);

    toast.success(res.data?.message || "Pembayaran berhasil.");
    await Swal.fire({
      icon: "success",
      title: "Payment Success",
      html: `
        <p style="margin-bottom: 4px; font-size: 14px;">
          Paid <strong>${selectedSummary.count}</strong> fines.
        </p>
        <p style="font-size: 14px;">
          Total: <strong>${formatCurrency(selectedSummary.total)}</strong><br/>
          Method: <strong>${metode}</strong>
        </p>
      `,
      confirmButtonColor: "#2563eb",
    });

    fetchFines();
  } catch (err) {
    console.error("Error paying fines:", err);
    toast.error(
      err?.response?.data?.message || "Pembayaran denda gagal dilakukan."
    );
  }
};

  const getFineDisplay = (fine) => {
    const cover = fine.url_foto_cover;
    const title = fine.judul;
    const author = fine.penulis;
    const copyNumber = fine.id_buku_copy;

    return { cover, title, author, copyNumber };
  };

  const renderSkeletonRows = () =>
    [1, 2, 3].map((i) => (
      <div className="fine-table-row" key={`skeleton-${i}`}>
        <div className="fine-col-select">
          <div className="skeleton skeleton-checkbox" />
        </div>
        <div className="fine-col-title">
          <div className="skeleton skeleton-cover" />
          <div className="fine-book-meta">
            <div className="skeleton skeleton-text-long" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-pill" />
      </div>
    ));

  return (
    <div className="fine-page-container">
        <h2 className="fine-title">Unpaid Fines</h2>

      <div className="fine-table-card">
        <div className="fine-table-header">
          <div className="fine-col-select fine-header-select">
            <input
              type="checkbox"
              checked={selectAllChecked}
              onChange={handleToggleAll}
            />
          </div>
          <div>Book Title</div>
          <div>Borrowed On</div>
          <div>Returned On</div>
          <div>Days Late</div>
          <div>Fine</div>
          <div>Status</div>
        </div>

        <div className="fine-table-body">
          {loading ? (
            renderSkeletonRows()
          ) : fines.length === 0 ? (
            <div className="fine-empty">
              No unpaid fines found.
            </div>
          ) : (
            fines.map((fine, idx) => {
              const amount = fine.denda_per_buku;
              const status = fine.status;
              const daysLate = fine.hari_telat;
              const key = getFineKey(fine, idx);
              const { cover, title, author, copyNumber } = getFineDisplay(fine);
              const checked =
                fine.id_denda && selectedDendaIds.includes(fine.id_denda);

              return (
                <div className="fine-table-row" key={key}>
                  <div className="fine-col-select" data-label="Select">
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => handleToggleFine(fine)}
                    />
                  </div>

                  <div className="fine-col-title" data-label="Book Title">
                    <img
                      src={cover}
                      alt={title}
                      className="fine-book-cover"
                    />
                    <div className="fine-book-meta">
                      <span className="fine-book-title">
                        {title}
                      </span>
                      <span className="fine-book-author">
                        {author}
                      </span>
                      <span className="fine-book-copy">
                        Copy #{copyNumber}
                      </span>
                    </div>
                  </div>

                  <div data-label="Borrowed On">{formatDate(fine.tgl_pinjam)}</div>
                  <div data-label="Returned On">{formatDate(fine.tgl_kembali)}</div>
                  <div data-label="Days Late">{daysLate}</div>
                  <div data-label="Fine">
                    {formatCurrency(amount)}
                  </div>
                  <div className="bh-col-status" data-label="Status">
                    <span className="bh-status-pill fine-status-unpaid">
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tombol di tengah bawah */}
      <div className="fine-footer-actions">
        <button
          type="button"
          className="fine-pay-selected-btn"
          onClick={handlePaySelected}
          disabled={selectedSummary.count === 0}
        >
          Pay Selected Fines
        </button>
      </div>
    </div>
  );
}
