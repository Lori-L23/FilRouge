import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../Services/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function FormulaireCours() {
  const [titre, setTitre] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [matieres, setMatieres] = useState([]);
//   const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    Api.get('/api/matieres')
      .then(response => setMatieres(response.data))
      .catch(error => console.error('Erreur chargement matières:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    Api.post('/api/cours', { titre, matiere_id: matiereId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      }
    })
    .then(res => console.log('Cours ajouté !', res.data))
    .catch(err => console.error('Erreur:', err));
    toast.success('Cours créé avec succès !');

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Titre du cours</label>
        <input type="text" value={titre} onChange={e => setTitre(e.target.value)} />
      </div>

      <div>
        <label>Matière</label>
        <select value={matiereId} onChange={e => setMatiereId(e.target.value)}>
          <option value="">Choisir une matière</option>
          {matieres.map(matiere => (
            <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
          ))}
        </select>
      </div>

      <button type="submit">Créer le cours</button>
    </form>
  );
}
