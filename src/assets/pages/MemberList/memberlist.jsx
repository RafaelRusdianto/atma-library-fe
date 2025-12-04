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
    username: "",
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

      const withNumber = list.map((m, idx) => ({
        ...m,
        displayNumber: idx + 1,
      }));

      setMembers(withNumber);
    } catch (error) {
      console.error("Failed to fetch member's data:", error);
      toast.error("Failed to fetch member's data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_member) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/petugas/members/${id_member}`);
      setMembers((prev) => prev.filter((m) => m.id_member !== id_member));

      if (selectedMember && selectedMember.id_member === id_member) {
        setSelectedMember(null);
        setIsEditing(false);
      }

      toast.success("Member deleted successfully!");
    } catch (error) {
      console.error("Failed to delete member's data:", error);
      toast.error("Failed to delete member's data.");
    }
  };

  const handleDetail = (m) => {
    setSelectedMember(m);
    setIsEditing(false);
    setEditForm({
      nama: m.nama ?? "",
      email: m.email ?? "",
      username: m.username ?? "",
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
      username: m.username ?? "",
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
      toast.success("Member's data updated successfully.");
    } catch (error) {
      console.error("Failed to update member's data:", error);

      const backendMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(", "));

      if (backendMsg) {
        toast.error(`Something went wrong when updating data: ${backendMsg}`);
      } else {
        toast.error("Something went wrong when updating data.");
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

      toast.success(`Status set to ${newStatus === "aktif" || newStatus === "active"
        ? "Active"
        : "Inactive"
        }`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status.");
    }
  };

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.nama ?? "").toLowerCase().includes(q) ||
      (m.email ?? "").toLowerCase().includes(q) ||
      String(m.id_member ?? "").toLowerCase().includes(q) // pake id_member asli
    );
  });

  return (
    <div className="member-page">
      <div className="member-header">
        <div>
          <h1 className="member-title">Member List</h1>
          <p className="member-subtitle">Manage library members</p>
        </div>

        <div className="member-search-container">
          <input
            type="text"
            className="member-search-input"
            placeholder="Search by name / email / member number..."
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
                <h2>Member Detail</h2>
                <button
                  className="detail-close-btn"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </button>
              </div>

              <div className="detail-grid">
                <div>
                  <p className="detail-label">Full Name</p>
                  <p className="detail-value">{selectedMember.nama}</p>
                </div>

                <div>
                  <p className="detail-label">Email Address</p>
                  <p className="detail-value">{selectedMember.email}</p>
                </div>

                <div>
                  <p className="detail-label">Username</p>
                  <p className="detail-value">
                    {selectedMember.username || "-"}
                  </p>
                </div>

                <div>
                  <p className="detail-label">Telephone Number</p>
                  <p className="detail-value">
                    {selectedMember.no_telp || "-"}
                  </p>
                </div>

                <div>
                  <p className="detail-label">Address</p>
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
                      username: selectedMember.username ?? "",
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
                  <p className="detail-label">Full Name</p>
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
                  <p className="detail-label">Email Address</p>
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
                  <p className="detail-label">Username</p>
                  <input
                    type="text"
                    className="detail-input"
                    value={editForm.username}
                    onChange={(e) => handleEditChange("username", e.target.value)}
                  />
                </div>

                <div>
                  <p className="detail-label">Telephone Number</p>
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
                  <p className="detail-label">Address</p>
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
                  Cancel
                </button>
                <button type="submit" className="table-btn edit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="member-card">
        {loading ? (
          <p className="loading-text">Loading members...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Username</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, index) => (
                <tr key={m.id_member}>
                  <td>{index + 1}</td>
                  <td>{m.nama}</td>
                  <td>{m.email}</td>
                  <td>{m.username}</td>
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
                    No members found.
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
