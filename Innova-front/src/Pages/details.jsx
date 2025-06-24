import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaClock, FaChevronLeft } from "react-icons/fa";
import photo1 from "../assets/ang.jpg";
import photo2 from "../assets/maths.jpg";
import photo3 from "../assets/photo3.jpg";
import photo4 from "../assets/philo.jpg";
import photo5 from "../assets/svt.jpg";
import photo6 from "../assets/hist.jpg";
import Icon from "../assets/icon.png";

const Detailscours = () => {
  const { id } = useParams();
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

  // Chargement des données du cours
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const allCourses = [
          {
            id: 1,
            title: "Mathématiques Terminale",
            category: "Scientifique",
            level: "Avancé",
            description:
              "Maîtrisez les concepts clés des mathématiques de terminale avec nos professeurs expérimentés. Ce cours couvre l'algèbre, l'analyse, les probabilités et la géométrie.",
            fullDescription:
              "Ce cours complet de mathématiques pour terminale est conçu pour vous préparer aux examens finaux et aux études supérieures. Nous abordons en détail :\n\n- Les fonctions exponentielles et logarithmiques\n- Les suites et limites\n- La dérivation et ses applications\n- Les intégrales et calculs d'aires\n- Les probabilités conditionnelles\n- La géométrie dans l'espace\n\nChaque chapitre comprend des exercices pratiques et des problèmes types bac.",
            duration: "20h",
            students: "1250",
            rating: 4.9,
            price: "25€/h",
            image: photo2,
            featured: true,
            chapters: [
              {
                title: "Algèbre",
                duration: "5h",
                objectives: [
                  "Fonctions exponentielles",
                  "Logarithmes",
                  "Équations",
                ],
              },
              {
                title: "Analyse",
                duration: "8h",
                objectives: [
                  "Suites numériques",
                  "Limites",
                  "Dérivation",
                  "Intégrales",
                ],
              },
              {
                title: "Probabilités",
                duration: "4h",
                objectives: [
                  "Probabilités conditionnelles",
                  "Lois binomiales",
                  "Intervalle de fluctuation",
                ],
              },
              {
                title: "Géométrie",
                duration: "3h",
                objectives: [
                  "Géométrie vectorielle",
                  "Produit scalaire",
                  "Géométrie dans l'espace",
                ],
              },
            ],
            teacher: {
              name: "Prof. Dupont",
              bio: "Enseignant en mathématiques depuis 15 ans, ancien examinateur au baccalauréat. Diplômé de l'École Normale Supérieure.",
              rating: 4.8,
              experience: "15 ans",
              coursesTaught: 42,
              avatar: Icon,
            },
            prerequisites: [
              "Bases des mathématiques de première",
              "Calcul algébrique",
            ],
            materials: ["Calculatrice scientifique", "Cahier d'exercices"],
          },
          {
            id: 2,
            title: "Anglais B2-C1",
            category: "Langues",
            level: "Intermédiaire",
            description:
              "Améliorez votre fluidité et préparez-vous aux certifications internationales.",
            fullDescription:
              "Ce cours d'anglais avancé vise à vous amener au niveau C1 du CECRL. Vous travaillerez :\n\n- La compréhension orale et écrite\n- L'expression orale (débats, présentations)\n- La rédaction formelle et informelle\n- La grammaire avancée\n- Le vocabulaire technique\n\nPréparation aux tests : TOEFL, IELTS, Cambridge English.",
            duration: "30h",
            students: "980",
            rating: 4.8,
            price: "20€/h",
            image: photo1,
            chapters: [
              {
                title: "Grammaire avancée",
                duration: "6h",
                objectives: ["Temps verbaux complexes", "Modaux", "Subjonctif"],
              },
              {
                title: "Expression orale",
                duration: "8h",
                objectives: ["Débats", "Présentations", "Prononciation"],
              },
              {
                title: "Compréhension",
                duration: "7h",
                objectives: [
                  "Documents authentiques",
                  "Conférences",
                  "Articles académiques",
                ],
              },
              {
                title: "Rédaction",
                duration: "5h",
                objectives: [
                  "Essais argumentés",
                  "Lettres formelles",
                  "Rapports",
                ],
              },
              {
                title: "Préparation aux tests",
                duration: "4h",
                objectives: [
                  "Stratégies d'examen",
                  "Tests blancs",
                  "Gestion du temps",
                ],
              },
            ],
            teacher: {
              name: "Prof. Smith",
              bio: "Native speaker, enseignante diplômée (CELTA) avec 10 ans d'expérience dans la préparation aux examens internationaux.",
              rating: 4.9,
              experience: "10 ans",
              coursesTaught: 35,
              avatar: Icon,
            },
            prerequisites: ["Niveau B1 minimum", "Bases grammaticales"],
            materials: ["Dictionnaire bilingue", "Support audio"],
          },
          {
            id: 3,
            title: "Physique-Chimie Première",
            category: "Scientifique",
            level: "Intermédiaire",
            description:
              "Approfondissez votre compréhension des phénomènes physiques et chimiques.",
            fullDescription:
              "Programme complet couvrant les thèmes au programme de première :\n\n- Les transformations chimiques\n- Les mouvements et interactions\n- Les ondes et signaux\n- Les conversions d'énergie\n\nMéthode scientifique, expérimentation virtuelle et résolution de problèmes complexes.",
            duration: "25h",
            students: "750",
            rating: 4.7,
            price: "22€/h",
            image: photo3,
            chapters: [
              {
                title: "Chimie",
                duration: "10h",
                objectives: [
                  "Réactions chimiques",
                  "Transformations",
                  "Solutions aqueuses",
                ],
              },
              {
                title: "Mécanique",
                duration: "8h",
                objectives: ["Mouvements", "Forces", "Énergie mécanique"],
              },
              {
                title: "Ondes",
                duration: "4h",
                objectives: ["Ondes mécaniques", "Lumière", "Signaux"],
              },
              {
                title: "TP Virtuels",
                duration: "3h",
                objectives: [
                  "Manipulations",
                  "Analyse de données",
                  "Conclusion",
                ],
              },
            ],
            teacher: {
              name: "Prof. Martin",
              bio: "Docteur en physique, ancien chercheur au CNRS, passionné par la pédagogie scientifique.",
              rating: 4.7,
              experience: "12 ans",
              coursesTaught: 28,
              avatar: Icon,
            },
            prerequisites: [
              "Bases de physique-chimie seconde",
              "Calcul littéral",
            ],
            materials: ["Calculatrice", "Matériel de laboratoire virtuel"],
          },
          {
            id: 4,
            title: "Philosophie Terminale",
            category: "Littéraire",
            level: "Tous niveaux",
            description:
              "Découvrez les grands penseurs et préparez votre bac philo avec succès.",
            fullDescription:
              "Ce cours couvre les notions au programme et la méthodologie de la dissertation et de l'explication de texte. Thèmes abordés :\n\n- La conscience\n- La politique\n- La morale\n- La science\n- L'art\n\nÉtude des auteurs clés : Platon, Descartes, Kant, Nietzsche, Sartre...",
            duration: "15h",
            students: "620",
            rating: 4.6,
            price: "18€/h",
            image: photo4,
            chapters: [
              {
                title: "Les grands courants",
                duration: "3h",
                objectives: ["Idéalisme", "Empirisme", "Rationalisme"],
              },
              {
                title: "Notions clés",
                duration: "5h",
                objectives: ["Liberté", "Bonheur", "Justice", "Vérité"],
              },
              {
                title: "Méthodologie",
                duration: "4h",
                objectives: [
                  "Dissertation",
                  "Explication de texte",
                  "Argumentation",
                ],
              },
              {
                title: "Auteurs",
                duration: "3h",
                objectives: ["Textes clés", "Contexte historique", "Postérité"],
              },
            ],
            teacher: {
              name: "Prof. Rousseau",
              bio: "Agrégé de philosophie, ancien membre du jury du baccalauréat, spécialiste de la philosophie moderne.",
              rating: 4.5,
              experience: "18 ans",
              coursesTaught: 56,
              avatar: Icon,
            },
            prerequisites: ["Curiosité intellectuelle", "Ouverture d'esprit"],
            materials: ["Œuvres philosophiques", "Cahier de citations"],
          },
          {
            id: 5,
            title: "Histoire-Géographie",
            category: "Humanités",
            level: "Tous niveaux",
            description:
              "Parcourez les grands événements historiques et les enjeux géopolitiques actuels.",
            fullDescription:
              "Approche thématique et chronologique couvrant :\n\nHistoire :\n- Les régimes totalitaires\n- La décolonisation\n- La construction européenne\n\nGéographie :\n- La mondialisation\n- Les territoires\n- Le développement durable\n\nCartographie, analyse de documents et composition.",
            duration: "18h",
            students: "540",
            rating: 4.5,
            price: "16€/h",
            image: photo6,
            chapters: [
              {
                title: "Histoire contemporaine",
                duration: "6h",
                objectives: [
                  "Guerres mondiales",
                  "Totalitarismes",
                  "Décolonisation",
                ],
              },
              {
                title: "Géopolitique",
                duration: "5h",
                objectives: ["Mondialisation", "Conflits", "Organisations"],
              },
              {
                title: "Géographie",
                duration: "4h",
                objectives: ["Territoires", "Ressources", "Développement"],
              },
              {
                title: "Méthodologie",
                duration: "3h",
                objectives: ["Croquis", "Analyse de doc", "Composition"],
              },
            ],
            teacher: {
              name: "Prof. Leblanc",
              bio: "Docteur en histoire contemporaine, auteur de manuels scolaires, passionné par la pédagogie active.",
              rating: 4.6,
              experience: "20 ans",
              coursesTaught: 62,
              avatar: Icon,
            },
            prerequisites: ["Connaissances de base", "Esprit de synthèse"],
            materials: ["Atlas", "Frise chronologique"],
          },
          {
            id: 6,
            title: "SVT Terminale",
            category: "Scientifique",
            level: "Avancé",
            description:
              "Approfondissez vos connaissances en biologie et géologie pour le bac.",
            fullDescription:
              "Cours complet couvrant :\n\nBiologie :\n- Génétique et évolution\n- Écosystèmes\n- Neurone et fibre musculaire\n\nGéologie :\n- Tectonique des plaques\n- Géothermie\n\nTP virtuels, analyse de données scientifiques et préparation à l'épreuve pratique.",
            duration: "22h",
            students: "680",
            rating: 4.7,
            price: "21€/h",
            image: photo5,
            chapters: [
              {
                title: "Génétique",
                duration: "6h",
                objectives: ["ADN", "Hérédité", "Évolution"],
              },
              {
                title: "Écologie",
                duration: "5h",
                objectives: ["Écosystèmes", "Biodiversité", "Enjeux"],
              },
              {
                title: "Géologie",
                duration: "4h",
                objectives: ["Tectonique", "Risques", "Ressources"],
              },
              {
                title: "Physiologie",
                duration: "5h",
                objectives: ["Système nerveux", "Muscle", "Homéostasie"],
              },
              {
                title: "TP",
                duration: "2h",
                objectives: ["Protocoles", "Observations", "Conclusions"],
              },
            ],
            teacher: {
              name: "Prof. Garnier",
              bio: "Biologiste spécialisée en neurosciences, ancienne chercheuse à l'INSERM, médiatrice scientifique.",
              rating: 4.8,
              experience: "14 ans",
              coursesTaught: 39,
              avatar: Icon,
            },
            prerequisites: ["Bases de SVT première", "Méthode scientifique"],
            materials: ["Microscope virtuel", "Clé de détermination"],
          },
        ];

        const foundCourse = allCourses.find((c) => c.id === parseInt(id));
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          setError("Cours non trouvé");
        }
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement du cours");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubscriptionSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setShowModal(false);
        setSubscriptionSuccess(false);
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          email: "",
          phone: "",
          level: "",
          paymentMethod: "card",
        });
      }, 3000);
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!course) return <div className="text-center py-20">Cours non trouvé</div>;

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
                className="w-full h-180 rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {course.category}
              </span>
              <h1 className="text-3xl font-bold mt-12 mb-8">{course.title}</h1>
              <p className="text-gray-600 mb-6">
                {course.fullDescription || course.description}
              </p>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-6">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">
                    {course.rating} ({course.students} élèves)
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-500 mr-1" />
                  <span>{course.duration} de cours</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">
                  À propos du professeur
                </h3>
                <div className="flex items-center">
                  <img
                    src={course.teacher?.avatar || Icon}
                    alt="Professeur"
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {course.teacher?.name || "Professeur expérimenté"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {course.teacher?.bio ||
                        "Spécialiste dans cette matière depuis plusieurs années"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-14">
                <span className="text-2xl font-bold text-blue-600">
                  {course.price}
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
          <h2 className="text-2xl font-bold mb-6">Contenu du cours</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {course.chapters?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {course.chapters.map((chapter, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full mr-4">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-medium">{chapter.title}</span>
                          {chapter.objectives && (
                            <p className="text-sm text-gray-500 mt-1">
                              {chapter.objectives.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {chapter.duration}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Programme détaillé à venir
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Avis des élèves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Jean M.</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 mr-1" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Excellent cours qui m'a permis de progresser rapidement. Les
                explications sont claires et les exercices bien choisis."
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="bg-gray-300 w-10 h-10 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Sophie L.</p>
                  <div className="flex items-center">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 mr-1" />
                    ))}
                    <FaStar className="text-gray-300 mr-1" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Très bon professeur, mais j'aurais aimé plus d'exercices
                pratiques sur certains chapitres."
              </p>
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
                    Inscription réussie !
                  </h4>
                  <p className="text-gray-600">
                    Vous êtes maintenant inscrit à ce cours. Un email de
                    confirmation vous a été envoyé.
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
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="level"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Votre niveau *
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Méthode de paiement *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Carte bancaire
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="transfer"
                            checked={formData.paymentMethod === "transfer"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Virement bancaire
                          </span>
                        </label>
                      </div>
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
                            Traitement...
                          </>
                        ) : (
                          "Confirmer l'inscription"
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
