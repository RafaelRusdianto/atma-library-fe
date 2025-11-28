import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("auth") === "true"
  );
  const [role, setRole] = useState(
    () => localStorage.getItem("role") || ""
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  // dipanggil saat login sukses
  const login = (newRole, newToken) => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", newRole);
    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    setIsLoggedIn(true);
    setRole(newRole);
    setToken(newToken || "");
  };

  //  dipanggil saat logout
  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // kalau ada

    setIsLoggedIn(false);
    setRole("");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
