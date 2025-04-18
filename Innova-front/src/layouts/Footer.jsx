import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import logofooter from "../assets/Log.png";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <section className="flex flex-col items-center pb-12 border-b border-white border-opacity-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 max-w-2xl">
            L'éducation réinventée pour un monde en constante évolution!
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl">
            <input
              type="email"
              placeholder="Une newsletter branchée pour rester au courant ⚡"
              className="flex-grow px-6 py-4 text-gray-800 bg-white bg-opacity-90 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-500"
            />
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center">
              Je m'abonne <FaArrowRight className="ml-2" />
            </button>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-white border-opacity-20">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center ">
              <h1 className="text-3xl font-bold text-white">InnovaLearn</h1>
              {/* <img src={logofooter} alt="logfooter" /> */}
            </Link>
            <p className="mt-4 text-white text-opacity-90">
              Apprenez aujourd'hui, innovez demain!
            </p>
            
            <div className="flex gap-4 mt-6 text-xl">
              <a href="#" className="text-white hover:text-blue-300 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Accueil</Link></li>
                <li><Link to="/cours" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Cours</Link></li>
                <li><Link to="/contact" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">À Propos</h3>
              <ul className="space-y-3">
                <li><Link to="/apropos" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Qui sommes-nous?</Link></li>
                <li><Link to="/valeurs" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Pourquoi nous choisir?</Link></li>
                <li><Link to="/equipe" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Équipe</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Ressources</h3>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Blog</Link></li>
                <li><Link to="/temoignages" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">Témoignages</Link></li>
                <li><Link to="/faq" className="text-white text-opacity-80 hover:text-opacity-100 hover:text-blue-200 transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom Bar */}
        <section className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white text-opacity-70">
              © {new Date().getFullYear()} InnovaLearn. Tous droits réservés.
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/confidentialite" className="text-white text-opacity-70 hover:text-opacity-100 hover:text-blue-200 transition-colors">
                Confidentialité
              </Link>
              <Link to="/mentions" className="text-white text-opacity-70 hover:text-opacity-100 hover:text-blue-200 transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgu" className="text-white text-opacity-70 hover:text-opacity-100 hover:text-blue-200 transition-colors">
                CGU
              </Link>
              <Link to="/contact" className="text-white text-opacity-70 hover:text-opacity-100 hover:text-blue-200 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;