import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaMapMarkerAlt, FaGraduationCap, FaPhone, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import Api from "../Services/Api";
import defaultProfile from "../assets/lori.jpg";

const Repetiteurs = () => {
  const [repetiteurs, setRepetiteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("Toutes");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");

  useEffect(() => {
    fetchRepetiteurs();
  }, []);

  const fetchRepetiteurs = async () => {
    try {
      setLoading(true);
      const response = await Api.get("/api/repetiteurs");
      
      // Adapter selon la structure de votre réponse API
      const repetiteursData = response.data.data || response.data;
      
      console.log("Données répétiteurs:", repetiteursData); // Pour debug

      setRepetiteurs(repetiteursData);
    } catch (error) {
      console.error("Erreur lors du chargement des répétiteurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extraire les matières uniques pour les filtres
  const matieres = ["Toutes", ...new Set(
    repetiteurs.flatMap(rep => 
      rep.matieres?.map(m => typeof m === 'object' ? m.nom : m) || []
    )
  )];

  // Extraire les niveaux uniques pour les filtres
  const niveaux = ["Tous", ...new Set(
    repetiteurs.map(rep => rep.niveaux_enseignes || rep.niveau_principal).filter(Boolean)
  )];

  const filteredRepetiteurs = repetiteurs.filter((repetiteur) => {
    const matchesSearch = 
      repetiteur.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repetiteur.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repetiteur.matieres?.some(matiere => 
        (typeof matiere === 'object' ? matiere.nom : matiere)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    
    const matchesMatiere = 
      selectedMatiere === "Toutes" || 
      repetiteur.matieres?.some(matiere => 
        (typeof matiere === 'object' ? matiere.nom : matiere) === selectedMatiere
      );
    
    const matchesNiveau = 
      selectedNiveau === "Tous" || 
      (repetiteur.niveaux_enseignes || repetiteur.niveau_principal) === selectedNiveau;

    return matchesSearch && matchesMatiere && matchesNiveau;
  });

  const getNoteMoyenne = (repetiteur) => {
    return repetiteur.note_moyenne || 4.5;
  };

  const getStatutBadge = (statut) => {
    const statuts = {
      verifie: { class: "bg-green-100 text-green-800", text: "Vérifié" },
      en_attente: { class: "bg-yellow-100 text-yellow-800", text: "En attente" },
      non_verifie: { class: "bg-gray-100 text-gray-800", text: "Non vérifié" }
    };
    
    const config = statuts[statut] || { class: "bg-gray-100 text-gray-800", text: statut };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des répétiteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 mt-20">
            Nos Répétiteurs Qualifiés
          </h1>
          <p className="text-lg mb-6">
            Découvrez nos enseignants expérimentés pour progresser dans toutes les matières
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Rechercher un répétiteur, une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full bg-white text-gray-800 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par matière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière
            </label>
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {matieres.map((matiere) => (
                <option key={matiere} value={matiere}>
                  {matiere}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par niveau */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau
            </label>
            <select
              value={selectedNiveau}
              onChange={(e) => setSelectedNiveau(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {niveaux.map((niveau) => (
                <option key={niveau} value={niveau}>
                  {niveau}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton réinitialiser */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedMatiere("Toutes");
                setSelectedNiveau("Tous");
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </section>

      {/* Liste des répétiteurs */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Répétiteurs disponibles ({filteredRepetiteurs.length})
          </h2>
        </div>

        {filteredRepetiteurs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepetiteurs.map((repetiteur) => (
              <div
                key={repetiteur.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* En-tête avec photo et statut */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FaGraduationCap className="text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold">
                        {repetiteur.user?.prenom} {repetiteur.user?.nom}
                      </h3>
                      <div className="mt-2">
                        {getStatutBadge(repetiteur.statut_verif)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations du répétiteur */}
                <div className="p-6">
                  {/* Note et expérience */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-semibold">
                        {getNoteMoyenne(repetiteur).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {repetiteur.experience_annees || "2+"} ans d'exp.
                    </span>
                  </div>

                  {/* Matières */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Matières enseignées:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {repetiteur.matieres?.slice(0, 3).map((matiere, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                        >
                          {typeof matiere === 'object' ? matiere.nom : matiere}
                        </span>
                      ))}
                      {repetiteur.matieres?.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{repetiteur.matieres.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Niveaux et localisation */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaGraduationCap className="mr-2" />
                      <span>{repetiteur.niveaux_enseignes || repetiteur.niveau_principal || "Tous niveaux"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>Rayon: {repetiteur.rayon_intervention || "Non spécifié"} km</span>
                    </div>
                  </div>

                  {/* Contact et tarif */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {repetiteur.tarif_horaire || "25"} FCFA/h
                      </div>
                      <div className="text-xs text-gray-500">
                        {repetiteur.user?.telephone && (
                          <div className="flex items-center">
                            <FaPhone className="mr-1" />
                            {repetiteur.user.telephone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/repetiteur/${repetiteur.id}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Voir profil
                      </Link>
                      {repetiteur.user?.email && (
                        <a
                          href={`mailto:${repetiteur.user.email}`}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Contacter par email"
                        >
                          <FaEnvelope />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Aucun répétiteur trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Aucun répétiteur ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMatiere("Toutes");
                  setSelectedNiveau("Tous");
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Réinitialiser la recherche
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Repetiteurs;