import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfesseurCard({ repetiteur }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="flex-shrink-0">
            {repetiteur.user.photo ? (
              <img 
                src={`/storage/${repetiteur.user.photo}`} 
                alt={repetiteur.user.nom}
                className="rounded-circle"
                width="80"
                height="80"
              />
            ) : (
              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px' }}>
                {repetiteur.user.nom.charAt(0)}{repetiteur.user.prenom.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-grow-1 ms-3">
            <h5 className="mb-0">{repetiteur.user.prenom} {repetiteur.user.nom}</h5>
            <p className="text-muted mb-1">{repetiteur.niveaux}</p>
            <div className="small">
              {JSON.parse(repetiteur.matieres).map(id => (
                <span key={id} className="badge bg-primary me-1">Matière {id}</span>
              ))}
            </div>
          </div>
        </div>
        
        <p className="card-text">{repetiteur.biographie.substring(0, 100)}...</p>
        
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/professeurs/${repetiteur.id}`} className="btn btn-sm btn-outline-primary">
            Voir profil
          </Link>
          <span className="text-muted small">{repetiteur.rayon_intervention} km</span>
        </div>
      </div>
    </div>
  );
}