import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaClock, FaChevronLeft, FaUsers, FaGraduationCap } from "react-icons/fa";
import Api from "../Services/Api";

// Import des images
import mathsImage from "../assets/maths.jpg";
import angImage from "../assets/ang.jpg";
import photo3Image from "../assets/photo3.jpg";
import philoImage from "../assets/philo.jpg";
import svtImage from "../assets/svt.jpg";
import histImage from "../assets/hist.jpg";
import Icon from "../assets/icon.png";

const Detailscours = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    paymentMethod: "card",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Chargement des données du cours depuis l'API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await Api.get(`/api/cours/${id}`);
        
        const courseData = response.data.data || response.data;
        
        // Transformer les données de l'API pour correspondre à la structure attendue
        const formattedCourse = {
          id: courseData.id,
          title: courseData.titre || courseData.nom,
          category: courseData.matiere?.nom || courseData.categorie || "Général",
          level: courseData.niveau_scolaire || "Tous niveaux",
          description: courseData.description || "Description non disponible",
          fullDescription: courseData.description_complete || courseData.description || "Description détaillée non disponible",
          duration: courseData.duree_heures ? `${courseData.duree_heures}h` : "Non spécifié",
          students: courseData.nombre_eleves || Math.floor(Math.random() * 1000),
          rating: courseData.note_moyenne || (4 + Math.random()).toFixed(1),
          price: courseData.tarif_horaire ? `${courseData.tarif_horaire} FCFA/h` : "Prix non spécifié",
          image: getCourseImage(courseData.matiere?.nom || courseData.categorie),
          featured: courseData.featured || false,
          repetiteur: courseData.repetiteur || null,
          places_disponibles: courseData.places_disponibles || Math.floor(Math.random() * 20) + 5,
          statut: courseData.statut || "actif",
          // Chapitres simulés basés sur les données disponibles
          chapters: courseData.chapitres || generateChapters(courseData),
          teacher: courseData.repetiteur ? {
            name: `${courseData.repetiteur.user?.prenom || ''} ${courseData.repetiteur.user?.nom || ''}`.trim(),
            bio: courseData.repetiteur.bio || "Professeur expérimenté dans cette matière",
            rating: courseData.repetiteur.note_moyenne || 4.5,
            experience: courseData.repetiteur.experience_annees ? `${courseData.repetiteur.experience_annees} ans` : "Plusieurs années",
            coursesTaught: courseData.repetiteur.nombre_cours || Math.floor(Math.random() * 50) + 10,
            avatar: Icon,
          } : {
            name: "Professeur expérimenté",
            bio: "Spécialiste dans cette matière depuis plusieurs années",
            rating: 4.5,
            experience: "Plusieurs années",
            coursesTaught: Math.floor(Math.random() * 50) + 10,
            avatar: Icon,
          },
          prerequisites: courseData.prerequis || ["Bases dans la matière", "Motivation"],
          materials: courseData.materiel_requis || ["Matériel de prise de notes", "Connexion internet"]
        };

        setCourse(formattedCourse);
      } catch (err) {
        console.error("Erreur lors du chargement du cours:", err);
        setError("Erreur lors du chargement du cours");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Fonction pour générer des chapitres basés sur le cours
  const generateChapters = (courseData) => {
    const baseChapters = [
      {
        title: "Introduction et bases",
        duration: "2h",
        objectives: ["Découverte du sujet", "Concepts fondamentaux", "Méthodologie"]
      },
      {
        title: "Développement des compétences",
        duration: "4h",
        objectives: ["Exercices pratiques", "Applications concrètes", "Résolution de problèmes"]
      },
      {
        title: "Approfondissement",
        duration: "3h",
        objectives: ["Concepts avancés", "Cas complexes", "Synthèse"]
      },
      {
        title: "Préparation et révision",
        duration: "2h",
        objectives: ["Révision générale", "Tests pratiques", "Conseils méthodologiques"]
      }
    ];

    return baseChapters.map(chapter => ({
      ...chapter,
      duration: courseData.duree_heures ? `${Math.floor(courseData.duree_heures / baseChapters.length)}h` : chapter.duration
    }));
  };

  // Fonction pour obtenir l'image du cours
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Appel API pour l'inscription
      const response = await Api.post("/api/reservations", {
        cours_id: course.id,
        eleve_id: formData.name, // À remplacer par l'ID de l'élève connecté
        date_reservation: new Date().toISOString(),
        statut: "en_attente",
        informations_contact: {
          nom: formData.name,
          email: formData.email,
          telephone: formData.phone,
          niveau: formData.level
        }
      });

      if (response.data.success) {
        setSubscriptionSuccess(true);
      } else {
        throw new Error(response.data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRepetiteurProfile = () => {
    if (course.repetiteur?.id) {
      navigate(`/repetiteur/${course.repetiteur.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/cours"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux cours
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Cours non trouvé</p>
          <Link
            to="/cours"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux cours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/cours"
            className="flex items-center mt-20 text-blue-600 hover:text-blue-800"
          >
            <FaChevronLeft className="mr-2" /> Retour aux cours
          </Link>
        </div>
      </div>

      {/* Course Hero Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  course.places_disponibles > 10 
                    ? "bg-green-100 text-green-800" 
                    : course.places_disponibles > 5 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {course.places_disponibles} places disponibles
                </span>
              </div>

              <h1 className="text-3xl font-bold mt-4 mb-6">{course.title}</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {course.fullDescription}
              </p>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">
                    {course.rating} 
                  </span>
                </div>
                <div className="flex items-center mr-6">
                  <FaUsers className="text-gray-500 mr-1" />
                  <span>{course.students} élèves</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Informations du professeur */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-3">
                  À propos du professeur
                </h3>
                <div className="flex items-center">
                  <img
                    src={course.teacher.avatar}
                    alt="Professeur"
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{course.teacher.name}</p>
                        <p className="text-sm text-gray-600">
                          {course.teacher.bio}
                        </p>
                      </div>
                      <button
                        onClick={handleViewRepetiteurProfile}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir profil
                      </button>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-4">
                        <FaStar className="inline mr-1 text-yellow-500" />
                        {course.teacher.rating}
                      </span>
                      <span className="mr-4">
                        <FaGraduationCap className="inline mr-1" />
                        {course.teacher.experience}
                      </span>
                      <span>{course.teacher.coursesTaught} cours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-blue-600 block">
                    {course.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Tarif horaire
                  </span>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  S'inscrire au cours
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Programme du cours</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {course.chapters?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {course.chapters.map((chapter, index) => (
                  <li key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full mr-4 mt-1 flex-shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-lg mb-2">{chapter.title}</h4>
                          {chapter.objectives && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Objectifs :</p>
                              <ul className="text-sm text-gray-500 space-y-1">
                                {chapter.objectives.map((objective, objIndex) => (
                                  <li key={objIndex} className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex-shrink-0">
                        {chapter.duration}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FaGraduationCap className="text-4xl text-gray-300 mx-auto mb-4" />
                <p>Programme détaillé en cours de préparation</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Prerequisites and Materials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Prérequis</h3>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Matériel requis</h3>
              <ul className="space-y-2">
                {course.materials.map((material, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modal d'inscription */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Inscription à {course.title}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSubscriptionSuccess(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {subscriptionSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Demande d'inscription envoyée !
                  </h4>
                  <p className="text-gray-600">
                    Votre demande a été transmise au professeur. Vous recevrez une confirmation par email sous peu.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="level"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Votre niveau actuel *
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionnez votre niveau</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Traitement en cours...
                          </>
                        ) : (
                          "Envoyer la demande d'inscription"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detailscours;