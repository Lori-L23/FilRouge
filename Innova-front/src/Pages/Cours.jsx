import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaChevronRight, FaUsers, FaClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Services/Api";

// Import des images
import mathsImage from "../assets/maths.jpg";
import angImage from "../assets/ang.jpg";
import photo3Image from "../assets/photo3.jpg";
import philoImage from "../assets/philo.jpg";
import svtImage from "../assets/svt.jpg";
import histImage from "../assets/hist.jpg";

const Cours = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/api/cours");

      const coursesData = response.data.data || response.data;

      const formattedCourses = coursesData.map(course => ({
        id: course.id,
        title: course.titre || course.nom,
        category: course.matiere?.nom || course.categorie || "Général",
        level: course.niveau_scolaire || "Tous niveaux",
        description: course.description || "Description non disponible",
        duration: course.duree_heures ? `${course.duree_heures}h` : "Non spécifié",
        students: course.nombre_eleves || Math.floor(Math.random() * 1000),
        rating: course.note_moyenne || (4 + Math.random()).toFixed(1),
        price: course.tarif_horaire ? `${course.tarif_horaire} FCFA/h` : "Prix non spécifié",
        image: getCourseImage(course.matiere?.nom || course.categorie),
        featured: course.featured || Math.random() > 0.7,
        repetiteur: course.repetiteur || null,
        places_disponibles: course.places_disponibles || Math.floor(Math.random() * 20) + 5,
        statut: course.statut || "actif"
      }));

      setAllCourses(formattedCourses);
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour naviguer vers les détails d'un cours
  const handleCourseDetails = (courseId) => {
    navigate(`/detailscours/${courseId}`);
  };

  // Fonction pour naviguer vers le profil d'un répétiteur
  const handleRepetiteurProfile = (repetiteurId) => {
    if (repetiteurId) {
      navigate(`/repetiteur/${repetiteurId}`);
    }
  };

  // Fonction corrigée pour obtenir l'image
  const getCourseImage = (matiere) => {
    const imageMap = {
      "Mathématiques": mathsImage,
      "Anglais": angImage,
      "Physique": photo3Image,
      "Chimie": photo3Image,
      "Philosophie": philoImage,
      "SVT": svtImage,
      "Histoire": histImage,
      "Géographie": histImage,
      "Français": photo3Image
    };

    return imageMap[matiere] || photo3Image;
  };

  const categories = ["Tous", ...new Set(allCourses.map(course => course.category))];

  const filteredCourses = allCourses.filter((course) => {
    const matchCategory = selectedCategory === "Tous" || course.category === selectedCategory;
    const matchSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredCourses = allCourses.filter((course) => course.featured);
  const availableCourses = allCourses.filter((course) => course.statut === "actif");

  const getDisponibilityBadge = (places) => {
    if (places > 10) return "bg-green-100 text-green-800";
    if (places > 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 mt-20">
            Nos Cours de Soutien
          </h1>
          <p className="text-lg mb-6">
            {availableCourses.length} cours disponibles avec nos professeurs qualifiés
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

      {/* Statistiques rapides */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{availableCourses.length}</div>
            <div className="text-sm text-gray-600">Cours disponibles</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {categories.length - 1}
            </div>
            <div className="text-sm text-gray-600">Matières</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(allCourses.map(c => c.repetiteur?.id)).size}
            </div>
            <div className="text-sm text-gray-600">Professeurs</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {allCourses.reduce((sum, course) => sum + course.students, 0)}
            </div>
            <div className="text-sm text-gray-600">Élèves formés</div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="container mx-auto px-4 py-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">Filtrer par matière</h2>
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
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            Cours à la Une
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-300"
              >
                <div className="h-48 w-full overflow-hidden">
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
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${getDisponibilityBadge(course.places_disponibles)}`}>
                        {course.places_disponibles} places
                      </span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="text-gray-800 font-medium">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {course.description.slice(0, 60)}...
                  </p>
                  
                  {/* Informations du professeur */}
                  {course.repetiteur && (
                    <div className="mb-3">
                      <button
                        onClick={() => handleRepetiteurProfile(course.repetiteur.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        👨‍🏫 Par: {course.repetiteur.user?.prenom} {course.repetiteur.user?.nom}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm font-bold text-blue-600">
                      {course.price}
                    </span>
                    <button
                      onClick={() => handleCourseDetails(course.id)}
                      className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center text-sm"
                    >
                      Voir détails <FaChevronRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tous les cours disponibles */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-6">
          Tous les cours disponibles ({filteredCourses.length})
        </h2>
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="h-48 w-full overflow-hidden">
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
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${getDisponibilityBadge(course.places_disponibles)}`}>
                        {course.places_disponibles} places
                      </span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span className="text-gray-800 font-medium">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {course.description}
                  </p>

                  {/* Informations supplémentaires */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{course.students} élèves</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Professeur cliquable */}
                  {course.repetiteur && (
                    <div className="mb-3">
                      <button
                        onClick={() => handleRepetiteurProfile(course.repetiteur.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        <span className="mr-1">👨‍🏫</span>
                        Par: {course.repetiteur.user?.prenom} {course.repetiteur.user?.nom}
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-blue-600">
                      {course.price}
                    </span>
                    <div className="flex space-x-2">
                      {course.repetiteur && (
                        <button
                          onClick={() => handleRepetiteurProfile(course.repetiteur.id)}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                          title="Voir le professeur"
                        >
                          Prof
                        </button>
                      )}
                      <button
                        onClick={() => handleCourseDetails(course.id)}
                        className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center text-sm"
                      >
                        Détails <FaChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Aucun cours trouvé pour votre recherche.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tous");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cours;