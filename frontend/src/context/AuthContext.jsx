import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const login = async (formData) => {
    const response = await API.post("/login", formData);

    const data = response.data;

    localStorage.setItem("token", data.access_token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );

    setToken(data.access_token);
    setUser({
      id: data.user_id,
      name: data.name,
      email: data.email,
      role: data.role,
    });

    return data;
  };

  const register = async (formData) => {
    const response = await API.post("/register", formData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get("/me");
      setUser(response.data);

      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}