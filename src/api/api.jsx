// src/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL=http://127.0.0.1:8000/api, 
});

// helper untuk set token secara global
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

// saat app start, coba muat token yang tersimpan
const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);

export default api;
