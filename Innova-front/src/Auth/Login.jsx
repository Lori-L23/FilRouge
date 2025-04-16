import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
// Importez Firebase (vous devez avoir installé firebase)
import { auth, googleProvider } from "../firebase"; // À configurer selon votre setup Firebase
import { signInWithPopup } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    // Votre logique de connexion normale
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Redirigez l'utilisateur après connexion réussie
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center rounded-lg shadow-md justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#7ED321]">
            Se connecter avec InnovaLearn
          </h2>
        </div>
        
        {/* Bouton Google */}
        <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
             onClick={signInWithGoogle}>
          <FaGoogle className="text-red-500 mr-2" />
          <span className="font-medium">Continue with Google</span>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {typeof error === "object" ? error.message : error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* ... (votre formulaire existant reste inchangé) ... */}
        </form>
      </div>
    </div>
  );
}

export default Login;