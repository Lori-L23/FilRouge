import { useEffect, useState } from 'react';
import Api from '../Services/Api'

export default function MesCours() {
  const [cours, setCours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    matiere_id: '',
  });
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupération des cours et matières
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCours(), fetchMatieres()]);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchCours = async () => {
    try {
      const response = await Api.get('/api/cours/mes-cours');
      setCours(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours', error);
      throw error;
    }
  };

  const fetchMatieres = async () => {
    try {
      const res = await Api.get('/api/matieres');
      setMatieres(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await Api.post('/api/cours', formData);
      setFormData({ titre: '', description: '', matiere_id: '' });
      setShowForm(false);
      await fetchCours();
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la création du cours', error);
      setError("Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 mt-20">Mes cours</h2>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => setShowForm(!showForm)}
        disabled={loading}
      >
        {showForm ? 'Annuler' : 'Créer un nouveau cours'}
      </button>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
              Titre du cours
            </label>
            <input
              type="text"
              id="titre"
              name="titre"
              placeholder="Titre du cours"
              value={formData.titre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description du cours"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="matiere_id" className="block text-sm font-medium text-gray-700 mb-1">
              Matière
            </label>
            <select
              id="matiere_id"
              name="matiere_id"
              value={formData.matiere_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading || matieres.length === 0}
            >
              <option value="">-- Choisir une matière --</option>
              {matieres.map((matiere) => (
                <option key={matiere.id} value={matiere.id}>
                  {matiere.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {cours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun cours disponible. Créez votre premier cours !
            </div>
          ) : (
            cours.map((c) => (
              <div key={c.id} className="border p-4 rounded-lg bg-white shadow hover:shadow-md transition">
                <h3 className="text-lg font-bold text-blue-600">{c.titre}</h3>
                <p className="mt-2 text-gray-600">{c.description}</p>
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Matière :</span> {c.matiere?.nom || 'Non spécifiée'}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}