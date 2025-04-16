import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Assurez-vous que le chemin est correct
const Navbar = () => {
  const navigate = useNavigate();

  // Simule une session utilisateur (à remplacer par ton vrai contexte ou auth)
  const isLoggedIn = true;
  const userRole = "repetiteur"; // ou 'eleve' ou 'admin'

  const handleLogout = () => {
    // Déconnecte l'utilisateur ici (appel à l'API backend + nettoyage localStorage, etc.)
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div>
        <Link to="/Accueil">
          <img src={logo} className="h-15 w-20 " />
        </Link>
      </div>

      <div className=" flex justify-center space-x-9 ">
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Accueil
          </Link>

            <Link to="/cours" className="text-gray-700 hover:text-blue-600">
              Cours proposes
            </Link>
         
        </div>

        <Link to="/apropos" className="text-gray-700 hover:text-blue-600">
          A propos
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-600">
          Contact
        </Link>

                {/* {isLoggedIn && userRole === 'eleve' && (
             <Link to="/rechercher" className="text-gray-700 hover:text-blue-600">
             Trouvez un repetiteur
             </Link>
            )} */}
      </div>
      {!isLoggedIn ? (
        <>
        <div className="space-x-5">
         <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Se connecter
          </Link>
          <Link
            to="/register"
            className="bg-[#7ED321] text-white px-3 py-1 rounded hover:bg-[#6BBE1F] transition duration-200"
          >
            Inscrivez-vous
          </Link>   
        </div>
          
        </>
      ) : (
        <>
        <div className="space-x-5">
            <Link to="/profil" className="text-gray-700 hover:text-blue-600">
            Mon Profil
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#7ED321] text-white px-3 py-1 rounded hover:bg-[#6BBE1F] transition duration-200"
          >
            Déconnexion
          </button>
        </div>
          
        </>
      )}
    </nav>
  );
};

export default Navbar;
