import { useContext, useState } from "react";
import { login, logout, register } from "../services/auth-api";
import { AuthContext } from "../auth-context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading: contextLoading, error, setError } = context;
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setActionLoading(true);

    try {
      setError(null);
      const data = await login(email, password);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setActionLoading(true);

    try {
      setError(null);
      const data = await register(username, email, password);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Registration failed");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setActionLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return { 
    user, 
    loading: contextLoading || actionLoading, 
    error, 
    setError, 
    handleLogin, 
    handleLogout, 
    handleRegister 
  };
};
