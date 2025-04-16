import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaCheck, FaTimes } from 'react-icons/fa';


// Composant TutorCard pour l'affichage des résultats
const Recherche = ({ tutor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img 
            src={tutor.image} 
            alt={tutor.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
            {tutor.verified && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Vérifié
              </span>
            )}
          </div>
          
          <div className="flex items-center my-2">
            <div className="flex text-yellow-500 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(tutor.rating) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-gray-600">{tutor.rating}</span>
          </div>
          
          <div className="mb-4">
            <p className="font-medium">Matières:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tutor.subjects.map(subject => (
                <span key={subject} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold">{tutor.rate}</span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
              Voir profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recherche;