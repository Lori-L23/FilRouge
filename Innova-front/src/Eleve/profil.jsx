import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiPhone, FiBook, FiTarget, FiCalendar, FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import { FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const ProfileEleve = () => {
  const { user, profile, refetchUser } = useAuth();
  const location = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [formData, setFormData] = useState({
    telephone: '',
    niveau_scolaire: '',
    objectif: ''
  });

  // Gérer la réservation après redirection
  useEffect(() => {
    if (location.state?.reservationSuccess) {
      setReservationDetails({
        id: location.state.reservationId,
        amount: location.state.amount
      });
      setShowPaymentModal(true);
    }
  }, [location.state]);

  // ... (gardez vos autres useEffect et fonctions existants)

  const handlePayment = async () => {
    try {
      const response = await Api.post('/api/paiements', {
        reservation_id: reservationDetails.id,
        amount: reservationDetails.amount
      });
      
      // Redirection vers le portail de paiement
      window.location.href = response.data.payment_url;
    } catch (error) {
      toast.error("Erreur lors du traitement du paiement");
      console.error("Erreur paiement:", error);
    }
  };

  // Ajoutez ce composant dans votre retour JSX
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
          >
            Plus tard
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"
          >
            <FiDollarSign className="mr-2" />
            Payer maintenant
          </button>
        </div>
      </div>
    </div>
  );

  // ... (gardez le reste de votre code existant)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Modal de paiement */}
      {showPaymentModal && <PaymentModal />}

      {/* ... (gardez le reste de votre JSX existant) */}
    </div>
  );
};

export default ProfileEleve;