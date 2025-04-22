import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfesseurCard from '../components/ProfesseurCard';
import Api from '../Services/Api';

export default function TrouverProfesseur() {
  const [repetiteurs, setRepetiteurs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [filters, setFilters] = useState({
    matiere_id: '',
    niveau: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repResponse, matieresResponse] = await Promise.all([
          axios.get('/api/repetiteurs'),
          axios.get('/api/matieres')
        ]);
        
        setRepetiteurs(repResponse.data);
        setMatieres(matieresResponse.data);
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/repetiteurs/search', {
        params: filters
      });
      setRepetiteurs(response.data);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h2>Trouver un Professeur</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label>Matière</label>
              <select
                name="matiere_id"
                value={filters.matiere_id}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Toutes les matières</option>
                {matieres.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label>Niveau</label>
              <select
                name="niveau"
                value={filters.niveau}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Tous niveaux</option>
                <option value="primaire">Primaire</option>
                <option value="College/lycee">Collège/Lycée</option>
              </select>
            </div>
            
            <div className="col-md-4 d-flex align-items-end">
              <button 
                onClick={handleSearch}
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Recherche...' : 'Filtrer'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">Chargement...</div>
      ) : (
        <div className="row">
          {repetiteurs.length > 0 ? (
            repetiteurs.map(repetiteur => (
              <div key={repetiteur.id} className="col-md-4 mb-4">
                <ProfesseurCard repetiteur={repetiteur} />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">Aucun professeur trouvé</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}