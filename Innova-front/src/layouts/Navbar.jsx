import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBell,
  FaCog,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHome,
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Liens principaux
  const mainLinks = [
    { to: "/", text: "Accueil" },
    { to: "/cours", text: "Cours" },
    { to: "/apropos", text: "À propos" },
    { to: "/ressources", text: "Ressources" },
    { to: "/contact", text: "Contact" },
  ];

  // Liens utilisateur selon son profil
  const getUserLinks = (user) => {
    const links = [];

    if (user?.role === "admin") {
      links.push(
        {
          to: "/DashboardAdmin",
          text: "Dashboard",
          icon: <FaCog />,
        },
        {
          to: "/Profilad",
          text: "Mon Profil",
          icon: <FaUser />,
        }
      );
    } else if (profile?.biographie) {
      // Répétiteur
      links.push({
        to: "/profile",
        text: "Mon Profil",
        icon: <FaUser />,
      });
    } else if (profile?.niveau_scolaire || isAuthenticated) {
      // Élève ou utilisateur de base
      links.push({
        to: "/profil",
        text: "Mon Profil",
        icon: <FaUserGraduate />,
      });
    }

    return links;
  };

  const links = getUserLinks(user);

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
            <div className="flex space-x-6 text-gray-700 font-medium">
              {mainLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.text}
                </NavLink>
              ))}
            </div>

            {/* Boutons conditionnels */}
            <div className="flex items-center space-x-4 ml-6">
              {!isAuthenticated ? (
                <>
                  <AuthButton
                    onClick={() => navigate("/login")}
                    icon={<FaSignInAlt />}
                  >
                    Connexion
                  </AuthButton>
                  <AuthButton
                    primary
                    onClick={() => navigate("/register")}
                    icon={<FaUserPlus />}
                  >
                    Inscription
                  </AuthButton>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-5">
                    {links.map((link) => (
                      <NavLink key={link.to} to={link.to} icon={link.icon}>
                        {link.text}
                      </NavLink>
                    ))}
                  </div>
                  <AuthButton onClick={logout}>Déconnexion</AuthButton>
                </>
              )}
            </div>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
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
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-white z-40 pt-20 px-6 overflow-y-auto md:hidden"
            >
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
                  {!isAuthenticated ? (
                    <>
                      <MobileAuthButton
                        onClick={() => {
                          navigate("/login");
                          closeMenu();
                        }}
                        icon={<FaSignInAlt />}
                      >
                        Connexion
                      </MobileAuthButton>
                      <MobileAuthButton
                        primary
                        onClick={() => {
                          navigate("/register");
                          closeMenu();
                        }}
                        icon={<FaUserPlus />}
                      >
                        Inscription
                      </MobileAuthButton>
                    </>
                  ) : (
                    <>
                      {links.map((link) => (
                        <MobileNavLink
                          key={link.to}
                          to={link.to}
                          onClick={closeMenu}
                          icon={link.icon}
                        >
                          {link.text}
                        </MobileNavLink>
                      ))}
                      <MobileAuthButton
                        className="bg-[#7ED321] text-white"
                        primary
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                      >
                        Déconnexion
                      </MobileAuthButton>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Composants réutilisables
const NavLink = ({ to, children, icon, badge = false }) => (
  <Link
    to={to}
    className="flex items-center text-gray-700 hover:text-[#7ED321] transition-colors duration-200 font-medium relative focus:text-[#7ED321]"
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