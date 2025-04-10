// src/context/AuthContext.js
import { useNavigate } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Login function to update context and set token
  const login = (username, token) => {
    setUser(username);
    setToken(token);
  };

  // Logout function to update context and clear token
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/");
  };

  //Check if there's a token in memory on app load
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      const storedUsername = sessionStorage.getItem("username");
      setUser(storedUsername);
      setToken(storedToken);
    }
  }, []);

  // Remove token and user on browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};
