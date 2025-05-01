import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
    }
    return result;
  };

  const register = async (email, password) => {
    const result = await apiRegister(email, password);
    if (result.success) {
      setUser(result.data);
      localStorage.setItem("user", JSON.stringify(result.data));
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}