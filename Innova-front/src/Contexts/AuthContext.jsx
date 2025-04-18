import { createContext, useContext, useState, useEffect } from "react";
import Api from "../Services/Api"; // Assure-toi d'utiliser Api et non axios directement
// import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Même clé que login()
        if (token) {
          Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await Api.get("/user");
          setUser(data.user);
        }
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await Api.post("/login", { email, password });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      let errorMsg = "Erreur de connexion";

      if (error.response?.status === 422) {
        errorMsg = Object.values(error.response.data.errors).flat().join("\n");
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      return { success: false, error: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      const response = await Api.post("/register", userData); // Utilise Api ici

      // Mettre à jour l'utilisateur courant
      setUser(response.data.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Erreur d'inscription",
        errors: error.response?.data?.errors || {},
      };
    }
  };

  const logout = async () => {
    try {
      await Api.post("/auth/logout"); // Utilise Api ici
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
