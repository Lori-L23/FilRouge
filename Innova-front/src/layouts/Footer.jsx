import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#4A90E2] text-white pt-8 pb-6 px-4 md:px-12 w-full">
      {/* Top Section - Newsletter */}
      <section className="flex flex-col items-center border-b border-white pb-8 mt-5">
        <h1 className="text-1xl font-bold mb-15">
          L'éducation réinventée pour un monde en constante évolution!
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
          <input
            type="email"
            placeholder="Une newlester branchée pour rester au courant⚡"
            className="flex-grow px-4 py-3 text-indigo-800 border bg-white border-indigo-600 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-indigo-300"
          />
          <button className="text-blue-600 hover:bg-blue-600 hover:text-white  bg-white font-medium px-6 py-3 rounded-4xl transition-colors ml-2">
            Je m’abonne
          </button>
        </div>
      </section>

      {/* Middle Section - Main Content */}
      <section className="py-8 border-b border-white mt-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand Info */}
          <div className="mb-6 md:mb-0">
            <Link to="/Accueil" className="flex items-center">
              <h1 className="text-4xl text-[#022A58] font-bold">InnovaLearn</h1>
            </Link>
            <p className="text-white text-lg mt-4">
              Apprenez aujourd'hui, innovez demain!
            </p>
          </div>

          {/* Social & Downloads */}
          <div className="flex flex-col items-center md:items-end gap-6 md:gap-0 md:flex-row">
            <div className="flex gap-4 text-xl">
              <a href="#" className="text-white hover:text-blue-800">
                <FaFacebook />
              </a>
              <a href="#" className="text-white hover:text-blue-800">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-blue-800">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-blue-800">
                <FaLinkedin />
              </a>
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-800 transition-colors">
                <FaApple className="text-xl" />
                <span>Télécharger sur <br /> l'App Store</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-indigo-500 rounded-lg hover:bg-indigo-800 transition-colors">
                <FaGooglePlay className="text-xl" />
                <span>Disponible sur<br />  Google Play</span>
              </button>
            </div> */}
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="py-8 border-b border-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-white">
              <li>
                <a href="/Accueil" className="hover:text-blue-800">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/cours" className="hover:text-blue-800">
                  Cours
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-800">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">À Propos</h3>
            <ul className="space-y-2 text-white">
              <li>
                <a href="#" className="hover:text-blue-800">
                  Qui sommes-nous?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800">
                  Pourquoi Nous Choisir?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800">
                  Équipe
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-blue-800">
                  Carrières
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Ressources</h3>
            <ul className="space-y-2 text-white">
              <li>
                <a href="#" className="hover:text-blue-800">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800">
                  Études de cas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800">
                  Témoignages
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Espace Client</h3>
            <ul className="space-y-2 text-white">
              <li>
                <a href="#" className="hover:text-blue-900">
                  Parrainage
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-1xl font-bold">
            L'éducation réinventée pour un monde en constante évolution!
          </h1>
        </div>
      </section>

      {/* Bottom Links */}
      <section className="pt-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white">
          <a href="#" className="hover:text-white">
            Politiques de confidentialité
          </a>
          <a href="#" className="hover:text-blue-800">
            Mentions légales
          </a>
          <a href="#" className="hover:text-blue-800">
            Recrutements
          </a>
          <a href="#" className="hover:text-blue-800">
            Contact
          </a>
          <a href="#" className="hover:text-blue-800">
            Cookies
          </a>
          <a href="#" className="hover:text-blue-800">
            Crédits
          </a>
          <a href="#" className="hover:text-blue-800">
            FAQ
          </a>
          <a href="#" className="hover:text-blue-800">
            CGV
          </a>
          <span className="text-white">© 2025 InnovaLearn</span>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
