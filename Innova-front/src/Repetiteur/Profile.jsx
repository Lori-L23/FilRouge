import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiSave,
  FiPhone,
  FiDollarSign,
  FiBook,
  FiX,
  FiStar,
  FiUsers,
  FiPlus,
  FiClock,
  FiTrash2,
  FiCalendar,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import defaultPhoto from "../assets/profile.jpg";

const ProfileRepetiteur = () => {
  const { user, profile, refetchUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    niveau_principal: "college/lycee",
    classes_college: [],
    biographie: "",
    tarif_horaire: "",
    rayon_intervention: 10,
    matieres: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddDispo, setShowAddDispo] = useState(false);
  const [cours, setCours] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);
  const [loadingCours, setLoadingCours] = useState(false);
  const [loadingDispos, setLoadingDispos] = useState(false);
  const [matieresEnseignees, setMatieresEnseignees] = useState([]);

  const [newCourse, setNewCourse] = useState({
    titre: "",
    description: "",
    matiere_id: "",
    niveau_scolaire: "college",
    tarif_horaire: "",
  });

  const [newDispo, setNewDispo] = useState({
    jour: "lundi",
    heure_debut: "08:00",
    heure_fin: "10:00",
  });

  // Options fixes
  const matieresOptions = [
    { id: 1, nom: "SVT" },
    { id: 2, nom: "Chimie" },
    { id: 3, nom: "Mathématiques" },
    { id: 4, nom: "Anglais" },
    { id: 5, nom: "Physique-Chimie" },
    { id: 6, nom: "Philosophie" },
    { id: 7, nom: "Histoire-Géographie" },
    { id: 8, nom: "Français" },
    { id: 9, nom: "Informatique" },
    { id: 10, nom: "Physique" },
    { id: 11, nom: "ECM" },
    { id: 11, nom: "Geographie" },

  ];

  const niveauxOptions = [
    { value: "primaire", label: "Primaire" },
    { value: "college/lycee", label: "Collège/Lycée" },
  ];

  const classesCollegeOptions = [
    { value: "6eme", label: "6ème" },
    { value: "5eme", label: "5ème" },
    { value: "4eme", label: "4ème" },
    { value: "3eme", label: "3ème" },
  ];

  const joursSemaine = [
    { value: "lundi", label: "Lundi" },
    { value: "mardi", label: "Mardi" },
    { value: "mercredi", label: "Mercredi" },
    { value: "jeudi", label: "Jeudi" },
    { value: "vendredi", label: "Vendredi" },
    { value: "samedi", label: "Samedi" },
    { value: "dimanche", label: "Dimanche" },
  ];

  // Initialiser les données
useEffect(() => {
  if (profile) {
    const loadData = async () => {
      await fetchMatieresEnseignees();


      
      let parsedClasses = [];
      try {
        parsedClasses = profile.classes_college 
          ? Array.isArray(profile.classes_college)
            ? profile.classes_college
            : typeof profile.classes_college === 'string' && profile.classes_college.startsWith('[')
              ? JSON.parse(profile.classes_college)
              : [profile.classes_college]
          : [];
      } catch (err) {
        console.error('Error parsing classes_college:', err);
        parsedClasses = [];
      }

      setFormData({
        niveau_principal: profile.niveau_principal || "college/lycee",
        classes_college: parsedClasses,
        biographie: profile.biographie || "",
        tarif_horaire: profile.tarif_horaire || "",
        rayon_intervention: profile.rayon_intervention || 10,
        matieres: [], // Rempli après fetchMatieresEnseignees
      });

      await fetchCours();
      await fetchDisponibilites();
    };

    loadData();
  }
}, [profile]);

  useEffect(() => {
    if (matieresEnseignees.length > 0) {
      setFormData((prev) => ({
        ...prev,
        matieres: matieresEnseignees.map((m) => m.id),
      }));
    }
  }, [matieresEnseignees]);

  const fetchMatieresEnseignees = async () => {
    try {
      const response = await Api.get(`/api/repetiteurs/${user.id}/matieres`);
      console.log("Réponse API matières:", response.data); // Debug
      if (response.data.success) {
        setMatieresEnseignees(response.data.data);
      }
    } catch (err) {
      console.error("Erreur chargement matières:", err);
    }
  };
  const fetchCours = async () => {
    setLoadingCours(true);
    try {
      const response = await Api.get(`/api/repetiteurs/${user.id}/cours`);
      // Adaptez les données reçues au format attendu par le composant
      const adaptedCourses = response.data.data.map((course) => ({
        id: course.id,
        titre: course.titre,
        description: course.description,
        matiere_id:
          matieresOptions.find(
            (m) => m.nom.toLowerCase() === course.matiere.toLowerCase()
          )?.id || 0,
        niveau_scolaire: course.niveau,
        tarif_horaire: parseFloat(course.tarif.replace("fcfa/h", "").trim()),
        matiere: course.matiere, // Ajouté pour l'affichage
      }));
      setCours(adaptedCourses);
    } catch (err) {
      console.error("Erreur chargement cours:", err);
    } finally {
      setLoadingCours(false);
    }
  };

  const fetchDisponibilites = async () => {
    setLoadingDispos(true);
    try {
      const response = await Api.get(
        `/api/disponibilites/repetiteurs/${user.id}/disponibilites`
      );
      setDisponibilites(response.data);
    } catch (err) {
      console.error("Erreur chargement disponibilités:", err);
    } finally {
      setLoadingDispos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e) => {
    const { name, options } = e.target;
    const selected = Array.from(options)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, [name]: selected }));
  };
  const validateFormData = (data) => {
  const errors = [];
  
  if (!data.niveau_principal) errors.push("Niveau principal requis");
  if (!data.biographie || data.biographie.length < 10) errors.push("Biographie trop courte");
  if (!data.tarif_horaire || isNaN(data.tarif_horaire)) errors.push("Tarif horaire invalide");
  if (!data.rayon_intervention || isNaN(data.rayon_intervention)) errors.push("Rayon d'intervention invalide");
  
  return errors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Préparation des données avec sérialisation robuste
    const dataToSend = {
      ...formData,
      classes_college: Array.isArray(formData.classes_college) 
        ? JSON.stringify(formData.classes_college)
        : '[]', // Fallback si ce n'est pas un tableau
      tarif_horaire: Number(formData.tarif_horaire) || 0,
      rayon_intervention: Number(formData.rayon_intervention) || 10
    };

    const response = await Api.put(`/api/repetiteurs/${user.id}`, dataToSend);
    await refetchUser();
    setEditMode(false);
  } catch (err) {
    console.error("Erreur mise à jour:", {
      error: err,
      response: err.response?.data
    });
    setError(err.response?.data?.message || "Erreur lors de la mise à jour");
  } finally {
    setLoading(false);
  }
};

  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.post(`/api/cours`, {
        ...newCourse,
        repetiteur_id: user.id,
      });
      await fetchCours();
      setNewCourse({
        titre: "",
        description: "",
        matiere_id: "",
        niveau_scolaire: "college",
        tarif_horaire: "",
      });
      setShowAddCourse(false);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur création cours");
    } finally {
      setLoading(false);
    }
  };

  const handleDispoInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDispo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Api.post(`/api/disponibilites`, {
        ...newDispo,
        repetiteur_id: user.id,
      });
      await fetchDisponibilites();
      setNewDispo({
        jour: "lundi",
        heure_debut: "08:00",
        heure_fin: "10:00",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur création disponibilité");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDispo = async (id) => {
    if (window.confirm("Supprimer cette disponibilité ?")) {
      try {
        await Api.delete(`/api/disponibilites/${id}`);
        await fetchDisponibilites();
      } catch (err) {
        setError(err.response?.data?.message || "Erreur suppression");
      }
    }
  };

  const formatHeure = (heure) => {
    return heure.slice(0, 5); // Format "HH:MM"
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <FaChalkboardTeacher className="mr-3 text-blue-600" />
          Mon Profil Répétiteur
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="text-red-700">
                <FiX />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Informations personnelles
                </h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiEdit className="mr-1" /> Modifier
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                  <img
                    src={profile.photo || defaultPhoto}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>{user.telephone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiBook className="mr-2 text-blue-600" />
                  <span>
                    Statut:{" "}
                    {profile.statut_verif === "verifie"
                      ? "Vérifié"
                      : "Non vérifié"}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Statistiques
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <FiBook className="mr-2" /> Cours créés
                  </span>
                  <span className="font-bold">{cours.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <FiStar className="mr-2" /> Note moyenne
                  </span>
                  <span className="font-bold">4.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <FiUsers className="mr-2" /> Élèves
                  </span>
                  <span className="font-bold">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Informations professionnelles, Cours et Disponibilités */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations professionnelles */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informations professionnelles
              </h2>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Niveau principal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau principal
                    </label>
                    <select
                      name="niveau_principal"
                      value={formData.niveau_principal}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      {niveauxOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Classes collège */}
                  {formData.niveau_principal === "college/lycee" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Classes enseignées (collège)
                      </label>
                      <select
                        multiple
                        name="classes_college"
                        value={formData.classes_college}
                        onChange={handleArrayChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                      >
                        {classesCollegeOptions.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Matières enseignées */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matières enseignées
                    </label>
                    <select
                      multiple
                      name="matieres"
                      value={formData.matieres}
                      onChange={handleArrayChange}
                      className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                      required
                    >
                      {matieresOptions.map((matiere) => (
                        <option key={matiere.id} value={matiere.id}>
                          {matiere.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tarif et Rayon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarif horaire (FCFA)
                      </label>
                      <input
                        type="number"
                        name="tarif_horaire"
                        value={formData.tarif_horaire}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rayon d'intervention (km)
                      </label>
                      <input
                        type="number"
                        name="rayon_intervention"
                        value={formData.rayon_intervention}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Biographie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biographie
                    </label>
                    <textarea
                      name="biographie"
                      value={formData.biographie}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md h-32"
                      placeholder="Décrivez votre expérience et méthodologie..."
                      required
                    />
                  </div>

                  {/* Boutons Sauvegarder / Annuler */}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962..."
                          />
                        </svg>
                      ) : (
                        <FiSave className="mr-2" />
                      )}
                      {loading ? "Enregistrement..." : "Sauvegarder"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setError(null);
                        // Reset form data
                        setFormData({
                          niveau_principal:
                            profile.niveau_principal || "college/lycee",
                          classes_college: profile.classes_college
                            ? JSON.parse(profile.classes_college)
                            : [],
                          biographie: profile.biographie || "",
                          tarif_horaire: profile.tarif_horaire || "",
                          rayon_intervention: profile.rayon_intervention || 10,
                          matieres: profile.matieres || [],
                        });
                      }}
                      className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Affichage non-éditable */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Niveau principal
                    </h3>
                    <p>
                      {formData.niveau_principal === "college/lycee"
                        ? "Collège/Lycée"
                        : "Primaire"}
                    </p>
                  </div>

                  {formData.niveau_principal === "college/lycee" &&
                    formData.classes_college.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Classes enseignées (collège)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.classes_college.map((classe, i) => (
                            <span
                              key={i}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                            >
                              {classe}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Matières enseignées
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matieresEnseignees.length > 0 ? (
                        matieresEnseignees.map((matiere) => {
                          const matiereOption = matieresOptions.find(
                            (m) => m.id === matiere.id
                          );
                          return (
                            <span
                              key={matiere.id}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {matiereOption?.nom || matiere.nom}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-500">
                          Aucune matière spécifiée
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Tarif horaire
                      </h3>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 text-blue-600" />
                        <span>
                          {formData.tarif_horaire
                            ? `${formData.tarif_horaire} FCFA`
                            : "Non spécifié"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Rayon d'intervention
                      </h3>
                      <p>{formData.rayon_intervention} km</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Biographie
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {formData.biographie || "Aucune description fournie"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section des cours */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mes Cours</h2>
                <button
                  onClick={() => setShowAddCourse(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FiPlus className="mr-1" /> Ajouter un cours
                </button>
              </div>

              {showAddCourse && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Nouveau cours</h3>
                  <form onSubmit={handleAddCourse} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre
                      </label>
                      <input
                        type="text"
                        name="titre"
                        value={newCourse.titre}
                        onChange={handleCourseInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newCourse.description}
                        onChange={handleCourseInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-24"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Matière
                        </label>
                        <select
                          name="matiere_id"
                          value={newCourse.matiere_id}
                          onChange={handleCourseInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Sélectionnez une matière</option>
                          {matieresOptions.map((matiere) => (
                            <option key={matiere.id} value={matiere.id}>
                              {matiere.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Niveau scolaire
                        </label>
                        <select
                          name="niveau_scolaire"
                          value={newCourse.niveau_scolaire}
                          onChange={handleCourseInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="primaire">Primaire</option>
                          <option value="college">Collège</option>
                          <option value="lycee">Lycée</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarif horaire (FCFA)
                      </label>
                      <input
                        type="number"
                        name="tarif_horaire"
                        value={newCourse.tarif_horaire}
                        onChange={handleCourseInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? (
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
                            Création...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" /> Créer le cours
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCourse(false)}
                        className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loadingCours ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : cours.length > 0 ? (
                <div className="space-y-4">
                  {cours.map((coursItem) => (
                    <div
                      key={coursItem.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {coursItem.titre}
                          </h3>
                          <p className="text-gray-600">
                            {coursItem.description}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {coursItem.niveau_scolaire === "college"
                            ? "Collège"
                            : coursItem.niveau_scolaire === "lycee"
                            ? "Lycée"
                            : "Primaire"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1" />
                          <span>{coursItem.tarif_horaire} FCFA/heure</span>
                        </div>
                        <div className="flex items-center">
                          <FiBook className="mr-1" />
                          <span>{coursItem.matiere}</span>{" "}
                          {/* Utilisez directement le nom */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Vous n'avez pas encore créé de cours</p>
                  <button
                    onClick={() => setShowAddCourse(true)}
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
                  >
                    <FiPlus className="mr-1" /> Créer votre premier cours
                  </button>
                </div>
              )}
            </div>

            {/* Section disponibilités */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Disponibilités
                </h2>
                <button
                  onClick={() => setShowAddDispo(!showAddDispo)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  {showAddDispo ? "Annuler" : "Ajouter"}
                </button>
              </div>

              {showAddDispo && (
                <form
                  onSubmit={handleAddDispo}
                  className="mb-6 bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 mb-3">
                    Nouvelle disponibilité
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jour
                      </label>
                      <select
                        name="jour"
                        value={newDispo.jour}
                        onChange={handleDispoInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        {joursSemaine.map((jour) => (
                          <option key={jour.value} value={jour.value}>
                            {jour.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure de début
                      </label>
                      <input
                        type="time"
                        name="heure_debut"
                        value={newDispo.heure_debut}
                        onChange={handleDispoInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure de fin
                      </label>
                      <input
                        type="time"
                        name="heure_fin"
                        value={newDispo.heure_fin}
                        onChange={handleDispoInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </form>
              )}

              {loadingDispos ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : disponibilites.length > 0 ? (
                <div className="space-y-3">
                  {joursSemaine.map((jour) => {
                    const dispoPourJour = disponibilites
                      .filter((d) => d.jour === jour.value)
                      .sort((a, b) =>
                        a.heure_debut.localeCompare(b.heure_debut)
                      );

                    return dispoPourJour.length > 0 ? (
                      <div
                        key={jour.value}
                        className="border-b border-gray-200 pb-3"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {jour.label}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {dispoPourJour.map((dispo) => (
                            <div
                              key={dispo.id}
                              className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full"
                            >
                              <FiClock className="mr-1" />
                              <span>
                                {formatHeure(dispo.heure_debut)} -{" "}
                                {formatHeure(dispo.heure_fin)}
                              </span>
                              <button
                                onClick={() => handleDeleteDispo(dispo.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  <FiCalendar className="mx-auto text-2xl mb-2" />
                  <p>Aucune disponibilité enregistrée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRepetiteur;

function safeJsonParse(str, defaultValue = []) {
  try {
    // Si c'est déjà un tableau, retournez-le directement
    if (Array.isArray(str)) return str;
    
    // Si c'est null, undefined ou une chaîne vide, retournez defaultValue
    if (!str || str === 'null' || str === 'undefined' || str === '') return defaultValue;
    
    // Essayez de parser comme JSON
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error('Erreur parsing JSON:', err, str);
    
    // Si le parsing échoue, essayez de traiter comme une chaîne simple
    try {
      if (typeof str === 'string') {
        // Essayez de splitter par virgule si c'est une liste
        if (str.includes(',')) {
          return str.split(',').map(item => item.trim());
        }
        // Sinon retournez un tableau avec la valeur unique
        return [str];
      }
      return defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
}
