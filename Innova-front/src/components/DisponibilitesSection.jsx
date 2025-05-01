import { FiCalendar, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Api from '../Services/Api';

const DisponibilitesSection = ({ repetiteurId }) => {
  const [disponibilites, setDisponibilites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDispo, setNewDispo] = useState({
    jour: '',
    heure_debut: '',
    heure_fin: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Jours de la semaine
  const jours = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 
    'Vendredi', 'Samedi', 'Dimanche'
  ];

  // Charger les disponibilités existantes
  useEffect(() => {
    const fetchDisponibilites = async () => {
      try {
        const response = await Api.get(`/api/repetiteurs/${repetiteurId}/disponibilites`);
        setDisponibilites(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des disponibilités");
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [repetiteurId]);

  // Ajouter une nouvelle disponibilité
  const handleAddDispo = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await Api.post('/api/disponibilites', {
        ...newDispo,
        repetiteur_id: repetiteurId
      });
      setDisponibilites([...disponibilites, response.data]);
      setNewDispo({ jour: '', heure_debut: '', heure_fin: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une disponibilité
  const handleDeleteDispo = async (id) => {
    if (!window.confirm("Supprimer cette disponibilité ?")) return;
    
    try {
      await Api.delete(`/api/disponibilites/${id}`);
      setDisponibilites(disponibilites.filter(d => d.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  // Formater l'heure pour l'affichage
  const formatHeure = (heure) => {
    if (!heure) return '';
    const [h, m] = heure.split(':');
    return `${h}h${m}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Disponibilités</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiPlus className="mr-1" />
          {showForm ? 'Annuler' : 'Ajouter'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddDispo} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Nouvelle disponibilité</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
              <select
                name="jour"
                value={newDispo.jour}
                onChange={(e) => setNewDispo({...newDispo, jour: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Sélectionner un jour</option>
                {jours.map((jour) => (
                  <option key={jour} value={jour}>{jour}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                name="heure_debut"
                value={newDispo.heure_debut}
                onChange={(e) => setNewDispo({...newDispo, heure_debut: e.target.value})}
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
                onChange={(e) => setNewDispo({...newDispo, heure_fin: e.target.value})}
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

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : disponibilites.length > 0 ? (
        <div className="space-y-3">
          {jours.map((jour) => {
            const dispoPourJour = disponibilites
              .filter(d => d.jour === jour)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

            return dispoPourJour.length > 0 && (
              <div key={jour} className="border-b border-gray-200 pb-3">
                <h3 className="font-medium text-gray-900 mb-2">{jour}</h3>
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
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          <FiCalendar className="mx-auto text-2xl mb-2" />
          <p>Aucune disponibilité enregistrée</p>
        </div>
      )}
    </div>
  );
};

export default DisponibilitesSection;