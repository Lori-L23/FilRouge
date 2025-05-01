import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import { toast } from "react-toastify";
import axios from "axios";

function DevenirProfesseur() {
  const [matieres, setMatieres] = useState([]);
  const [selectedMatieres, setSelectedMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [niveauEnseigne, setNiveauEnseigne] = useState("");
  const [tarif, setTarif] = useState("");
  const [disponibilites, setDisponibilites] = useState("");
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, refetchUser } = useAuth();



 // Récupérer la liste des matières depuis l'API
 useEffect(() => {
  const fetchMatieres = async () => {
    try {
      const response = await Api.get('/api/matieres');
      console.log(response.data);
      
      if (response.data?.success) {
        // Formater les données pour s'assurer que chaque matière a un id et un nom
        const formattedMatieres = response.data.data.map(matiere => ({
          id: matiere.id.toString(), // Convertir en string pour faciliter la comparaison
          nom: matiere.nom
        }));
        setMatieres(formattedMatieres);
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la récupération des matières');
      }
    } catch (err) {
      console.error("Erreur fetchMatieres:", err);
      setError(err.message);
      toast.error("Erreur lors du chargement des matières");
    } finally {
      setLoading(false);
    }
  };

  fetchMatieres();
}, []);

const handleMatiereChange = (e) => {
  const { value, checked } = e.target;
  setSelectedMatieres(prev => {
    if (checked) {
      return [...prev, value];
    } else {
      return prev.filter(id => id !== value);
    }
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("currentUser:", currentUser); // Vérifiez si currentUser est défini

    if (!currentUser || !currentUser.id) {
      setError("Utilisateur non authentifié ou ID utilisateur manquant.");
      toast.error("Erreur : utilisateur non authentifié.");
      return;
    }
    // Vérification de tous les champs avant soumission
    if (selectedMatieres.length === 0) {
      setError("Veuillez sélectionner au moins une matière.");
      return;
    }

    if (!niveauEnseigne || !tarif || !disponibilites || !description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      // 1. Mettre à jour le rôle de l'utilisateur
      await updateUserProfile({
        role: "repetiteur",
      });

      // 2. Créer le profil répétiteur
      const response = await Api.post("/api/repetiteurs", {
        user_id: currentUser.id,
        matieres: selectedMatieres,
        description,
        niveau_enseigne: niveauEnseigne,
        tarif_horaire: tarif,
        disponibilites,
      });

      if (response.data?.success) {
        toast.success("Vous êtes maintenant professeur!");
        await refetchUser(); // Recharger les données utilisateur
        navigate("/profil");
      } else {
        throw new Error(
          response.data?.message || "Erreur lors de la création du profil"
        );
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      toast.error(err.message || "Une erreur est survenue");
    }
  };

  if (loading)
    return <div className="text-center py-8">Chargement en cours...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl ">
      <h1 className="text-3xl font-bold mb-8 text-center mt-20 text-blue-700">
        Devenir Repetiteur
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations générales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Niveau enseigné
              </label>
              <select
                value={niveauEnseigne}
                onChange={(e) => setNiveauEnseigne(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Collège/lycee">Collège/lycee</option>
                <option value="Primaire">Primaire</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Tarif horaire (Fcfa)
              </label>
              <input
                type="number"
                value={tarif}
                onChange={(e) => setTarif(e.target.value)}
                className="w-full p-2 border rounded"
                min="10"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Disponibilités</label>
            <textarea
              value={disponibilites}
              onChange={(e) => setDisponibilites(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: Lundi 18h-20h, Mercredi après-midi..."
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Parlez un peu de vous et de votre méthode d'enseignement..."
              required
            />
          </div>
        </div>

       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Matières enseignées</h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">Erreur: {error}</p>
        ) : matieres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {matieres?.map((matiere) => (
              <div key={matiere.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`matiere-${matiere.id}`}
                  value={matiere.id}
                  checked={selectedMatieres.includes(matiere.id)}
                  onChange={handleMatiereChange}
                  className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`matiere-${matiere.id}`} className="ml-2 block text-sm text-gray-900">
                  {matiere.nom}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucune matière disponible</p>
        )}
      </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-[#7ED321] text-white rounded-lg hover:bg-[#aada77]  hover:text-white transition-colors disabled:bg-gray-400"
            disabled={
              selectedMatieres.length === 0 ||
              !niveauEnseigne ||
              !tarif ||
              !disponibilites ||
              !description ||
              loading
            }
          >
            {loading ? "Enregistrement..." : "Valider mon inscription"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DevenirProfesseur;
