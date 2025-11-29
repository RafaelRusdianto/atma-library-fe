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

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });


  // dipanggil saat login sukses
  const login = (newRole, newToken, userData) => {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", newRole);

    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); 
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

  //  dipakai setelah update profile / fetch profile lagi
  const updateUser = (newUserData) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...newUserData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, token, login, logout, updateUser, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
