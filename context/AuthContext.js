import { createContext, useState, useEffect } from "react";
import api from "../lib/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // store logged-in user info

  // load saved token and user when app starts
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // login user
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const { token, user } = res.data; // backend should return token + user object
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return res.data;
  };

  // register user
  const register = async (username, email, password) => {
    const res = await api.post("/register", { username, email, password });
    return res.data;
  };

  // logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
