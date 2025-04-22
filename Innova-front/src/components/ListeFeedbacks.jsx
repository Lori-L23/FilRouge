import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeFeedbacks = ({ repetiteurId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`/api/feedbacks?repetiteur_id=${repetiteurId}`);
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [repetiteurId]);

  if (loading) {
    return <p className="text-center">Chargement des avis...</p>;
  }

  if (feedbacks.length === 0) {
    return <p className="text-center">Aucun avis pour ce répétiteur pour le moment.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Avis des élèves</h2>
      {feedbacks.map((fb) => (
        <div key={fb.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <span className="font-bold text-yellow-500">{'★'.repeat(fb.note)}</span>
            <span className="text-sm text-gray-500">{new Date(fb.created_at).toLocaleDateString()}</span>
          </div>
          <p className="mt-2 text-gray-700">{fb.commentaire || "Aucun commentaire fourni."}</p>
        </div>
      ))}
    </div>
  );
};

export default ListeFeedbacks;
