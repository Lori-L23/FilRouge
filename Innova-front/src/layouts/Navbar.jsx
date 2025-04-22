import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBell,
  FaCog,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(location.state?.IsLoggedIn || false);
  const [userRole, setUserRole] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  // declaration de la constante du popup
  const[showPopup, setShowPopup]= useState(false);
  const togglePopup = () => {
    setShowPopup (!showPopup);
  }

  // Simuler l'authentification (à remplacer par votre logique réelle)
  useEffect(() => {
    // Ici vous pourriez vérifier un token dans localStorage ou faire une requête API
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      setUserRole("repetiteur"); // ou 'student', 'admin' selon l'utilisateur
      setHasNotifications(true); // Simuler des notifications
      setShowPopup(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    // setIsLoggedIn(true);
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Configuration des liens de navigation
  const mainLinks = [
    { to: "/", text: "Accueil" },
    { to: "/cours", text: "Cours" },
    // { to: "/tutors", text: "Professeurs" },
    { to: "/apropos", text: "À propos" },
    { to: "/ressources", text: "Ressources" },
    { to: "/contact", text: "Contact" },
  ];

  const userLinks = [
    { to: "/profil", icon: <FaUser /> },
    {
      to: "/notifications",
      
      icon: <FaBell />,
      showBadge: hasNotifications,
    },
    { to: "/settings", icon: <FaCog /> },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-40" onClick={closeMenu}>
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {mainLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.text}
                </NavLink>
              ))}
            </div>

            {/* Boutons conditionnels */}
            <div className="flex items-center space-x-4 ml-6">
              {!isLoggedIn ? (
                <>
                  <AuthButton onClick={handleLogin} icon={<FaSignInAlt />}>
                    Connexion
                  </AuthButton>
                  <AuthButton
                    primary
                    onClick={handleRegister}
                    icon={<FaUserPlus />}
                  >
                    Inscription
                  </AuthButton>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-5">
                    {userLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        icon={link.icon}
                        badge={link.showBadge}
                      >
                        {link.text}
                      </NavLink>
                    ))}
                  </div>
                  <AuthButton primary onClick={handleLogout}>Déconnexion</AuthButton>
                </>
              )}
            </div>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && hasNotifications && (
              <Link to="/notifications" className="mr-4 relative">
                <FaBell className="text-gray-700 text-xl" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
              </Link>
            )}
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
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {mainLinks.map((link) => (
                <MobileNavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  icon={link.icon}
                >
                  {link.text}
                </MobileNavLink>
              ))}

              <div className="border-t border-gray-200 pt-4">
                {!isLoggedIn ? (
                  <>
                    <MobileAuthButton
                      onClick={() => {
                        handleLogin();
                        closeMenu();
                      }}
                      icon={<FaSignInAlt />}
                    >
                      Connexion
                    </MobileAuthButton>
                    <MobileAuthButton
                      primary
                      onClick={() => {
                        handleRegister();
                        closeMenu();
                      }}
                      icon={<FaUserPlus />}
                    >
                      Inscription
                    </MobileAuthButton>
                  </>
                ) : (
                  <>
                    {userLinks.map((link) => (
                      <MobileNavLink
                        key={link.to}
                        to={link.to}
                        onClick={closeMenu}
                        icon={link.icon}
                        badge={link.showBadge}
                      >
                        {link.text}
                      </MobileNavLink>
                    ))}
                    <MobileAuthButton className='bg-[#7ED321] text-white'
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                    >
                      Déconnexion
                    </MobileAuthButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Composants réutilisables
const NavLink = ({ to, children, icon, badge = false }) => (
  <Link
    to={to}
    className="flex items-center text-gray-700 hover:text-[#7ED321] transition-colors duration-200 font-medium relative"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    {badge && (
      <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-red-500"></span>
    )}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, icon, badge = false }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center text-lg text-gray-700 hover:text-[#7ED321] py-3 px-2 border-b border-gray-100 relative"
  >
    {icon && <span className="mr-3">{icon}</span>}
    {children}
    {badge && (
      <span className="absolute right-2 h-2 w-2 rounded-full bg-red-500"></span>
    )}
  </Link>
);

const AuthButton = ({
  children,
  primary = false,
  onClick,
  icon,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center";
  const primaryClasses = "bg-[#7ED321] text-white hover:bg-[#6BBE1F]";
  const secondaryClasses = "text-gray-700 hover:bg-[#6BBE1F] hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        primary ? primaryClasses : secondaryClasses
      } ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const MobileAuthButton = ({ children, primary = false, onClick, icon }) => {
  const baseClasses =
    "w-full text-left py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center my-1";
  const primaryClasses = "bg-[#7ED321] text-white hover:bg-[#6BBE1F]";
  const secondaryClasses = "text-gray-700 hover:bg-gray-100";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        primary ? primaryClasses : secondaryClasses
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

export default Navbar;
