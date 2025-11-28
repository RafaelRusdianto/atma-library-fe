import React, { useState, useEffect } from "react";
import ProfileLayout from "../ProfileLayout/ProfileLayout";
import "./ProfileDetail.css";
import api from "../../../config/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileDetail() {
  const [profile, setProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    id_member: "",
    email: "",
    no_telp: "",
    alamat: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  // === FETCH PROFILE ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const role = localStorage.getItem("role");
        const endpoint =
          role === "petugas" ? "/petugas/profile" : "/member/profile";

        const res = await api.get(endpoint);
        console.log("PROFILE RESPONSE:", res.data);

        const data = res.data.data;
        setProfile(data);
        setFormData({
          nama: data.nama || "",
          username: data.username || "",
          id_member: data.id_member || "",
          email: data.email || "",
          no_telp: data.no_telp || "",
          alamat: data.alamat || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal memuat data profile.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // === HANDLER ACCOUNT FORM ===
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetAccountForm = () => {
    if (!profile) return;
    setFormData({
      nama: profile.nama || "",
      username: profile.username || "",
      id_member: profile.id_member || "",
      email: profile.email || "",
      no_telp: profile.no_telp || "",
      alamat: profile.alamat || "",
    });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);

      const role = localStorage.getItem("role");
      // SESUAIKAN endpoint update di backend-mu
      const endpoint =
        role === "petugas" ? "/petugas/profile/update" : "/member/profile/update";

      const payload = {
        nama: formData.nama,
        username: formData.username,
        email: formData.email,
        no_telp: formData.no_telp,
        alamat: formData.alamat,
        // biasanya id_member tidak diubah, jadi tidak dikirim pun tidak apa-apa
      };

      const res = await api.post(endpoint, payload);
      console.log("UPDATE PROFILE RESPONSE:", res.data);

      // Update state lokal
      const updatedData = res.data.data || { ...profile, ...payload };
      setProfile(updatedData);
      toast.success("Profil berhasil diperbarui.");
    } catch (err) {
      console.error("Error updating profile:", err);
      const msg =
        err?.response?.data?.message ||
        "Gagal memperbarui profil. Silakan coba lagi.";
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // === HANDLER PASSWORD FORM ===
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Isi semua field password.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const role = localStorage.getItem("role");
      // SESUAIKAN endpoint dengan backend-mu
      const endpoint =
        role === "petugas"
          ? "/petugas/changePassword"
          : "/member/changePassword";

      const payload = {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      };

      const res = await api.post(endpoint, payload);
      console.log("CHANGE PASSWORD RESPONSE:", res.data);

      toast.success("Password berhasil diubah.");
      resetPasswordForm();
    } catch (err) {
      console.error("Error changing password:", err);
      const msg =
        err?.response?.data?.message ||
        "Gagal mengubah password. Silakan coba lagi.";
      toast.error(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };


  // === DELETE ACCOUNT ===
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Hapus akun?",
      text: "Tindakan ini tidak dapat dibatalkan. Anda yakin ingin melanjutkan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);

      const role = localStorage.getItem("role");
      const endpoint =
        role === "petugas"
          ? "/petugas/profile/delete"
          : "/member/profile/delete";

      const res = await api.delete(endpoint);
      console.log("DELETE RESPONSE:", res.data);

      logout();
      window.dispatchEvent(new Event("storageUpdate"));

      toast.success("Account deleted!");

      await Swal.fire({
        title: "Akun terhapus",
        text: "Akun Anda berhasil dihapus. Anda akan diarahkan ke halaman utama.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/");
    } catch (err) {
      console.error("Error deleting profile:", err);
      const msg =
        err?.response?.data?.message ||
        "Gagal menghapus akun. Silakan coba lagi.";
      toast.error(msg);

      await Swal.fire({
        title: "Gagal menghapus akun",
        text: msg,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // === RENDER ===
  if (isFetching)
    return (
      <ProfileLayout>
        <p>Loading profile...</p>
      </ProfileLayout>
    );

  if (error)
    return (
      <ProfileLayout>
        <p>{error}</p>
      </ProfileLayout>
    );

  if (!profile) return null;

  return (
    <ProfileLayout profile={profile}>
      <div className="settings-page">
        <h2 className="settings-title">Settings</h2>

        {/* ACCOUNT DETAILS */}
        <section className="settings-section-card">
          <h3 className="settings-section-heading">Account Details</h3>

          <div className="settings-grid-2col">
            <div className="settings-field">
              <label>Full Name</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleAccountChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="settings-field">
              <label>Member ID</label>
              <input
                type="text"
                name="id_member"
                value={formData.id_member}
                disabled
              />
            </div>

            <div className="settings-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleAccountChange}
                placeholder="Enter username"
              />
            </div>

            <div className="settings-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleAccountChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="settings-field">
              <label>Telepon Number</label>
              <input
                type="text"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleAccountChange}
                placeholder="Enter your phone number"
              />
            </div>

            

            <div className="settings-field">
              <label>Address</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleAccountChange}
                placeholder="Enter your address"
              />
            </div>
          </div>

          

          <div className="settings-actions">
            <button
            type="button"
            className="settings-delete-account"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting account..." : "Delete account"}
          </button>

            <button
              type="button"
              className="settings-btn secondary"
              onClick={resetAccountForm}
              disabled={isUpdatingProfile}
            >
              Cancel
            </button>
            <button
              type="button"
              className="settings-btn primary"
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Saving..." : "Save"}
            </button>


             
          </div>
        </section>

        {/* SECURITY */}
        <section className="settings-section-card">
          <h3 className="settings-section-heading">Security</h3>

          <h4 className="settings-subheading">Change Password</h4>

          <div className="settings-grid-2col">
            <div className="settings-field">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
              />
            </div>

            <div className="settings-field" />

            <div className="settings-field">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
              />
            </div>

            <div className="settings-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat your new password"
              />
            </div>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="settings-btn secondary"
              onClick={resetPasswordForm}
              disabled={isUpdatingPassword}
            >
              Cancel
            </button>
            <button
              type="button"
              className="settings-btn primary"
              onClick={handleChangePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? "Saving..." : "Save"}
            </button>
          </div>

          

         
        </section>
      </div>
    </ProfileLayout>
  );
}
