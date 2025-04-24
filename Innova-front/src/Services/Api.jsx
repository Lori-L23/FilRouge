import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8000", // Adaptez selon votre URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Intercepteur pour injecter le token
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
