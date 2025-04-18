import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo.png"; // Assurez-vous que le chemin d'accès à votre logo est correct

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Simulation d'authentification
  const isLoggedIn = true;
  const userRole = "repetiteur";

  // Gestion du scroll pour l'effet de navbar fixe
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-2" : "bg-white py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-40">
            <img src={logo} alt="Logo" className="h-14 w-auto" />
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <NavLink to="/">Accueil</NavLink>
              <NavLink to="/cours">Cours proposés</NavLink>
              <NavLink to="/apropos">À propos</NavLink>
              <NavLink to="/ressources">Ressources</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>

            {/* Boutons auth */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-8">
                <AuthLink to="/login" icon={<FaSignInAlt />}>
                  Se connecter
                </AuthLink>
                <AuthButton to="/register" primary>
                  Inscrivez-vous
                </AuthButton>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-8">
                <NavLink to="/profil" icon={<FaUser />}>
                  Mon Profil
                </NavLink>
                <AuthButton onClick={handleLogout} primary>
                  Déconnexion
                </AuthButton>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } pt-20 px-6`}
        >
          <div className="flex flex-col space-y-6">
            <MobileNavLink to="/" onClick={toggleMenu}>
              Accueil
            </MobileNavLink>
            <MobileNavLink to="/cours" onClick={toggleMenu}>
              Cours proposés
            </MobileNavLink>
            <MobileNavLink to="/apropos" onClick={toggleMenu}>
              À propos
            </MobileNavLink>
            <MobileNavLink to="/ressources" onClick={toggleMenu}>
            Ressources
            </MobileNavLink>
            <MobileNavLink to="/contact" onClick={toggleMenu}>
              Contact
            </MobileNavLink>

            <div className="border-t border-gray-200 pt-6">
              {!isLoggedIn ? (
                <>
                  <MobileAuthLink to="/login" onClick={toggleMenu}>
                    <FaSignInAlt className="mr-2" />
                    Se connecter
                  </MobileAuthLink>
                  <MobileAuthButton to="/register" onClick={toggleMenu} primary>
                    <FaUserPlus className="mr-2" />
                    Inscrivez-vous
                  </MobileAuthButton>
                </>
              ) : (
                <>
                  <MobileNavLink to="/profil" onClick={toggleMenu}>
                    <FaUser className="mr-2" />
                    Mon Profil
                  </MobileNavLink>
                  <MobileAuthButton onClick={handleLogout} primary>
                    Déconnexion
                  </MobileAuthButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composants réutilisables
const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-xl text-gray-700 hover:text-blue-600 py-3 border-b border-gray-100"
  >
    {children}
  </Link>
);

const AuthLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </Link>
);

const MobileAuthLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center text-gray-700 hover:text-blue-600 py-3 text-lg"
  >
    {children}
  </Link>
);

const AuthButton = ({ children, primary, onClick, to }) => {
  const baseClass = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center";
  const primaryClass = "bg-[#7ED321] text-white hover:bg-[#6BBE1F]";
  const secondaryClass = "text-gray-700 hover:bg-gray-100";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClass} ${primary ? primaryClass : secondaryClass}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${primary ? primaryClass : secondaryClass}`}
    >
      {children}
    </button>
  );
};

const MobileAuthButton = ({ children, primary, onClick, to }) => {
  const baseClass = "w-full text-left px-0 py-3 text-lg font-medium";
  const primaryClass = "text-[#7ED321] hover:text-[#6BBE1F]";
  const secondaryClass = "text-gray-700 hover:text-blue-600";

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`${baseClass} ${primary ? primaryClass : secondaryClass}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${primary ? primaryClass : secondaryClass}`}
    >
      {children}
    </button>
  );
};

export default Navbar;