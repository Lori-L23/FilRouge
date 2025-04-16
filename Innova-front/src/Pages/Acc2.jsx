import React, { useState } from "react";
import {
  FaSearch,
  FaStar,
  FaQuoteLeft,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Accueil = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données des cours populaires (adaptées à la maquette)
  const popularCourses = [
    {
      id: 1,
      title: "Mathématiques",
      description:
        "Bloceront les mathématiques à travers des zones sur toutes angles à votre niveau.",
      icon: "🧮",
    },
    {
      id: 2,
      title: "Anglais",
      description:
        "Antiflorent votre anglais avec des cours pratiques qui entraînent votre volontaire, grammaire et compréhension orale.",
      icon: "🇬🇧",
    },
    {
      id: 3,
      title: "Physique",
      description:
        "Explorer la biens de la physique une de ceux où on s'interroge. De la mécanique ? Réscemment bien.",
      icon: "⚛️",
    },
  ];

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: "Vincent",
      course: "Mathématiques",
      text: "Les cours de maths m'ont aidé à comprendre des concepts difficiles, peuvent l'aigleur en la question. Mes relations sont ambitieux et je ne veux plus faire voir un matelier.",
    },
  ];

  // Statistiques
  const stats = [
    { value: "3 millions", label: "élèves satisfaits" },
    { value: "50 000", label: "nouveaux étudiants/mois" },
  ];

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trouvez le cours de répétition qui vous convient
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore les cours de "Mafia"
          </p>

          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            COURS POPULAIRES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Ces élèves ont commencé comme vous
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            3 millions d'élèves ont déjà atteint leur objectif
          </p>

          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaChalkboardTeacher className="text-blue-600 text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  {testimonials[0].name}
                </h4>
                <p className="text-gray-600">
                  Apprend les {testimonials[0].course}
                </p>
              </div>
            </div>
            <FaQuoteLeft className="text-gray-300 text-3xl mb-4" />
            <p className="text-gray-700 text-lg mb-6">
              "{testimonials[0].text}"
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl text-gray-600 mb-8">
            Plus de 50 000 étudiants nous rejoignent chaque mois
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-12 max-w-2xl mx-auto">
            Atteignez vos objectifs. Avec nos professeurs, vos rêves sont à
            portée de main !
          </h2>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-colors mb-16">
            Trouver mon professeur
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Innovation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Navigation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Course
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Contenu
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Qui nommer accès?
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Pourquoi mieux choisir?
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Enfin ?
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Intrauterie</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Toutes les cas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Tenseignement
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Légende claire</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300">
                    Tensevisage
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="mb-4">
              1. Éducation alimentée pour un monde ou continuité individuel
            </p>
            <p className="text-sm">
              PAS : contact : CPS - Coûts de recherche et communication - Nombre
              régime - Recrutements - Contrôle : 2022/5-08/10 (voir fondation)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Accueil;
