import { createContext, useContext, useState, useEffect, useCallback } from "react";
import Api from "../Services/Api";
import axios from "axios";

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
    error: null

  });

  /**
   * Charge les données de l'utilisateur authentifié
   * Vérifie le token en localStorage et récupère les données correspondantes
   */

  
  const loadUserData = async () => {    
    try {
      //appel de l aoi du login
      // await Api.post("/api/login", { email, password });

      // Récupération des données combinées
      const { data } = await Api.get('/api/user-with-profile')

    //appel du cookie de sanctum
    //   await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    //     withCredentials: true
    // });

    
      // Vérification des données
      if (!data.user || !data.profile_type) {
        throw new Error("Données utilisateur incomplètes");
      }
      // Récupération du token depuis le stockage local
      const token = localStorage.getItem("auth_token");

      // Si pas de token, on reset l'état
      if (!token) {
        setAuthState({ user: null, profile: null, loading: false });
        return;
      }

      // Configuration du header Authorization pour toutes les requêtes API
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 1. Récupération des données de base
      const { data: userData } = await Api.get("/api/user");

      if (!userData?.user?.role) {
        throw new Error("Données utilisateur incomplètes");
      }

      // 2. Récupération des données spécifiques
      let profileData = null;
      const { role, id } = userData.user;

      // Gestion de tous les rôles possibles
      if (role === "eleve") {
        // const { data } = await Api.get(`/api/eleves/${id}`);
        profileData = { role: "eleve" };
      } else if (role === "repetiteur") {
        const { data } = await Api.get(`/api/repetiteurs/${id}`);
        profileData = data;
      } else if (role === "admin") {
        
        // Pour les admins, on peut soit:
        // a. Ne pas charger de profil spécifique
        // b. Charger des données admin si nécessaire
        profileData = { isAdmin: true }; // Exemple simple
        // Ou pour récupérer des données admin:
        // const { data } = await Api.get(`/api/admins/${id}`);
        // profileData = data;
      } else {
        console.warn(`Rôle '${role}' reconnu mais non géré spécifiquement`);
        profileData = { customRole: role };
      }

      // 3. Mise à jour de l'état
      setAuthState({
        user: userData.user,
        profile: data.profile,
        profileType: data.profile_type,
        loading: false,
      });
    } catch (error) {
      console.error("Erreur détaillée:", {
        message: error.message,
        config: error.config,
        response: error.response?.data,
      });

      // Réinitialisation sécurisée
      if (error.response?.status === 401) {
        logout();
      }
    }
  };
  // Au montage du composant, on charge les données utilisateur
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
  const logout =  useCallback(() => {
    console.log("logout Déclenché");
    
    // Nettoyage côté client quoi qu'il arrive
    localStorage.removeItem("auth_token");
    delete Api.defaults.headers.common["Authorization"];

    setAuthState({ 
      user: null, 
      profile: null,
      profileType: null, 
      loading: false,
      error: null
    });


    // try {
    //   // Appel API pour invalider le token côté serveur
    //   await Api.post("/api/logout");
    // } catch (error) {
    //   console.error("Logout error:", error);
    // } finally {
    // }
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
