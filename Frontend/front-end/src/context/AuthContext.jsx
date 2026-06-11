import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          localStorage.setItem("token", token);
          const res = await axiosInstance.get("/users/");
          setUser({
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            balance: res.data.balance || 0,
            card: res.data.card || null,
          });
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Session expired or invalid token:", err);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      balance: res.data.balance || 0,
      card: res.data.card || null,
    });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axiosInstance.post("/auth/register", { name, email, password });
    setToken(res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
