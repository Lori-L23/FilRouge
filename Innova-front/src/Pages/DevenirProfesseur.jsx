import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DevenirProfesseur() {
  const [matieres, setMatieres] = useState([]);
  const [selectedMatieres, setSelectedMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();

  // Récupérer la liste des matières depuis l'API
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        // Remplacez cette URL par votre endpoint API réel
        const response = await fetch('/api/matieres');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des matières');
        }
        const data = await response.json();
        setMatieres(data); // Assurez-vous que data est un tableau
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatieres();
  }, []);

  const handleMatiereChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedMatieres([...selectedMatieres, value]);
    } else {
      setSelectedMatieres(selectedMatieres.filter(m => m !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        role: 'professeur',
        matieres: selectedMatieres
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Devenir Professeur</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Sélectionnez vos matières</h2>
          
          {/* Vérification que matieres est bien un tableau avant d'utiliser map */}
          {Array.isArray(matieres) ? (
            <div className="grid grid-cols-2 gap-4">
              {matieres.map((matiere) => (
                <label key={matiere.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={matiere.id}
                    checked={selectedMatieres.includes(matiere.id)}
                    onChange={handleMatiereChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{matiere.nom}</span>
                </label>
              ))}
            </div>
          ) : (
            <p>Aucune matière disponible</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={selectedMatieres.length === 0}
        >
          Devenir Professeur
        </button>
      </form>
    </div>
  );
}

export default DevenirProfesseur;