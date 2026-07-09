import React, { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth-api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUserandSet() {
      try {
        const data = await getMe();

        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUserandSet();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
