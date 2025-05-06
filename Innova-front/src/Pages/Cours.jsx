import React, { useState } from "react";
import { FaSearch, FaStar, FaChevronRight } from "react-icons/fa";
import photo1 from "../assets/ang.jpg";
import photo2 from "../assets/maths.jpg";
import photo3 from "../assets/photo3.jpg";
import photo4 from "../assets/philo.jpg";
import photo5 from "../assets/svt.jpg";
import photo6 from "../assets/hist.jpg";
import { Link } from "react-router-dom";

const Cours = () => {
  const allCourses = [
    {
      id: 1,
      title: "Mathématiques Terminale",
      category: "Scientifique",
      level: "Avancé",
      description:
        "Maîtrisez les concepts clés des mathématiques de terminale avec nos professeurs expérimentés.",
      duration: "20h",
      students: "1250",
      rating: 4.9,
      price: "25€/h",
      image: photo2,
    },
    {
      id: 2,
      title: "Anglais B2-C1",
      category: "Langues",
      level: "Intermédiaire",
      description:
        "Améliorez votre fluidité et préparez-vous aux certifications internationales.",
      duration: "30h",
      students: "980",
      rating: 4.8,
      price: "20€/h",
      image: photo1,
    },
    {
      id: 3,
      title: "Physique-Chimie Première",
      category: "Scientifique",
      level: "Intermédiaire",
      description:
        "Approfondissez votre compréhension des phénomènes physiques et chimiques.",
      duration: "25h",
      students: "750",
      rating: 4.7,
      price: "22€/h",
      image: photo3,
    },
    {
      id: 4,
      title: "Philosophie Terminale",
      category: "Littéraire",
      level: "Tous niveaux",
      description:
        "Découvrez les grands penseurs et préparez votre bac philo avec succès.",
      duration: "15h",
      students: "620",
      rating: 4.6,
      price: "18€/h",
      image: photo4,
    },
    {
      id: 5,
      title: "Histoire-Géographie",
      category: "Humanités",
      level: "Tous niveaux",
      description:
        "Parcourez les grands événements historiques et les enjeux géopolitiques actuels.",
      duration: "18h",
      students: "540",
      rating: 4.5,
      price: "16€/h",
      image: photo6,
    },
    {
      id: 6,
      title: "SVT Terminale",
      category: "Scientifique",
      level: "Avancé",
      description:
        "Approfondissez vos connaissances en biologie et géologie pour le bac.",
      duration: "22h",
      students: "680",
      rating: 4.7,
      price: "21€/h",
      image: photo5,
      featured: true,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = [
    "Tous",
    "Scientifique",
    "Langues",
    "Littéraire",
    "Humanités",
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchCategory =
      selectedCategory === "Tous" || course.category === selectedCategory;
    const matchSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredCourses = allCourses.filter((course) => course.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 mt-20">Nos Cours de Soutien</h1>
          <p className="text-lg mb-6">
            Trouvez le professeur idéal pour progresser dans toutes les matières
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Rechercher un cours, une matière, un niveau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full bg-white text-gray-800 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="container mx-auto px-4 py-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">Catégories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Cours à la Une */}
      {featuredCourses.length > 0 && (
        <section className="container mx-auto px-4 py-8 ">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            Cours à la Une
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-300"
              >
                <div className="h-100 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      À la Une
                    </span>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="text-gray-800 font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.description.slice(0, 60)}...
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm font-bold text-blue-600">
                      {course.price}
                    </span>
                    <Link
                      to="/details"
                      className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center text-sm"
                    >
                      Voir <FaChevronRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Liste filtrée */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-6">Cours disponibles</h2>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="h-100 w-auto overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="text-gray-800 font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-blue-600">
                      {course.price}
                    </span>
                    <Link
                      to="/details"
                      className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center"
                    >
                      Voir détails <FaChevronRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-8">
            Aucun cours trouvé pour votre recherche.
          </p>
        )}
      </section>
    </div>
  );
};

export default Cours;
