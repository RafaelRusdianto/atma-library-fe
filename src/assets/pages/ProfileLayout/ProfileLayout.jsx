import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { User2, History, CreditCard, LogOut, Camera } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/api";
import "./ProfileLayout.css";
import Swal from "sweetalert2";  

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";


const ProfileContext = createContext(null);
export const useProfileData = () => useContext(ProfileContext);

export default function ProfileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, updateUser, role  } = useAuth();
  const isMember = role === "member";

  const [profile, setProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
  }, [role]);

  // Blokir akses menu member jika role petugas
  useEffect(() => {
    if (!isMember) {
      const restricted =
        location.pathname.includes("/profile/borrowing-history") ||
        location.pathname.includes("/profile/fine-history");
      if (restricted) {
        navigate("/profile", { replace: true });
      }
    }
  }, [isMember, location.pathname, navigate]);

  // Blokir akses menu member jika role adalah petugas
  useEffect(() => {
    if (!isMember) {
      const restricted =
        location.pathname.includes("/profile/borrowing-history") ||
        location.pathname.includes("/profile/fine-history");
      if (restricted) {
        navigate("/profile", { replace: true });
      }
    }
  }, [isMember, location.pathname, navigate]);

  const isActive = (path) => location.pathname === path;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const endpoint =
      role === "petugas"
        ? "/petugas/profile/update"
        : "/member/profile/update";

    const formData = new FormData();
    formData.append("url_foto_profil", file); // <-- nama field backend
 

    try {
      const res = await api.post(endpoint, formData);
      console.log("Foto profil berhasil diupdate:", res.data);
      setProfile(res.data.data);
      updateUser(res.data.data);
    } catch (err) {
      console.error("Gagal update foto profil:", err);
      console.log("Server error:", err.response?.data);
    }
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Log out?",
      text: "You will be signed out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");

        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };


  if (isFetching) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <aside className="profile-sidebar">

            <div className="profile-user-card" style={{alignItems:"center"}}>
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-text-md"></div>
              <div className="skeleton skeleton-text-sm"></div>
            </div>

            <div className="profile-menu-list">
              <div className="skeleton skeleton-text-md"></div>
              <div className="skeleton skeleton-text-md"></div>
              <div className="skeleton skeleton-text-md"></div>
            </div>

            <div className="skeleton skeleton-text-md" style={{width:"100%", height:"40px"}}></div>

          </aside>

          <main className="profile-main">
            <div className="settings-section-card skeleton" style={{height:"400px"}}></div>
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
          <aside
            className={
              "profile-sidebar" + (!isMember ? " profile-sidebar-staff" : "")
            }
          >
            <div className="profile-user-card">
              <div className="profile-avatar-wrapper">
                <img
                  src={profile?.url_foto_profil || "/icons/blank-pfp.png"}
                  className="profile-avatar-large"
                  alt="Profile Avatar"
                />
                <button
                  type="button"
                  className="profile-avatar-change-btn"
                  onClick={handleAvatarClick}
                  title="Ganti foto profil"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="profile-avatar-input"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="profile-user-info">
                <h3>{profile?.nama || profile?.username || "User"}</h3>
                <p className="profile-user-meta">
                  {role === "petugas" ? "Staff" : "Member"} · ID:{" "}
                  {profile?.id_member ?? profile?.id_petugas ?? "-"}
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

              {isMember ? (
                <>
                  <button
                    className={`profile-menu-item ${
                      isActive("/profile/borrowing-history")
                        ? "profile-menu-active"
                        : ""
                    }`}
                    onClick={() => navigate("/profile/borrowing-history")}
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
                </>
              ) : (
                <div >
                 
                </div>
              )}
            </div>

            <button
              className="profile-logout-btn"
              onClick={handleLogoutClick}
            >
              <span className="profile-menu-icon logout-icon">
                <LogOut size={18} />
              </span>
              Log Out
            </button>
          </aside>

          {/* ==== MAIN CONTENT (sub page) ==== */}
          <main className="profile-main">
            <Outlet /> {/* ⬅️ di sini isi halaman kanan */}
          </main>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
