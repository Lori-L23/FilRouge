import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfesseurCard from '../components/ProfesseurCard';
import Api from '../Services/Api';

/**
 * Composant principal pour la recherche de professeurs
 */
export default function TrouverProfesseur() {
  // États pour stocker les données
  const [repetiteurs, setRepetiteurs] = useState([]); // Liste des professeurs
  const [matieres, setMatieres] = useState([]); // Liste des matières disponibles
  const [loading, setLoading] = useState(true); // État de chargement
  const [pagination, setPagination] = useState({
    current_page: 1, // Page actuelle
    total: 0, // Nombre total d'éléments
    per_page: 10 // Éléments par page
  });

  // Filtres de recherche
  const [filters, setFilters] = useState({
    matiere_id: '', // ID de la matière sélectionnée
    niveau: '', // Niveau scolaire sélectionné
    search: '' // Terme de recherche textuelle
  });

  /**
   * Effet pour charger les données initiales au montage du composant
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Charger la liste des matières
        const matieresResponse = await Api.get('/api/matieres');
        setMatieres(matieresResponse.data.matieres);
        
        // 2. Charger les professeurs avec les filtres par défaut
        await handleSearch();
      } catch (error) {
        console.error('Erreur lors du chargement initial:', error);
      }
    };
    
    fetchInitialData();
  }, []);

  /**
   * Gère la recherche des professeurs avec les filtres actuels
   * @param {number} page - Numéro de page à charger (défaut: 1)
   */
  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const response = await Api.get('/api/repetiteurs/search', {
        params: { 
          ...filters,
          page 
        }
      });
  
      if (response.data.success) {
        setRepetiteurs(response.data.data);
        setPagination({
          current_page: response.data.pagination.current_page,
          total: response.data.pagination.total,
          per_page: response.data.pagination.per_page
        });
        
      } else {
        console.error('Erreur API:', response.data.message);
        // Afficher un message d'erreur à l'utilisateur
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      // Afficher une notification d'erreur
      alert('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  /**
   * Gère le changement des filtres
   * @param {Object} e - Événement du formulaire
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Gère le changement de page
   * @param {number} newPage - Nouvelle page à charger
   */
  const handlePageChange = (newPage) => {
    handleSearch(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Titre */}
      <h2 className="text-3xl font-semibold mb-6 text-center mt-20 text-blue-700">
        Trouver un Professeur
      </h2>

      {/* Section des filtres */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Filtre par matière */}
          <div>
            <label className="block mb-1 font-medium">Matière</label>
            <select
              name="matiere_id"
              value={filters.matiere_id}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Toutes les matières</option>
              {matieres?.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nom} ({m.professeurs_count} profs)
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par niveau */}
          <div>
            <label className="block mb-1 font-medium">Niveau</label>
            <select
              name="niveau"
              value={filters.niveau}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Tous niveaux</option>
              <option value="primaire">Primaire</option>
              <option value="college/lycee">Collège/Lycée</option>
            </select>
          </div>

          {/* Champ de recherche textuelle */}
          <div>
            <label className="block mb-1 font-medium">Recherche</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Nom, prénom ou matière..."
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        {/* Bouton de recherche */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Appliquer les filtres'}
          </button>
        </div>
      </div>

      {/* Section des résultats */}
      {loading ? (
        // Indicateur de chargement
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          {/* Liste des professeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {repetiteurs.length > 0 ? (
              repetiteurs.map(repetiteur => (
                <ProfesseurCard
                  key={repetiteur.id}
                  repetiteur={repetiteur}
                  matieres={repetiteur.matieres}
                  note={4}
                />
              ))
            ) : (
              // Message si aucun résultat
              <div className="col-span-full text-center text-gray-500 py-10">
                Aucun professeur trouvé avec ces critères.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.per_page && (
            <div className="mt-10 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(pagination.total / pagination.per_page) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      pagination.current_page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={pagination.current_page === i + 1}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}