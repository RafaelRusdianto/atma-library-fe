import React, { useState, useEffect } from "react";
import "./ProfileDetail.css";
import api from "../../../config/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useProfileData } from "../ProfileLayout/ProfileLayout"; // ⬅️ cuma ambil context, BUKAN Layout

export default function ProfileDetail() {
  // ambil data dari context yang dibuat di ProfileLayout
  const { profile, setProfile, isFetching, error } = useProfileData();

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
  const { updateUser } = useAuth();


  const navigate = useNavigate();
  const { logout } = useAuth();
  const role = localStorage.getItem("role");

  const idLabel = role === "petugas" ? "Staff ID" : "Member ID";

  // sinkronkan form ketika profile dari context berubah
  useEffect(() => {
    if (!profile) return;
    setFormData({
      nama: profile.nama || "",
      username: profile.username || "",
      id_member: profile.id_member || profile.id_petugas || "",
      email: profile.email || "",
      no_telp: profile.no_telp || "",
      alamat: profile.alamat || "",
    });
  }, [profile]);

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
      id_member: profile.id_member || profile.id_petugas || "",
      email: profile.email || "",
      no_telp: profile.no_telp || "",
      alamat: profile.alamat || "",
    });
  };

  const handleUpdateProfile = async () => {
    const requiredFields = [
      { key: "nama", label: "Nama" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "no_telp", label: "Nomor Telepon" },
      { key: "alamat", label: "Alamat" },
    ];

    for (let field of requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        toast.error(`${field.label} cannot be empty.`);
        return;
      }
    }
    try {
      setIsUpdatingProfile(true);

      const endpoint =
        role === "petugas"
          ? "/petugas/profile/update"
          : "/member/profile/update";

      const payload = {
        nama: formData.nama,
        username: formData.username,
        email: formData.email,
        no_telp: formData.no_telp,
        alamat: formData.alamat,
      };

      const res = await api.post(endpoint, payload);
      console.log("UPDATE PROFILE RESPONSE:", res.data);

      const updatedData = res.data.data;
      setProfile(updatedData); // update context → profileLayout & profileDetail ikut berubah
      updateUser(updatedData);
      toast.success("Changes saved to profile.");
    } catch (err) {
      console.error("Error updating profile:", err);

      const errors = err?.response?.data?.errors;

      if (errors) {
        if (errors.email && errors.email.length > 0) {
          toast.error(errors.email[0]);
          return;
        }

        if (errors.username && errors.username.length > 0) {
          toast.error(errors.username[0]);
          return;
        }
      }

      // Fallback
      const msg =
        err?.response?.data?.message ||
        "Failed to update profile. Please try again.";

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
      toast.error("Fill all password.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password does not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
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

      toast.success("Password changed successfully.");
      resetPasswordForm();
    } catch (err) {
      console.error("Error changing password:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to change password. Please try again.";
      toast.error(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // === DELETE ACCOUNT ===
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete account?",
      text: "This action cannot be undone. Are you sure you want to continue?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      setIsDeleting(true);

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
        title: "Account Deleted",
        text: "Your account has been successfully removed. You will be redirected shortly.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/");
    } catch (err) {
      console.error("Error deleting profile:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to delete your account. Please try again.";

      toast.error(msg);

      await Swal.fire({
        title: "Deletion Failed",
        text: msg,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };


  // ===== RENDER =====
  if (isFetching)
    return (
      <div className="settings-page">
        <p>Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="settings-page">
        <p>{error}</p>
      </div>
    );

  if (!profile) return null;

  return (
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
            <label>{idLabel}</label>
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
      <h2 className="settings-title">Security</h2>
      <section className="settings-section-card">
        <h3 className="settings-section-heading">Change Password</h3>

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
  );
}
