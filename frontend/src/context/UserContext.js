import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {},
  refreshUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          if (isTokenExpired(token)) {
            console.warn("Token is expired");
            localStorage.removeItem("token");
            setUser(null);
            window.location.href = "/login"; // Redirect to login
            return;
          }
          const response = await api.get("/users/details", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.response && error.response.status === 401) {
          // Handle invalid or expired token
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/login"; // Redirect to login
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        if (isTokenExpired(token)) {
          console.warn("Token is expired");
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/login"; // Redirect to login
          return;
        }
        const response = await api.get("/users/details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error refreshing user details:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};