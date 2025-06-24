import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import { toast } from "react-toastify";

function DevenirProfesseur() {
  const [matieres, setMatieres] = useState([]);
  const [selectedMatieres, setSelectedMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [niveau_enseigne, setNiveau_enseigne] = useState("");
  const [tarif, setTarif] = useState("");
  const [disponibilites, setDisponibilites] = useState("");
  // const [matiere, setMatiere] = useState([]);
  
  const navigate = useNavigate();
  const { user, refetchUser, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate("/login");
      return;
    }

    const fetchMatieres = async () => {
      try {
        const response = await Api.get('/api/matieres');
        
        if (response.data?.success) {
          const formattedMatieres = response.data.data.map(matiere => ({
            id: matiere.id.toString(),
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

    if (isAuthenticated) {
      fetchMatieres();
    }
  }, [isAuthenticated, navigate, authLoading]);

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
    setFormLoading(true);

    if (!isAuthenticated || !user?.id) {
      setError("Session invalide. Veuillez vous reconnecter.");
      toast.error("Session invalide. Veuillez vous reconnecter.");
      setFormLoading(false);
      navigate("/login");
      return;
    }

    if (selectedMatieres.length === 0) {
      setError("Veuillez sélectionner au moins une matière.");
      setFormLoading(false);
      return;
    }

    if (!niveau_enseigne || !tarif || !disponibilites || !description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setFormLoading(false);
      return;
    }


    try {
      // 1. Mise à jour du rôle utilisateur
      // const updateResponse = await Api.put(`/api/user/${user.id}/role`, {
      //   role: "repetiteur"
      // });

      // if (!updateResponse.data?.success) {
      //   throw new Error(updateResponse.data?.message || "Échec de la mise à jour du rôle");
      // }

      console.log("Données envoyées :", {
        user_id: user.id,
        matieres: selectedMatieres,
        description: description.trim(),
        niveau_enseigne,
        tarif_horaire: parseFloat(tarif),
        disponibilites: disponibilites.trim(),
      });
     
      // 2. Création du profil répétiteur
      const response = await Api.post("/api/repetiteurs", {
        user_id: user.id,
        matiere: selectedMatieres , // Convertir en nombres
        description: description.trim(),
        niveau_enseigne,
        tarif_horaire: parseFloat(tarif), // Convertir en float
        disponibilites: disponibilites.trim(),
      });


      if (response.data?.success) {
        toast.success("Profil créé avec succès !");
        await refetchUser();
        navigate("/profile");
      } else {
        throw new Error(response.data?.message || "Erreur lors de la création du profil");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data || err);
      
      // Gestion des erreurs de validation
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        setError("Veuillez corriger les erreurs dans le formulaire");
        toast.error("Erreurs de validation dans le formulaire");
      } if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
      
        // Transforme les erreurs en un seul message lisible
        const errorMessages = Object.values(validationErrors)
          .flat()
          .join('\n');
      
        setError(errorMessages); // Montre toutes les erreurs dans le bloc rouge
        toast.error("Erreurs de validation :\n" + errorMessages); // Notification toast plus précise
      }
      
      // Gestion des autres erreurs
      else {
        const serverError = err.response?.data?.message || err.message;
        setError(serverError || "Erreur serveur");
        toast.error(serverError || "Erreur lors de la création du profil");
      }
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-8">Chargement en cours...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center py-8">Redirection vers la page de connexion...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center mt-20 text-blue-700">
        Devenir Répétiteur
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
                value={niveau_enseigne}
                onChange={(e) => setNiveau_enseigne(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="Collège/lycee">Collège/lycée</option>
                <option value="Primaire">Primaire</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Tarif horaire (FCFA)
              </label>
              <input
                type="number"
                value={tarif}
                onChange={(e) => setTarif(e.target.value)}
                className="w-full p-2 border rounded"
                min="1000"
                step="500"
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
              minLength="20"
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
              minLength="30"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Matières enseignées</h2>
          
          {matieres.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matieres.map((matiere) => (
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
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            {error === "Veuillez corriger les erreurs dans le formulaire" && (
              <p className="text-sm mt-2">Vérifiez que tous les champs sont valides</p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-[#7ED321] text-white rounded-lg hover:bg-[#6bc11e] transition-colors disabled:bg-gray-400"
            disabled={formLoading}
          >
            {formLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              "Valider mon inscription"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DevenirProfesseur;