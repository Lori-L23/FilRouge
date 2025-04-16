import React from 'react'

const confirmation = ({ booking }) => {
    return (
      <div className="text-center py-12">
        <div className="bg-green-100 text-green-800 p-6 rounded-full inline-flex items-center justify-center mb-6">
          <FaCheck className="text-3xl mr-3" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Réservation confirmée !</h2>
        <p className="text-lg mb-8">
          Votre cours de {booking.courseTitle} avec {booking.tutorName} est réservé pour le {booking.date}.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md inline-block text-left max-w-md">
          <h3 className="font-bold mb-3">Détails :</h3>
          <p>📅 {new Date(booking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <p>🕒 {booking.time}</p>
          <p>👨‍🏫 Professeur: {booking.tutorName}</p>
          <p className="mt-4">Un lien de visioconférence vous sera envoyé par email.</p>
        </div>
      </div>
    );
  };

export default confirmation