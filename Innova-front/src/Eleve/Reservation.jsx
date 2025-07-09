import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaUser,
  FaBook,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../Services/Api";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../contexts/AuthContext";

const Reservation = () => {
  const { id } = useParams(); // Ici, id est l'ID du répétiteur
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repetiteur, setRepetiteur] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour transformer les disponibilités en créneaux
  const transformDisponibilites = (disponibilites) => {
    const daysMap = {
      lundi: 1,
      mardi: 2,
      mercredi: 3,
      jeudi: 4,
      vendredi: 5,
      samedi: 6,
      dimanche: 0,
    };

    const availability = {};
    const today = new Date();

    // Pour chaque jour de la semaine actuelle
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];

      // Trouve les disponibilités pour ce jour
      const dayDispos = disponibilites.filter(
        (d) => daysMap[d.jour.toLowerCase()] === date.getDay()
      );

      if (dayDispos.length > 0) {
        availability[dateString] = dayDispos.flatMap((dispo) => [
          dispo.heure_debut,
          dispo.heure_fin,
        ]);
      }
    }

    return availability;
  };

  // Génère des disponibilités par défaut
  const generateDefaultAvailability = () => {
    const availability = {};
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      availability[dateString] = ["09:00", "11:00", "14:00", "16:00"];
    }

    return availability;
  };

  useEffect(() => {
    const fetchRepetiteurData = async () => {
      try {
        setLoading(true);

        const response = await Api.get(`/api/repetiteurs/public/${id}`);

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Erreur de chargement du profil"
          );
        }

        const data = response.data.data;

        // Transforme les disponibilités en format utilisable
        const availability = transformDisponibilites(data.disponibilites);

        setRepetiteur({
          ...data,
          professeur_nom: `${data.user.prenom} ${data.user.nom}`,
          availability: availability,
          tarif: data.tarif_horaire
            ? `${data.tarif_horaire}Fcfa/h`
            : "Non spécifié",
        });
      } catch (error) {
        console.error("Erreur de chargement:", {
          message: error.message,
          response: error.response?.data,
          stack: error.stack,
        });

        setError(
          error.response?.data?.message || error.message || "Erreur serveur"
        );
        toast.error(
          error.response?.data?.message || "Erreur de chargement du profil"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepetiteurData();
  }, [id]);

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setSelectedTime("");
    setStep(1);
  };

  const handleCustomDateSelect = (date) => {
    setCustomDate(date);
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(2);
  };

  const confirmBooking = async () => {
    try {
      const reservationData = {
        repetiteur_id: parseInt(id),
        date: selectedDate,
        heure: selectedTime.padEnd(5, ":00"),
        prix_total: repetiteur.tarif_horaire,
        statut: "en_attente",
      };

      console.log("Données envoyées:", reservationData);

      await Api.get("/sanctum/csrf-cookie");
      const response = await Api.post("/api/reservations", reservationData);

      if (response.data.success) {
        toast.success("Réservation créée avec succès!");
        navigate("/profil");
      }
    } catch (error) {
      console.error("Détails erreur:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      if (error.response?.status == 403) {
        toast.error("Action non autorisée pour votre rôle");
      } else if (error.response?.status === 422) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => {
            toast.error(msg);
          });
      } else {
        toast.error(error.response?.data?.message || "Erreur serveur");
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

  if (error || !repetiteur) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto text-center py-10">
        <p className="text-red-500 mt-20">
          {error || "Impossible de charger les données"}
        </p>
        <div className="mt-4 space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Réessayer
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <div className="mb-8 mt-20">
        <h2 className="text-2xl font-bold mb-4">
          Réserver un cours avec {repetiteur.user?.prenom}{" "}
          {repetiteur.user?.nom}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaUser className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Professeur</p>
              <p>
                {repetiteur.user?.prenom} {repetiteur.user?.nom}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaMoneyBillWave className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Tarif</p>
              <p>{repetiteur.tarif}</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 p-4 rounded-lg">
            <FaBook className="text-blue-600 mr-3" />
            <div>
              <p className="font-semibold">Matières</p>
              <p>{repetiteur.matieres?.length || 0} matières</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Biographie</h3>
          <p>{repetiteur.biographie || "Aucune biographie disponible."}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Matières enseignées</h3>
          <div className="flex flex-wrap gap-2">
            {repetiteur.matieres?.length > 0 ? (
              repetiteur.matieres.map((matiere) => (
                <span
                  key={matiere.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {matiere.nom}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Aucune matière renseignée</p>
            )}
          </div>
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
              <label className="block mb-2 font-medium">
                Sélectionner une date :
              </label>
              <DatePicker
                selected={customDate}
                onChange={(date) => handleCustomDateSelect(date)}
                minDate={new Date()}
                className="w-full p-2 border rounded-lg"
                placeholderText="Cliquez pour choisir une date"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <h4 className="font-medium mb-2">
              Ou sélectionnez parmi les dates disponibles :
            </h4>
            {repetiteur.availability &&
            Object.keys(repetiteur.availability).length > 0 ? (
              <div className="grid grid-cols-7 gap-2">
                {Object.keys(repetiteur.availability).map((date) => (
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
              {repetiteur.availability[selectedDate]?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {repetiteur.availability[selectedDate].map((time) => (
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
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 mb-20">
                  <p>Aucun créneau disponible pour cette date.</p>
                  <p className="mt-2">
                    Veuillez contacter le professeur pour plus d'options.
                  </p>
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
              <p>
                <span className="font-medium">Professeur:</span>{" "}
                {repetiteur.user?.prenom} {repetiteur.user?.nom}
              </p>
              <p>
                <span className="font-medium">Matières:</span>{" "}
                {repetiteur.matieres?.map((m) => m.nom).join(", ")}
              </p>
              <p>
                <span className="font-medium">Tarif horaire:</span>{" "}
                {repetiteur.tarif}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                à {selectedTime}
              </p>
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