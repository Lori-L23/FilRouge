import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaCheck, FaUser, FaBook, FaMoneyBillWave } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Services/Api";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../contexts/AuthContext";

const Reservation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cours, setCours] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        setLoading(true);
        const response = await Api.get(`/api/cours/${id}?with=matiere,repetiteur.user`);
        
        if (response.data) {
          
          setCours({
            ...response.data,
            matiere_nom: response.data.matiere?.nom || 'Matière inconnue',
            professeur_nom: `${response.data.repetiteur?.user?.prenom || ''} ${response.data.repetiteur?.user?.nom || ''}`.trim() || 'Professeur inconnu',
            tarif: response.data.tarif_horaire ? `${response.data.tarif_horaire}€/h` : 'Non spécifié',
            // Ajout de disponibilités par défaut si elles ne sont pas fournies
            availability: response.data.availability || generateDefaultAvailability()
          });
          // console.log(response.data)
        } else {
          setError("Cours non trouvé");
          toast.error("Ce cours n'existe pas ou n'est plus disponible");
        }
      } catch (error) {
        console.error("Erreur de chargement du cours :", error);
        setError(error.message);
        toast.error('Erreur de chargement du cours');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCours();
  }, [id]);
  
  // Génère des disponibilités par défaut si aucune n'est fournie
  const generateDefaultAvailability = () => {
    const availability = {};
    const today = new Date();
    
    // Génère 7 jours de disponibilité avec des créneaux standards
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      availability[dateString] = ['09:00', '11:00', '14:00', '16:00'];
    }
    
    return availability;
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime("");
    setStep(1);
  };

  const handleCustomDateSelect = (date) => {
    setCustomDate(date);
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(2);
  };

  const confirmBooking = async () => {
    try {
      // Formatage correct pour votre structure DB
      const reservationData = {
        cours_id: parseInt(id), // Nécessaire pour trouver le répétiteur
        date: selectedDate, // Format YYYY-MM-DD
        heure: selectedTime.padEnd(5, ':00'), // Format HH:MM
        prix : cours.tarif_horaire, // Prix par heure
        statut: 'en_attente'
      };
  
      // Debug
      console.log('Données envoyées:', reservationData);
  
      await Api.get('/sanctum/csrf-cookie');
      const response = await Api.post('/api/reservations', reservationData);
      
      if (response.data.success) {
        toast.success("Réservation créée avec succès!");
        navigate('/profil');
      }
  
    } catch (error) {
      console.error('Détails erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
  
      if (error.response?.status === 403) {
        toast.error('Action non autorisée pour votre rôle');
      } else if (error.response?.status === 422) {
        // Affichez les erreurs de validation
        Object.values(error.response.data.errors).flat().forEach(msg => {
          toast.error(msg);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur serveur');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !cours) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto text-center py-10">
        <p className="text-red-500">{error || "Impossible de charger les détails du cours"}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto mt-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Réserver : {cours.titre}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaBook className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Matière</p>
              <p>{cours.matiere_nom}</p>
            </div>
          </div>
          
          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaUser className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Professeur</p>
              <p>{cours.professeur_nom}</p>
            </div>
          </div>
          
          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaMoneyBillWave className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Tarif</p>
              <p>{cours.tarif}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p>{cours.description || "Aucune description disponible."}</p>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Choisissez une date
            </h3>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">Sélectionner une date :</label>
              <DatePicker
                selected={customDate}
                onChange={(date) => handleCustomDateSelect(date)}
                minDate={new Date()}
                className="w-full p-2 border rounded-lg"
                placeholderText="Cliquez pour choisir une date"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <h4 className="font-medium mb-2">Ou sélectionnez parmi les dates disponibles :</h4>
            {cours.availability && Object.keys(cours.availability).length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {Object.keys(cours.availability).map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(new Date(date))}
                    className={`p-3 rounded-lg ${
                      selectedDate === date
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {new Date(date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune disponibilité programmée</p>
            )}
          </div>

          {selectedDate && (
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-4">
                <FaClock className="mr-2 text-blue-600" />
                Créneaux disponibles
              </h3>
              {cours.availability[selectedDate]?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {cours.availability[selectedDate].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-lg border ${
                        selectedTime === time
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 hover:bg-blue-100 border-blue-200"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
                  <p>Aucun créneau disponible pour cette date.</p>
                  <p className="mt-2">Veuillez contacter le professeur pour plus d'options.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Récapitulatif</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Matière:</span> {cours.matiere_nom}</p>
              <p><span className="font-medium">Titre:</span> {cours.titre}</p>
              <p><span className="font-medium">Professeur:</span> {cours.professeur_nom}</p>
              <p><span className="font-medium">Tarif horaire:</span> {cours.tarif}</p>
              <p><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
              })} à {selectedTime}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition"
            >
              Modifier
            </button>
            <button
              onClick={confirmBooking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition"
            >
              <FaCheck className="mr-2" /> Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;