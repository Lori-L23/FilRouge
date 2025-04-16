import React, { useEffect, useState } from 'react';
import { FaAtom, FaBook, FaGlobeAmericas, FaFlask, FaHistory, FaLanguage, FaSquareRootAlt } from 'react-icons/fa';

const SubjectScroller = () => {
  const subjects = [
    { name: 'Maths', icon: <FaSquareRootAlt className="text-blue-500" />, color: 'bg-blue-100' },
    { name: 'Anglais', icon: <FaLanguage className="text-red-500" />, color: 'bg-red-100' },
    { name: 'Physique', icon: <FaAtom className="text-purple-500" />, color: 'bg-purple-100' },
    { name: 'Histoire', icon: <FaHistory className="text-amber-500" />, color: 'bg-amber-100' },
    { name: 'Géographie', icon: <FaGlobeAmericas className="text-green-500" />, color: 'bg-green-100' },
    { name: 'Chimie', icon: <FaFlask className="text-indigo-500" />, color: 'bg-indigo-100' },
    { name: 'Science', icon: <FaAtom className="text-teal-500" />, color: 'bg-teal-100' },
    { name: 'Littérature', icon: <FaBook className="text-pink-500" />, color: 'bg-pink-100' }
  ];

  // Dupliquez les sujets pour un défilement infini
  const duplicatedSubjects = [...subjects, ...subjects];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Gradient masquage à gauche et droite */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
      
      {/* Animation de défilement */}
      <div className="flex animate-infinite-scroll whitespace-nowrap">
        {duplicatedSubjects.map((subject, index) => (
          <div 
            key={index} 
            className={`inline-flex items-center mx-3 px-6 py-3 rounded-full ${subject.color} shadow-sm hover:shadow-md transition-shadow`}
          >
            <span className="mr-2 text-xl">{subject.icon}</span>
            <span className="font-medium text-gray-800">{subject.name}</span>
          </div>
        ))}
      </div>

      {/* Style CSS pour l'animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: inline-block;
          animation: scroll 20s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SubjectScroller;