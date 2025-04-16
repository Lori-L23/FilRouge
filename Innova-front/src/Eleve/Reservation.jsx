import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaShoppingCart, FaCheck } from 'react-icons/fa';

const Reservation = ({ course }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1); // 1: Sélection, 2: Confirmation

  // Fonctions de gestion
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep(1);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(2);
  };

  const confirmBooking = () => {
    // Envoyer la réservation au backend
    console.log(`Réservation confirmée: ${course.title} le ${selectedDate} à ${selectedTime}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Réserver: {course.title}</h2>
      
      {/* Étape 1: Sélection du créneau */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendrier */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Choisissez une date
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {Object.keys(course.availability).map(date => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
          </div>

          {/* Horaires disponibles */}
          {selectedDate && (
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-4">
                <FaClock className="mr-2 text-blue-600" />
                Créneaux disponibles
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {course.availability[selectedDate].map(time => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="p-3 bg-gray-100 hover:bg-blue-100 border border-blue-200 rounded-lg"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Étape 2: Confirmation */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Récapitulatif</h3>
            <p><span className="font-medium">Cours:</span> {course.title}</p>
            <p><span className="font-medium">Professeur:</span> {course.tutor}</p>
            <p><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg"
            >
              Modifier
            </button>
            <button
              onClick={confirmBooking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
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