import React, { useState, useEffect } from 'react';
import { 
  FiEdit, 
  FiSave, 
  FiPhone, 
  FiDollarSign, 
  FiBook, 
  FiX, 
  FiClock, 
  FiUsers,
  FiPlus,
  FiCalendar,
  FiStar,
  FiTrash2
} from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';
import defaultPhoto from '../assets/profile.jpg';

const ProfileRepetiteur = () => {
  const { user, profile, refetchUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    matieres: '',
    niveaux: [],
    tarif_horaire: '',
    biographie: '',
    rayon_intervention: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cours, setCours] = useState([]);
  const [loadingCours, setLoadingCours] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    titre: '',
    description: '',
    matiere: '', 
    niveau_scolaire: 'college',
    tarif_horaire: ''
  });
  const [disponibilites, setDisponibilites] = useState([]);
  const [loadingDispos, setLoadingDispos] = useState(true);
  const [showAddDispo, setShowAddDispo] = useState(false);
  const [newDispo, setNewDispo] = useState({
    jour: 'lundi',
    heure_debut: '',
    heure_fin: ''
  });

  // Jours de la semaine pour les disponibilités
  const joursSemaine = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' }
  ];

  // Options pour les sélecteurs
  const matieresOptions = [
    { value: 'svt', label: 'SVT' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'mathématiques', label: 'Mathématiques' },
    { value: 'philosophie', label: 'Philosophie' },
    { value: 'français', label: 'Français' },
    { value: 'anglais', label: 'Anglais' }
  ];

  const niveauxOptions = [
    { value: 'primaire', label: 'Primaire' },
    { value: 'college', label: 'Collège' },
    { value: 'lycee', label: 'Lycée' }
  ];

  // Fonction pour parser les données JSON stockées
  const parseJsonField = (field) => {
    if (!field) return [];
    
    try {
      if (Array.isArray(field)) return field;
      
      if (typeof field === 'string') {
        const cleaned = field.startsWith('"') ? field.slice(1, -1) : field;
        const cleaned2 = cleaned.replace(/\\"/g, '"');
        const parsed = JSON.parse(cleaned2);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      
      return [field];
    } catch (error) {
      console.error("Erreur de parsing:", error);
      return [];
    }
  };
  if(typeof field === 'text') {
    con
  }


  // Initialiser les données du formulaire
  useEffect(() => {
    if (profile) {
      setFormData({
        matieres: parseJsonField(profile.matieres),
        niveaux: parseJsonField(profile.niveaux),
        tarif_horaire: profile.tarif_horaire || '',
        biographie: profile.biographie || '',
        rayon_intervention: profile.rayon_intervention || 10
      });
    }
  }, [profile]);

  // Récupérer les cours du répétiteur
  useEffect(() => {
    const fetchCours = async () => {
      if (!user || user.role !== 'repetiteur') return;
      
      try {
        setLoadingCours(true);
        const response = await Api.get(`/api/repetiteurs/${user.id}`);
        setCours(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des cours:", err);
      } finally {
        setLoadingCours(false);
      }
    };

    fetchCours();
  }, [user]);

  // Récupérer les disponibilités du répétiteur

  const fetchDisponibilites = async () => {
    if (!user || user.role !== 'repetiteur') {
        setDisponibilites([]);
        return;
    }

    setLoadingDispos(true);
    setError(null);

    try {
        // Envoyer l'ID utilisateur (pas l'ID répétiteur)
        const response = await Api.get(`/api/repetiteurs/${user.id}/disponibilites`);
        
        if (!response.data.success) {
            throw new Error(response.data.message || "Erreur de chargement");
        }

        // Formatage simple des données
        const disponibilites = response.data.data.map(d => ({
            id: d.id,
            jour: d.jour,
            heure_debut: d.heure_debut,
            heure_fin: d.heure_fin
        }));

        setDisponibilites(disponibilites);
        
    } catch (err) {
        console.error("Erreur fetchDisponibilites:", err);
        setError(err.response?.data?.message || 
               err.message || 
               "Erreur lors du chargement des disponibilités");
        
        // Réinitialiser les disponibilités en cas d'erreur
        setDisponibilites([]);
    } finally {
        setLoadingDispos(false);
    }
};

  useEffect(() => {
    fetchDisponibilites();
  }, [user]);

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'tarif_horaire' || name === 'rayon_intervention' 
        ? Number(value) 
        : value 
    }));
  };

  const handleArrayChange = (e) => {
    const { name, options } = e.target;
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selected }));
  };

  // Gestion des changements pour le nouveau cours
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des changements pour les nouvelles disponibilités
  const handleDispoInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispo(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await Api.put(`/api/repetiteurs/${user.id}`, {
        ...formData,
        matieres: JSON.stringify(formData.matieres),
        niveaux: JSON.stringify(formData.niveaux)
      });
      await refetchUser();
      setEditMode(false);
    } catch (err) {
      console.error("Erreur de mise à jour:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'un nouveau cours
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation des champs
      if (!newCourse.titre || !newCourse.description || !newCourse.matiere || !newCourse.niveau_scolaire || !newCourse.tarif_horaire) {
        throw new Error("Tous les champs sont obligatoires");
      }
  
      const response = await Api.post('/api/cours', {
        titre: newCourse.titre,
        description: newCourse.description,
        matiere: newCourse.matiere, // Envoi du nom de la matière
        niveau_scolaire: newCourse.niveau_scolaire,
        tarif_horaire: parseFloat(newCourse.tarif_horaire),
        repetiteur_id: user.id
      });
  
      setCours([...cours, response.data]);
      setShowAddCourse(false);
      setNewCourse({
        titre: '',
        description: '',
        matiere: '',
        niveau_scolaire: 'college',
        tarif_horaire: ''
      });
      
      toast.success("Cours créé avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout du cours:", err);
      setError(err.response?.data?.message || "Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };
  // Ajout d'une nouvelle disponibilité
 
  const handleAddDispo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier que les champs requis sont remplis
      if (!newDispo.heure_debut || !newDispo.heure_fin) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }
  
      const response = await Api.post('/api/disponibilites', {
        jour: newDispo.jour,
        heure_debut: newDispo.heure_debut,
        heure_fin: newDispo.heure_fin
        // Ne pas envoyer repetiteur_id, il sera géré par le backend
      });
      
      // Mise à jour optimiste du state
      setDisponibilites(prev => [...prev, {
        id: response.data.data.id,
        jour: response.data.data.jour,
        heure_debut: response.data.data.heure_debut,
        heure_fin: response.data.data.heure_fin
      }]);
      
      setShowAddDispo(false);
      setNewDispo({
        jour: 'lundi',
        heure_debut: '',
        heure_fin: ''
      });
      
      toast.success("Disponibilité ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data || err);
      
      let errorMessage = "Erreur lors de l'ajout de la disponibilité";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors).flat().join(', ');
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'une disponibilité
  const handleDeleteDispo = async (id) => {
    if (!window.confirm("Supprimer cette disponibilité ?")) return;
    
    try {
      await Api.delete(`/api/disponibilites/${id}`);
      // Mise à jour optimiste
      setDisponibilites(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de la disponibilité");
    }
  };

  // Formater l'heure pour l'affichage
  const formatHeure = (heure) => {
    if (!heure) return '';
    const [h, m] = heure.split(':');
    return `${h}h${m}`;
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
                <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
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
                <p className="text-lg font-semibold">{user.prenom} {user.nom}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>{user.telephone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiBook className="mr-2 text-blue-600" />
                  <span>Statut: {profile.statut_verif === 'verifie' ? 'Vérifié' : 'Non vérifié'}</span>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h2>
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

          {/* Colonne centrale - Informations professionnelles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informations professionnelles</h2>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Matières enseignées</label>
                      <select
                        multiple
                        name="matieres"
                        value={formData.matieres}
                        onChange={handleArrayChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                        required
                      >
                        {matieresOptions.map((matiere) => (
                          <option key={matiere.value} value={matiere.value}>
                            {matiere.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveaux enseignés</label>
                      <select
                        multiple
                        name="niveaux"
                        value={formData.niveaux}
                        onChange={handleArrayChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                        required
                      >
                        {niveauxOptions.map((niveau) => (
                          <option key={niveau.value} value={niveau.value}>
                            {niveau.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (FCFA)</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rayon d'intervention (km)</label>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                    <textarea
                      name="biographie"
                      value={formData.biographie}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md h-32"
                      placeholder="Décrivez votre expérience et méthodologie..."
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
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" /> Sauvegarder
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setError(null);
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
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Matières enseignées</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.matieres.length > 0 ? (
                        formData.matieres.map((matiere, index) => {
                          const matiereObj = matieresOptions.find(m => m.value === matiere);
                          return (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {matiereObj ? matiereObj.label : matiere}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-500">Aucune matière spécifiée</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Niveaux enseignés</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.niveaux.length > 0 ? (
                        formData.niveaux.map((niveau, index) => {
                          const niveauObj = niveauxOptions.find(n => n.value === niveau);
                          return (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              {niveauObj ? niveauObj.label : niveau}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-500">Aucun niveau spécifié</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Tarif horaire</h3>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 text-blue-600" />
                        <span>{formData.tarif_horaire ? `${formData.tarif_horaire} FCFA` : 'Non spécifié'}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Rayon d'intervention</h3>
                      <p>{formData.rayon_intervention} km</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Biographie</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {formData.biographie || 'Aucune description fournie'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                        <select
                          name="matiere_id"
                          value={newCourse.matiere_id}
                          onChange={handleCourseInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Sélectionnez une matière</option>
                          {matieresOptions.map((matiere) => (
                            <option key={matiere.value} value={matiere.value}>
                              {matiere.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveau scolaire</label>
                        <select
                          name="niveau_scolaire"
                          value={newCourse.niveau_scolaire}
                          onChange={handleCourseInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          {niveauxOptions.map((niveau) => (
                            <option key={niveau.value} value={niveau.value}>
                              {niveau.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (FCFA)</label>
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
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    <div key={coursItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{coursItem.titre}</h3>
                          <p className="text-gray-600">{coursItem.description}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {coursItem.niveau_scolaire === 'college' ? 'Collège' : 
                           coursItem.niveau_scolaire === 'lycee' ? 'Lycée' : 'Primaire'}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1" />
                          <span>{coursItem.tarif_horaire} FCFA/heure</span>
                        </div>
                        <div className="flex items-center">
                          <FiUsers className="mr-1" />
                          <span>{coursItem.nombre_eleves || 0} élèves</span>
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
                <h2 className="text-xl font-bold text-gray-900">Disponibilités</h2>
                <button 
                  onClick={() => setShowAddDispo(!showAddDispo)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlus className="mr-1" />
                  {showAddDispo ? 'Annuler' : 'Ajouter'}
                </button>
              </div>

              {showAddDispo && (
                <form onSubmit={handleAddDispo} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Nouvelle disponibilité</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                      <select
                        name="jour"
                        value={newDispo.jour}
                        onChange={handleDispoInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        {joursSemaine.map((jour) => (
                          <option key={jour.value} value={jour.value}>{jour.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
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
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
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
                      .filter(d => d.jour === jour.value)
                      .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

                    return dispoPourJour.length > 0 ? (
                      <div key={jour.value} className="border-b border-gray-200 pb-3">
                        <h3 className="font-medium text-gray-900 mb-2">{jour.label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {dispoPourJour.map((dispo) => (
                            <div 
                              key={dispo.id} 
                              className="flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full"
                            >
                              <FiClock className="mr-1" />
                              <span>
                                {formatHeure(dispo.heure_debut)} - {formatHeure(dispo.heure_fin)}
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