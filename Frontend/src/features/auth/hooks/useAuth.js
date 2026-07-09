import { useContext } from "react";
import { login, logout, register } from "../services/auth-api";
import { AuthContext } from "../auth-context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, error, setError } = context;

  const handleLogin = async (email, password) => {
    setLoading(true);

    try {
      setError(null);
      const data = await login(email, password);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);

    try {
      setError(null);
      const data = await register(username, email, password);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const data = await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, setError, handleLogin, handleLogout, handleRegister };
};
