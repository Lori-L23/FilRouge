import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Api from "../Services/Api";

/**
 * Création du contexte d'authentification
 * Ce contexte gère l'état global d'authentification dans l'application
 */
const AuthContext = createContext();

/**
 * Provider d'authentification
 * Wrap l'application pour fournir les fonctionnalités d'authentification
 */
export const AuthProvider = ({ children }) => {
  // État d'authentification qui combine:
  // - user: données basiques de l'utilisateur
  // - profile: données spécifiques au rôle
  // - loading: état de chargement
  const [authState, setAuthState] = useState({
    user: null,
    profile: null,
    profileType: null,
    loading: true,
    error: null,
  });

  /**
   * Charge les données de l'utilisateur authentifié
   * Vérifie le token en localStorage et récupère les données correspondantes
   */


  const loadUserData = async () => {
    try {
      // Vérification initiale du token
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Double vérification CSRF
      await Api.get("/sanctum/csrf-cookie");

      // Récupération des données combinées
      const { data } = await Api.get("/api/user-with-profile");

      if (!data.user || !data.profile_type) {
        throw new Error("Données utilisateur incomplètes");
      }

      setAuthState({
        user: data.user,
        profile: data.profile,
        profileType: data.profile_type,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur de chargement utilisateur:", error);

      // En cas d'erreur 401, nettoyage complet
      if (error.response?.status === 401) {
        logout();
      } else {
        setAuthState({
          user: null,
          profile: null,
          profileType: null,
          loading: false,
          error: error.message,
        });
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Gère le processus de connexion
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Object} - { success: boolean, message?: string }
   */
  const login = async (email, password) => {
    try {
      // 1. On récupère le cookie CSRF pour la protection
      await Api.get("/sanctum/csrf-cookie");

      // 2. Tentative de connexion
      const response = await Api.post("/api/login", { email, password });

      // 3. Si le token est reçu, on le stocke et on charge les données
      if (response.data?.token) {
        localStorage.setItem("auth_token", response.data.token);
        await loadUserData();
        return { success: true };
      }

      throw new Error("Réponse inattendue");
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  /**
   * Gère le processus d'inscription
   * @param {Object} userData - Données d'inscription
   * @returns {Object} - { success: boolean, message?: string, errors?: Object }
   */
  const register = async (userData) => {
    try {
      // 1. On récupère le cookie CSRF
      await Api.get("/sanctum/csrf-cookie");

      // 2. Tentative d'inscription
      const response = await Api.post("/api/register", userData);

      // 3. Si le token est reçu, on le stocke et on charge les données
      if (response.data?.token) {
        localStorage.setItem("auth_token", response.data.token);
        await loadUserData();
        return { success: true };
      }

      throw new Error("Réponse inattendue");
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Erreur d'inscription",
        errors: error.response?.data?.errors || {},
      };
    }
  };

  /**
   * Gère la déconnexion
   * Nettoie le localStorage et les headers API
   */
  const logout = useCallback(() => {
    // console.log("logout Déclenché");

    // Nettoyage côté client quoi qu'il arrive
    localStorage.removeItem("auth_token");
    delete Api.defaults.headers.common["Authorization"];

    setAuthState({
      user: null,
      profile: null,
      profileType: null,
      loading: false,
      error: null,
    });

 
  }, []);

  // Valeurs fournies par le contexte
  const contextValue = {
    ...authState,
    login,
    register,
    logout,
    isAuthenticated: !!authState.user, // Booléen indiquant si l'utilisateur est connecté
    refetchUser: loadUserData, // Fonction pour recharger les données utilisateur
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* On ne rend les enfants que quand le chargement initial est terminé */}
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @returns {Object} - Le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
