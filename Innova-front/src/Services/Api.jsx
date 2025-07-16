import axios from "axios";
import { useAuth } from "./contexts/AuthContext"; // Import correct du contexte

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true
});

// Intercepteur pour requêtes
Api.interceptors.request.use(async (config) => {
  // Gestion CSRF pour les méthodes mutatives
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    try {
      await axios.get(`${config.baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true
      });
      
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
      }
    } catch (error) {
      console.error("Erreur CSRF:", error);
    }
  }

  // Ajout du token JWT
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Intercepteur pour réponses
Api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        // Utilisation correcte du contexte
        const { logout } = useAuth();
        logout();
        window.location.href = '/login';
      } catch (e) {
        console.error("Erreur lors de la déconnexion:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default Api;