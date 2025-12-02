import React, { useEffect, useState } from "react";
import "./MemberList.css";
import api from "../../../config/api";
import { toast } from "react-toastify";

function MemberList() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: "",
    email: "",
    nomor_member: "",
    no_telp: "",
    alamat: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/petugas/members");
      const list = res.data.data ?? res.data;

      // nomor member urut 1,2,3,...
      const withNumber = list.map((m, idx) => ({
        ...m,
        nomor_member: idx + 1,
      }));

      setMembers(withNumber);
    } catch (error) {
      console.error("Gagal mengambil data members:", error);
      toast.error("Gagal mengambil data member.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_member) => {
    if (!confirm("Yakin ingin menghapus member ini?")) return;

    try {
      await api.delete(`/petugas/members/${id_member}`);
      setMembers((prev) => prev.filter((m) => m.id_member !== id_member));

      if (selectedMember && selectedMember.id_member === id_member) {
        setSelectedMember(null);
        setIsEditing(false);
      }

      toast.success("Member berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus member:", error);
      toast.error("Gagal menghapus member.");
    }
  };

  const handleDetail = (m) => {
    setSelectedMember(m);
    setIsEditing(false);
    setEditForm({
      nama: m.nama ?? "",
      email: m.email ?? "",
      nomor_member: m.nomor_member ?? "",
      no_telp: m.no_telp ?? "",
      alamat: m.alamat ?? "",
    });
  };

  const handleEditClick = (m) => {
    setSelectedMember(m);
    setIsEditing(true);
    setEditForm({
      nama: m.nama ?? "",
      email: m.email ?? "",
      nomor_member: m.nomor_member ?? "",
      no_telp: m.no_telp ?? "",
      alamat: m.alamat ?? "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await api.put(`/petugas/members/${selectedMember.id_member}`, editForm);

      setMembers((prev) =>
        prev.map((m) =>
          m.id_member === selectedMember.id_member ? { ...m, ...editForm } : m
        )
      );

      setSelectedMember((prev) => (prev ? { ...prev, ...editForm } : prev));
      setIsEditing(false);
      toast.success("Data member berhasil diperbarui.");
    } catch (error) {
      console.error("Gagal mengupdate member:", error);

      const backendMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(", "));

      if (backendMsg) {
        toast.error(`Terjadi kesalahan: ${backendMsg}`);
      } else {
        toast.error("Terjadi kesalahan saat mengupdate member.");
      }
    }
  };

  // toggle status: dipakai HANYA di detail card
  const handleToggleStatus = async (id_member) => {
    try {
      const res = await api.put(
        `/petugas/members/${id_member}/toggle-status`
      );

      const newStatus = res.data.data?.status;

      setMembers((prev) =>
        prev.map((m) =>
          m.id_member === id_member ? { ...m, status: newStatus } : m
        )
      );

      if (selectedMember && selectedMember.id_member === id_member) {
        setSelectedMember((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );
      }

      toast.success("Status member berhasil diubah.");
    } catch (error) {
      console.error("Gagal mengubah status member:", error);
      toast.error("Gagal mengubah status member.");
    }
  };

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.nama ?? "").toLowerCase().includes(q) ||
      (m.email ?? "").toLowerCase().includes(q) ||
      (m.nomor_member ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="member-page">
      <div className="member-header">
        <div>
          <h1 className="member-title">Member List</h1>
          <p className="member-subtitle">Kelola data anggota perpustakaan</p>
        </div>

        <div className="member-header-actions">
          <input
            type="text"
            className="member-search-input"
            placeholder="Cari nama / email / nomor member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {selectedMember && (
        <div className="member-detail-card">
          {!isEditing ? (
            <>
              <div className="detail-header">
                <h2>Detail Member</h2>
                <button
                  className="detail-close-btn"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </button>
              </div>

              <div className="detail-grid">
                <div>
                  <p className="detail-label">Nama Lengkap</p>
                  <p className="detail-value">{selectedMember.nama}</p>
                </div>

                <div>
                  <p className="detail-label">Email</p>
                  <p className="detail-value">{selectedMember.email}</p>
                </div>

                <div>
                  <p className="detail-label">Nomor Member</p>
                  <p className="detail-value">
                    {selectedMember.nomor_member || "-"}
                  </p>
                </div>

                <div>
                  <p className="detail-label">No. Telp</p>
                  <p className="detail-value">
                    {selectedMember.no_telp || "-"}
                  </p>
                </div>

                <div>
                  <p className="detail-label">Alamat</p>
                  <p className="detail-value">
                    {selectedMember.alamat || "-"}
                  </p>
                </div>

                <div>
                  <p className="detail-label">Status</p>
                  <p className="detail-value">
                    {selectedMember.status || "-"}
                  </p>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  className="table-btn edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit di sini
                </button>
                <button
                  className={
                    "table-btn status-toggle-btn " +
                    (selectedMember.status === "aktif"
                      ? "status-toggle-btn--aktif"
                      : "status-toggle-btn--nonaktif")
                  }
                  onClick={() => handleToggleStatus(selectedMember.id_member)}
                >
                  {selectedMember.status === "aktif"
                    ? "Nonaktifkan"
                    : "Aktifkan"}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleEditSubmit}>
              <div className="detail-header">
                <h2>Edit Member</h2>
                <button
                  type="button"
                  className="detail-close-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      nama: selectedMember.nama ?? "",
                      email: selectedMember.email ?? "",
                      nomor_member: selectedMember.nomor_member ?? "",
                      no_telp: selectedMember.no_telp ?? "",
                      alamat: selectedMember.alamat ?? "",
                    });
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="detail-grid">
                <div>
                  <p className="detail-label">Nama Lengkap</p>
                  <input
                    type="text"
                    className="detail-input"
                    value={editForm.nama}
                    onChange={(e) =>
                      handleEditChange("nama", e.target.value)
                    }
                  />
                </div>

                <div>
                  <p className="detail-label">Email</p>
                  <input
                    type="email"
                    className="detail-input"
                    value={editForm.email}
                    onChange={(e) =>
                      handleEditChange("email", e.target.value)
                    }
                  />
                </div>

                <div>
                  <p className="detail-label">Nomor Member</p>
                  <input
                    type="text"
                    className="detail-input"
                    value={editForm.nomor_member}
                    onChange={(e) =>
                      handleEditChange("nomor_member", e.target.value)
                    }
                  />
                </div>

                <div>
                  <p className="detail-label">No. Telp</p>
                  <input
                    type="text"
                    className="detail-input"
                    value={editForm.no_telp}
                    onChange={(e) =>
                      handleEditChange("no_telp", e.target.value)
                    }
                  />
                </div>

                <div>
                  <p className="detail-label">Alamat</p>
                  <input
                    type="text"
                    className="detail-input"
                    value={editForm.alamat}
                    onChange={(e) =>
                      handleEditChange("alamat", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className="table-btn detail-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </button>
                <button type="submit" className="table-btn edit-btn">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="member-card">
        {loading ? (
          <p className="loading-text">Loading data members...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Nomor Member</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, index) => (
                <tr key={m.id_member}>
                  <td>{index + 1}</td>
                  <td>{m.nama}</td>
                  <td>{m.email}</td>
                  <td>{m.nomor_member}</td>
                  <td>{m.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="table-btn detail-btn"
                        onClick={() => handleDetail(m)}
                      >
                        Detail
                      </button>
                      <button
                        className="table-btn edit-btn"
                        onClick={() => handleEditClick(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="table-btn delete-btn"
                        onClick={() => handleDelete(m.id_member)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-text">
                    Tidak ada data member.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MemberList;
