import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api"; // ← sesuaikan path
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    alamat: "",
    no_telp: "",
  });

  // helper: tentukan role dari email
  const getRoleFromEmail = (email) => {
    // bebas mau kamu ganti logiknya
    // sekarang: kalau mengandung "@petugas" → dianggap petugas
    if (email.toLowerCase().includes("@petugas")) {
      return "petugas";
    }
    return "member";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({}); // reset error

    try {
      const role = getRoleFromEmail(formData.email);

      // pilih endpoint berdasarkan role
      const endpoint =
        role === "petugas" ? "/register/petugas" : "/register/member";

      const res = await api.post(endpoint, formData);

      // kalau backend kirim token, simpan (biar tidak error kalau tidak ada)
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success(
        role === "petugas"
          ? "Register Petugas berhasil! Silakan login."
          : "Register Member berhasil! Silakan login."
      );

      console.log("REGISTER RESPONSE:", res.data);
      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data);
      const backend = error.response?.data;

      if (backend?.errors) {
        Object.values(backend.errors).forEach((msgArr) => {
          toast.error(msgArr[0]);
        });

        setErrors(backend.errors);
        return;
      }

      if (backend?.message) {
        toast.error(backend.message);
        return;
      }

      toast.error("Register failed, try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="logo-side">
        <img src="/signlogin/logo-montserrat.png" alt="logo" />
      </div>

      <div className="register-card">
        <h3 className="login-title">Create Your Account</h3>

        <form onSubmit={handleRegister}>
          <label>Nama</label>
          <input
            type="text"
            placeholder="Nama"
            required
            value={formData.nama}
            onChange={(e) =>
              setFormData({ ...formData, nama: e.target.value })
            }
          />
          {errors.nama && <p className="error">{errors.nama[0]}</p>}

          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && <p className="error">{errors.username[0]}</p>}

          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email[0]}</p>}

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />
          {errors.password_confirmation && (
            <p className="error">{errors.password_confirmation[0]}</p>
          )}

          <label>Alamat</label>
          <input
            type="text"
            placeholder="Alamat"
            required
            value={formData.alamat}
            onChange={(e) =>
              setFormData({ ...formData, alamat: e.target.value })
            }
          />
          {errors.alamat && <p className="error">{errors.alamat[0]}</p>}

          <label>No. Telepon</label>
          <input
            type="text"
            placeholder="08xxxxxxxxxx"
            required
            value={formData.no_telp}
            onChange={(e) =>
              setFormData({ ...formData, no_telp: e.target.value })
            }
          />
          {errors.no_telp && <p className="error">{errors.no_telp[0]}</p>}

          <button type="submit" className="btn-login">
            Register
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/login")}>
              Login here
            </a>
          </p>

          <button
            type="button"
            className="btn-back"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}
