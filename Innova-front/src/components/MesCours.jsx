import { useEffect, useState } from 'react';
import axios from 'axios';
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

  // Récupération des cours
  useEffect(() => {
    fetchCours();
    fetchMatieres();
  }, []);

  const fetchCours = async () => {
    try {
      const response = await Api.get('/api/cours/mes-cours', {
        withCredentials: true,
      });
      setCours(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours', error);
    }
  };

  const fetchMatieres = async () => {
    try {
      const res = await Api.get('/api/matieres');
      setMatieres(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières', error);
    }
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post('api/cours', formData, {
        withCredentials: true,
      });
      setFormData({ titre: '', description: '', matiere_id: '' });
      setShowForm(false);
      fetchCours();
    } catch (error) {
      console.error('Erreur lors de la création du cours', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 mt-20">Mes cours</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Annuler' : 'Créer un nouveau cours'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-gray-100 p-4 rounded">
          <input
            type="text"
            placeholder="Titre"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.matiere_id}
            onChange={(e) => setFormData({ ...formData, matiere_id: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map((matiere) => (
              <option key={matiere.id} value={matiere.id}>
                {matiere.nom}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </form>
      )}

      <div className="space-y-4 flex-1/2">
        {cours.map((c) => (
          <div key={c.id} className="border p-3 rounded bg-white shadow">
            <h3 className="text-lg font-bold">{c.titre}</h3>
            <p>{c.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Matière :</strong> {c.matiere?.nom}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
