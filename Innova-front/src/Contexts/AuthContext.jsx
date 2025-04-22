import { createContext, useContext, useState, useEffect } from "react";
import Api from "../Services/Api";
// import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("auth_token"); // Changé pour correspondre à la clé utilisée dans login
        if (token) {
          Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await Api.get("/api/user");
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        localStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      await Api.get("/sanctum/csrf-cookie");
      
      const response = await Api.post("/api/login", { email, password });

      if (response.data && response.data.token) {
        const { user, token } = response.data;
        localStorage.setItem("auth_token", token);
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        return { success: true, user };
      }
      throw new Error("Réponse inattendue du serveur");
    } catch (error) {
      console.error("Erreur de connexion:", error);

      if (error.response) {
        if (error.response.status === 422) {
          return {
            success: false,
            errors: error.response.data.errors,
          };
        }
        return {
          success: false,
          message: error.response.data?.message || "Erreur de connexion",
        };
      }

      return {
        success: false,
        message: error.message || "Erreur de connexion",
      };
    }
  };

  const register = async (userData) => {
    try {
      await Api.get("/sanctum/csrf-cookie");
      console.log("Données envoyées:", JSON.stringify(userData, null, 2));

      const response = await Api.post("/api/register", userData)
      console.log('resp: ', response);
      console.log('user: ', response.data.user);
      console.log('token: ', response.token);
      
      if (response.data.user && response.data.token) {
        const { user, token } = response.data;
        localStorage.setItem("auth_token", token);
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        return { success: true, user };
      }
      // throw new Error("Réponse inattendue du serveur");
    } catch (error) {
      console.log("Erreur d'inscription:", error);

      if (error.response) {
        if (error.response.status === 422) {
          return {
            success: false,
            errors: error.response.data.errors || {},
            message: error.response.data.message || "Validation error",
          };
        }
        return {
          success: false,
          message: error.response.data?.message || "Erreur d'inscription",
        };
      }

      return {
        success: false,
        message: error.message || "Erreur d'inscription",
      };
    }
  };

  const logout = async () => {
    try {
      await Api.post("api/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      localStorage.removeItem("auth_token");
      delete Api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };
  const feedback = async ()=>{
    try{
      await Api.post("api/admin/feedbacks");
    }catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
  }
}

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        feedback,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
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
