import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../../../config/api";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", formData);

      // SIMPAN TOKEN, ROLE, USER
      localStorage.setItem("auth", "true");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log(res.data);

      window.dispatchEvent(new Event("storageUpdate"));
      toast.success("Login Success!");
      navigate("/");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Invalid Username or Password!");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="logo-side">
        <img src="/signlogin/logo-montserrat.png" alt="logo" />
      </div>

      <div className="login-card">
        <h3 className="login-title">Glad you're back!</h3>

        <form onSubmit={handleLogin}>
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
          {errors.email && (
            <p className="error">{errors.email[0]}</p>
          )}

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
          {errors.password && (
            <p className="error">{errors.password[0]}</p>
          )}

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          <button type="submit" className="btn-login">
            Log in
          </button>

          <p className="continue-text">or continue with</p>

          <div className="social-login">
            <button type="button" className="social-btn google">
              <img src="/icons/google.jpg" alt="Google" />
            </button>

            <button type="button" className="social-btn github">
              <img src="/icons/github.png" alt="GitHub" />
            </button>

            <button type="button" className="social-btn facebook">
              <img src="/icons/facebook.png" alt="Facebook" />
            </button>
          </div>

          <p className="register-text">
            Don’t have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Register for free
            </span>
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
