// ProtectedRoute.jsx
import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { api } from "./api";

export default function ProtectedRoute({ children }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      if (user?.id) {
        try {
          await api.get(`/users/${user.id}`);
        } catch (error) {
          logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
        }
      }
    };
    verifyToken();
  }, [user, location, logout]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}