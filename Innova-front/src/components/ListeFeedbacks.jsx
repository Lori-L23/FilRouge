import React, { useEffect, useState } from 'react';
import Api from '../Services/Api';
const ListeFeedbacks = ({ repetiteurId }) => {
  // État pour stocker les feedbacks
  const [feedbacks, setFeedbacks] = useState([]);
  // État pour gérer le chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les feedbacks du répétiteur via l'API
    const fetchFeedbacks = async () => {
      try {
        const response = await Api.get(`/api/admin/feedbacks?repetiteur_id=${repetiteurId}`);

        // Vérifie que la réponse est bien un tableau
        const data = Array.isArray(response.data) ? response.data : [];
        setFeedbacks(data);
      } catch (error) {
        console.error('Erreur lors du chargement des feedbacks:', error);
        setFeedbacks([]); // Valeur de secours
      } finally {
        setLoading(false);
      }
    };

    // Lance la récupération au montage ou si repetiteurId change
    if (repetiteurId) {
      fetchFeedbacks();
    }
  }, [repetiteurId]);

  // Affichage en cours de chargement
  if (loading) {
    return <p className="text-center text-gray-500">Chargement des avis...</p>;
  }

  // Aucun avis
  if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
    return <p className="text-center text-gray-500">Aucun avis pour ce répétiteur pour le moment.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Avis des élèves</h2>
      {feedbacks.map((fb) => (
        <div key={fb.id} className="border p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-center justify-between">
            {/* Étoiles de notation */}
            <span className="font-bold text-yellow-500">{'★'.repeat(fb.note)}</span>
            <span className="text-sm text-gray-500">
              {new Date(fb.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Commentaire */}
          <p className="mt-2 text-gray-700">{fb.commentaire || "Aucun commentaire fourni."}</p>
        </div>
      ))}
    </div>
  );
};

export default ListeFeedbacks;
