import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCheck,
  FaUser,
  FaBook,
  FaMoneyBillWave,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
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

  // États principaux
  const [repetiteur, setRepetiteur] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customDate, setCustomDate] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);


  // Mapping des jours de la semaine
  const daysMap = useMemo(() => ({
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
    dimanche: 0,
  }), []);

  // Fonction pour transformer les disponibilités en créneaux
  const transformDisponibilites = useCallback((disponibilites) => {
    const availability = {};
    const today = new Date();

    // Pour chaque jour de la semaine actuelle et suivante
    for (let i = 0; i < 14; i++) {
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
  }, [daysMap]);

  // Récupération des données du répétiteur
  const fetchRepetiteurData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await Api.get(`/api/repetiteurs/public/${id}`);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Erreur de chargement du profil"
        );
      }

      const data = response.data.data;
      const availability = transformDisponibilites(data.disponibilites);

      setRepetiteur({
        ...data,
        professeur_nom: `${data.user.prenom} ${data.user.nom}`,
        availability: availability,
        tarif: data.tarif_horaire
          ? `${data.tarif_horaire} Fcfa/h`
          : "Non spécifié",
        matieres: data.matieres || [],
      });
    } catch (error) {
      console.error("Erreur de chargement:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });

      const errorMessage = error.response?.data?.message || error.message || "Erreur serveur";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, transformDisponibilites]);

  useEffect(() => {
    fetchRepetiteurData();
  }, [fetchRepetiteurData]);

  // Gestion de la sélection de date
  const handleDateSelect = useCallback((date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setSelectedTime("");
    setStep(1);
  }, []);

  const handleCustomDateSelect = useCallback((date) => {
    if (!date) return;

    setCustomDate(date);
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setSelectedTime("");
  }, []);

  const handleTimeSelect = useCallback((time) => {
    setSelectedTime(time);
    setStep(2);
  }, []);
  const MatiereSelector = () => (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-4">
        <FaBook className="mr-2 text-blue-600" />
        Choisissez une matière
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {repetiteur.matieres?.length > 0 ? (
          repetiteur.matieres.map((matiere) => (
            <button
              key={matiere.id}
              onClick={() => setSelectedMatiere(matiere)}
              className={`p-4 rounded-lg border-2 font-medium transition ${selectedMatiere?.id === matiere.id
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700"
                }`}
            >
              {matiere.nom}
            </button>
          ))
        ) : (
          <p className="text-gray-500 italic col-span-full">
            Aucune matière disponible pour ce professeur
          </p>
        )}
      </div>
    </div>
  );

  // Confirmation de la réservation
  const confirmBooking = useCallback(async () => {
    if (!user || !repetiteur) {
      toast.error("Informations manquantes");
      return;
    }

    // Vérifier si une matière est sélectionnée
    const matiereAReserver = selectedMatiere || repetiteur.matieres?.[0];

    if (!matiereAReserver) {
      toast.error("Aucune matière disponible pour ce professeur");
      return;
    }

    try {
      setBookingLoading(true);
      // Récupérer la première matière enseignée par le répétiteur
      const matierePrincipale = repetiteur.matieres?.[0];


      // DEBUG: Vérifiez les données reçues
      console.log("Matières du répétiteur:", repetiteur.matieres);
      console.log("Matière principale:", matierePrincipale);
      console.log("Cours disponibles:", repetiteur.cours);

      const reservationData = {
        repetiteur_id: parseInt(id),
        cours_id: repetiteur.cours?.[0]?.id || null,
        matiere_id: matiereAReserver?.id || null,
        date: selectedDate,
        heure: selectedTime.padEnd(8, ":00"),
        duree_heures: 2.0,
        prix_total: repetiteur.tarif_horaire || 0,
        statut: "en_attente",
        statut_paiement: "en_attente",
        mode_paiement: "mobile money",
      };

      console.log("Données de réservation:", reservationData);

      await Api.get("/sanctum/csrf-cookie");
      const response = await Api.post("/api/reservations", reservationData);

      if (response.data.success) {
        toast.success("Réservation créée avec succès!");
        navigate("/profil");
      }
    } catch (error) {
      console.error("Erreur de réservation:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      if (error.response?.status === 403) {
        toast.error("Action non autorisée pour votre rôle");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.values(errors).flat().forEach((msg) => {
            toast.error(msg);
          });
        }
      } else {
        toast.error(
          error.response?.data?.message || "Erreur lors de la réservation"
        );
      }
    } finally {
      setBookingLoading(false);
    }
  }, [user, repetiteur, selectedDate, selectedTime, id, navigate]);

  // Fonction pour formater une date
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  // Fonction pour formater une date courte
  const formatShortDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  // Vérification si une date est disponible
  const isDateAvailable = useCallback((date) => {
    const dateString = date.toISOString().split("T")[0];
    return repetiteur?.availability?.[dateString]?.length > 0;
  }, [repetiteur?.availability]);

  // Composant de chargement
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Composant d'erreur
  const ErrorDisplay = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto text-center py-10">
      <div className="text-red-500 mb-4">
        <FaInfoCircle className="mx-auto text-4xl mb-2" />
        <p className="text-lg">{error || "Impossible de charger les données"}</p>
      </div>
      <div className="space-x-2">
        <button
          onClick={fetchRepetiteurData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Réessayer
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
        >
          <FaArrowLeft className="inline mr-2" />
          Retour
        </button>
      </div>
    </div>
  );

  // Composant d'information du professeur
  const TeacherInfo = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">
        Réserver un cours avec {repetiteur.user?.prenom} {repetiteur.user?.nom}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
          <FaUser className="text-blue-600 mr-3 text-xl" />
          <div>
            <p className="font-semibold text-gray-700">Professeur</p>
            <p className="text-gray-900">
              {repetiteur.user?.prenom} {repetiteur.user?.nom}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-green-50 p-4 rounded-lg">
          <FaMoneyBillWave className="text-green-600 mr-3 text-xl" />
          <div>
            <p className="font-semibold text-gray-700">Tarif</p>
            <p className="text-gray-900 font-medium">{repetiteur.tarif}</p>
          </div>
        </div>

        <div className="flex items-center bg-purple-50 p-4 rounded-lg">
          <FaBook className="text-purple-600 mr-3 text-xl" />
          <div>
            <p className="font-semibold text-gray-700">Matières</p>
            <p className="text-gray-900">{repetiteur.matieres?.length || 0} matières</p>
          </div>
        </div>
      </div>

      {repetiteur.biographie && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2 text-gray-800">Biographie</h3>
          <p className="text-gray-700 leading-relaxed">{repetiteur.biographie}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3 text-gray-800">Matières enseignées</h3>
        <div className="flex flex-wrap gap-2">
          {repetiteur.matieres?.length > 0 ? (
            repetiteur.matieres.map((matiere) => (
              <span
                key={matiere.id}
                className={`bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium ${selectedMatiere?.id === matiere.id ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                {matiere.nom}
              </span>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune matière renseignée</p>
          )}
        </div>
      </div>
    </div>
  );

  // Composant de sélection de date et heure
  const DateTimeSelector = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="flex items-center text-lg font-semibold mb-4">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          Choisissez une date
        </h3>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Sélectionner une date personnalisée :
          </label>
          <DatePicker
            selected={customDate}
            onChange={handleCustomDateSelect}
            minDate={new Date()}
            filterDate={isDateAvailable}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholderText="Cliquez pour choisir une date"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <h4 className="font-medium mb-3 text-gray-700">
          Ou sélectionnez parmi les dates disponibles :
        </h4>
        {repetiteur.availability && Object.keys(repetiteur.availability).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.keys(repetiteur.availability).slice(0, 8).map((date) => (
              <button
                key={date}
                onClick={() => handleDateSelect(new Date(date))}
                className={`p-3 rounded-lg text-sm font-medium transition ${selectedDate === date
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                {formatShortDate(date)}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">Aucune disponibilité programmée</p>
          </div>
        )}
      </div>

      {selectedDate && (
        <div>
          <h3 className="flex items-center text-lg font-semibold mb-4">
            <FaClock className="mr-2 text-blue-600" />
            Créneaux disponibles
          </h3>
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              Date sélectionnée : <span className="font-medium">{formatDate(selectedDate)}</span>
            </p>
          </div>

          {repetiteur.availability[selectedDate]?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {repetiteur.availability[selectedDate].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded-lg border-2 font-medium transition ${selectedTime === time
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                    : "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700"
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Aucun créneau disponible pour cette date.
              </p>
              <p className="text-yellow-700 mt-1 text-sm">
                Veuillez contacter le professeur pour plus d'options.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Composant de récapitulatif
  const BookingSummary = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-semibold mb-4 text-blue-800 text-lg">
          Récapitulatif de votre réservation
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Professeur:</span>
            <span className="text-gray-900">
              {repetiteur.user?.prenom} {repetiteur.user?.nom}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Matières:</span>
            <span className="text-gray-900">
            {selectedMatiere?.nom || repetiteur.matieres?.[0]?.nom || "Non spécifiée"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Tarif horaire:</span>
            <span className="text-gray-900 font-semibold">{repetiteur.tarif}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Date et heure:</span>
            <span className="text-gray-900">
              {formatDate(selectedDate)} à {selectedTime}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="font-medium text-gray-700">Durée:</span>
            <span className="text-gray-900">2 heures</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg transition font-medium"
        >
          <FaArrowLeft className="inline mr-2" />
          Modifier
        </button>
        <button
          onClick={confirmBooking}
          disabled={bookingLoading}
          className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center transition font-medium ${bookingLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {bookingLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Confirmation...
            </>
          ) : (
            <>
              <FaCheck className="mr-2" />
              Confirmer la réservation
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Rendu principal
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !repetiteur) {
    return <ErrorDisplay />;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
      <div className="mt-20">
        <TeacherInfo />

        {step === 1 && (
          <>
            <MatiereSelector />
            <DateTimeSelector />
          </>
        )}        {step === 2 && <BookingSummary />}
      </div>
    </div>
  );
};

export default Reservation;