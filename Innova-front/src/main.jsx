import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'; // Vérifie que le chemin est correct



createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
