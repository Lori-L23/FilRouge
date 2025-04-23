import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { auth, googleProvider } from "../components/firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  // États du composant
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false); // Déplacé ici si non fourni par useAuth
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Ajout de user depuis le contexte

  /**
   * Gestion de la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Validation des champs
    const errors = {};
    if (!email.trim()) errors.email = "Email requis";
    if (!password) errors.password = "Mot de passe requis";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Tentative de connexion
      const { success, error: authError } = await login(email, password);

      if (success) {
        // Redirection basée sur le rôle après connexion réussie
        if (user?.role === "admin") {
          navigate("/DashboardAdmin");
        } else {
          navigate("/", { state: { isLoggedIn: true } });
        }
      } else {
        setError(authError || "Échec de la connexion");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion avec Google
   */
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // Redirection après connexion Google
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message || "Erreur lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        {/* En-tête */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#7ED321]">
            Se connecter avec InnovaLearn
          </h2>
        </div>

        {/* Bouton Google */}
        <button
          type="button"
          className="w-full border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-50"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <FaGoogle className="text-red-500 mr-2" />
          <span className="font-medium">Continue with Google</span>
        </button>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="px-4 py-3 rounded bg-red-50">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire de connexion */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-3 py-2 border ${
                  fieldErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none block w-full px-3 py-2 border ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {/* Lien vers l'inscription */}
            <div className="text-center text-sm">
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Pas de compte ? S'inscrire
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;