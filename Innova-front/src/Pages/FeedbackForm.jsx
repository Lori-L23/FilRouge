import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Api from '../Services/Api';

const FeedbackForm = ({ repetiteurId }) => {
  const { user } = useAuth(); // utilisateur connecté
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.post(
        'api/admin/feedbacks',
        {
          note,
          commentaire,
          repetiteur_id: repetiteurId,
        },
        {
          withCredentials: true, // important si Sanctum utilise les cookies
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      setMessage('Merci pour votre feedback !');
      setNote(5);
      setCommentaire('');
    } catch (error) {
      console.error(error);
      setMessage('Erreur lors de l’envoi du feedback.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Laisser un avis</h2>
      <label className="block mb-2">
        Note :
        <select value={note} onChange={(e) => setNote(parseInt(e.target.value))} className="block mt-1 w-full border p-1">
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label className="block mb-2">
        Commentaire :
        <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} className="block mt-1 w-full border p-1" />
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer</button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default FeedbackForm;
