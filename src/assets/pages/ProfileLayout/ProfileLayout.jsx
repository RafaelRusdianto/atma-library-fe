// src/pages/Profile/ProfileLayout/ProfileLayout.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api";

import {
  User2,
  History,
  CreditCard,
  LogOut,
} from "lucide-react";
import "./ProfileLayout.css";

// ===== CONTEXT utk data profile =====
const ProfileContext = createContext(null);
export const useProfileData = () => useContext(ProfileContext);

export default function ProfileLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  // === FETCH PROFILE SEKALI DI SINI ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const role = localStorage.getItem("role");
        const endpoint =
          role === "petugas" ? "/petugas/profile" : "/member/profile";

        const res = await api.get(endpoint);
        console.log("PROFILE RESPONSE (Layout):", res.data);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal memuat data profile.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const isActive = (path) => location.pathname === path;

  // bisa dikasih skeleton / pesan error di sini
  if (isFetching) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <main className="profile-main">
            <p>Loading profile...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <main className="profile-main">
            <p>{error || "Profile tidak ditemukan."}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, isFetching, error }}
    >
      <div className="profile-page">
        <div className="profile-content">
          {/* ==== SIDEBAR ==== */}
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <img
                src={profile?.url_foto_profil || "/icons/blank-pfp.png"}
                className="profile-avatar-large"
                alt="Profile Avatar"
              />
              <div className="profile-user-info">
                <h3>{profile?.nama || "User"}</h3>
                <p>
                  {profile?.id_member ??
                    profile?.id_petugas ??
                    "-"}
                </p>
              </div>
            </div>

            <div className="profile-menu-list">
              <button
                className={`profile-menu-item ${
                  isActive("/profile") ? "profile-menu-active" : ""
                }`}
                onClick={() => navigate("/profile")}
              >
                <span className="profile-menu-icon">
                  <User2 size={25} />
                </span>
                Profile Details
              </button>

              <button
                className={`profile-menu-item ${
                  isActive("/profile/borrow-history")
                    ? "profile-menu-active"
                    : ""
                }`}
                onClick={() => navigate("/profile/borrow-history")}
              >
                <span className="profile-menu-icon">
                  <History size={25} />
                </span>
                Borrowing History
              </button>

              <button
                className={`profile-menu-item ${
                  isActive("/profile/fine-history")
                    ? "profile-menu-active"
                    : ""
                }`}
                onClick={() => navigate("/profile/fine-history")}
              >
                <span className="profile-menu-icon">
                  <CreditCard size={25} />
                </span>
                Fine History
              </button>
            </div>

            <button
              className="profile-logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <span className="profile-menu-icon logout-icon">
                <LogOut size={18} />
              </span>
              Log Out
            </button>
          </aside>

          {/* ==== MAIN CONTENT ==== */}
          <main className="profile-main">{children}</main>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
