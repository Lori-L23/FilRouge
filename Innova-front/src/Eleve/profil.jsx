import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiPhone, FiBook, FiTarget, FiCalendar, FiMessageSquare, FiDollarSign, FiUser } from 'react-icons/fi';
import { FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const ProfileEleve = () => {
  const { user, profile, refetchUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [paiements, setPaiements] = useState([]);

  const [formData, setFormData] = useState({
    telephone: profile?.telephone || '',
    niveau_scolaire: profile?.niveau_scolaire || '',
    objectif: profile?.objectif || ''
  });

  // Charger les données initiales
  useEffect(() => {
    if (profile) {
      setFormData({
        telephone: profile.telephone || '',
        niveau_scolaire: profile.niveau_scolaire || '',
        objectif: profile.objectif || ''
      });
    }

    if (location.state?.reservationSuccess) {
      setReservationDetails({
        id: location.state.reservationId,
        amount: location.state.amount
      });
      setShowPaymentModal(true);
    }

    fetchReservations();
    fetchPaiements();
  }, [profile, location.state]);

  const fetchReservations = async () => {
    try {
      const response = await Api.get('/api/reservations');
      setReservations(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des réservations');
    }
  };

  const fetchPaiements = async () => {
    try {
      const response = await Api.get('/api/paiements');
      setPaiements(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des paiements');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await Api.put('/api/profile', formData);
      toast.success('Profil mis à jour avec succès');
      refetchUser();
      setEditMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (!reservationDetails?.id || !reservationDetails?.amount || isNaN(reservationDetails.amount)) {
        toast.error('Informations de paiement incomplètes');
        return;
      }

      setLoading(true);
      const response = await Api.post('/api/paiements/process', {
        reservation_id: parseInt(reservationDetails.id),
        montant: parseFloat(reservationDetails.amount)
      });

      if (response.data.success) {
        window.location.href = response.data.payment_url;
      } else {
        throw new Error(response.data.message || 'Erreur de paiement');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(error.response?.data?.message || 'Échec du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FiDollarSign className="mr-2 text-green-600" />
          Paiement Requis
        </h3>
        
        <div className="space-y-3 mb-6">
          <p>Votre réservation <strong>#{reservationDetails?.id}</strong> est prête.</p>
          <p className="text-lg font-semibold">Montant: {reservationDetails?.amount} €</p>
          <p className="text-sm text-gray-600">Vous serez redirigé vers notre plateforme de paiement sécurisé.</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Plus tard
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Traitement...</span>
            ) : (
              <>
                <FiDollarSign className="mr-2" />
                Payer maintenant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {showPaymentModal && <PaymentModal />}

      <div className="max-w-6xl mx-auto mt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUserGraduate className="mr-2" />
            Mon Profil 
          </h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-[#7ED321] text-white rounded-md hover:bg-[#d0f8a7]"
          >
            Déconnexion
          </button>
        </div>

        {/* Profil Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Informations profil */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <FiUser className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="text"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau scolaire</label>
                    <select
                      name="niveau_scolaire"
                      value={formData.niveau_scolaire}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="Collège">Collège</option>
                      <option value="Seconde">Seconde</option>
                      <option value="Première">Première</option>
                      <option value="Terminale">Terminale</option>
                      <option value="Supérieur">Supérieur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
                    <textarea
                      name="objectif"
                      value={formData.objectif}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={loading}
                    >
                      <FiSave className="mr-2" />
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <FiPhone className="mr-2" /> {profile?.telephone || 'Non renseigné'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Niveau scolaire</h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <FiBook className="mr-2" /> {profile?.niveau_scolaire || 'Non renseigné'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Objectif</h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <FiTarget className="mr-2" /> {profile?.objectif || 'Non renseigné'}
                  </p>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiEdit className="mr-2" />
                  Modifier le profil
                </button>
              </div>
            )}
          </div>

          {/* Colonne de droite - Réservations et paiements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Réservations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" />
                Mes Réservations
              </h2>
              
              {reservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map(reservation => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(reservation.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.repetiteur?.user?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.matiere || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              reservation.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
                              reservation.statut === 'annulé' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.statut === 'en attente' && (
                              <button 
                                onClick={() => {
                                  setReservationDetails({
                                    id: reservation.id,
                                    amount: reservation.prix
                                  });
                                  setShowPaymentModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Payer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Aucune réservation trouvée</p>
              )}
            </div>

            {/* Section Paiements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiDollarSign className="mr-2 text-green-500" />
                Mes Paiements
              </h2>
              
              {paiements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paiements.map(paiement => (
                        <tr key={paiement.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(paiement.date_paiement).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            #{paiement.reservation_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {paiement.montant} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              paiement.statut === 'payé' ? 'bg-green-100 text-green-800' :
                              paiement.statut === 'échoué' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {paiement.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Aucun paiement trouvé</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEleve;