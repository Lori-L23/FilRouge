import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserGraduate, 
  faChalkboardTeacher, 
  faBook, 
  faMoneyBillWave,
  faCalendarAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const DashboardStats = ({ data }) => {
  /**
   * Configuration des cartes de statistiques
   * Chaque objet contient :
   * - title: Titre affiché
   * - value: Valeur à afficher (récupérée des props data)
   * - icon: Icône FontAwesome
   * - color: Couleur Tailwind (text- et bg-)
   * - progress: Pourcentage de progression
   * - link: Lien de navigation
   */
  const statsConfig = [
    {
      title: 'Élèves',
      value: data?.eleves || 0,
      icon: faUserGraduate,
      color: 'bg-blue-600 hover:bg-blue-700',
      progress: 75,
      link: '/admin/eleves'
    },
    {
      title: 'Répétiteurs',
      value: data?.repetiteurs || 0,
      icon: faChalkboardTeacher,
      color: 'bg-green-600 hover:bg-green-700',
      progress: 60,
      link: '/admin/repetiteurs'
    },
    {
      title: 'Cours',
      value: data?.cours || 0,
      icon: faBook,
      color: 'bg-cyan-600 hover:bg-cyan-700',
      progress: 45,
      link: '/admin/cours'
    },
    {
      title: 'Paiements',
      value: data?.paiements || 0,
      icon: faMoneyBillWave,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      progress: 30,
      link: '/admin/paiements'
    },
    {
      title: 'Sessions à venir',
      value: data?.sessions || 0,
      icon: faCalendarAlt,
      color: 'bg-gray-600 hover:bg-gray-700',
      progress: 20,
      link: '/admin/calendrier'
    },
    {
      title: 'Taux de complétion',
      value: `${data?.completionRate || 0}%`,
      icon: faCheckCircle,
      color: 'bg-red-600 hover:bg-red-700',
      progress: data?.completionRate || 0,
      link: '/admin/rapports'
    }
  ];

  return (
    // Grille responsive avec espacement entre les éléments
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statsConfig.map((stat, index) => (
        // Carte cliquable avec transition et ombre
        <div 
          key={index}
          className={`rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer text-white p-4 ${stat.color}`}
          onClick={() => window.location.href = stat.link}
        >
          {/* Contenu de la carte */}
          <div className="flex justify-between items-center">
            <div>
              {/* Titre en gras */}
              <h3 className="font-bold text-sm mb-1">{stat.title}</h3>
              {/* Valeur en grande taille */}
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            {/* Icône avec opacité réduite */}
            <FontAwesomeIcon 
              icon={stat.icon} 
              size="lg" 
              className="opacity-50"
            />
          </div>
          
          {/* Barre de progression */}
          <div className="mt-3">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
              <div 
                className="bg-white h-1.5 rounded-full" 
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
            {/* Légende de progression */}
            <span className="text-xs opacity-80 block mt-1">
              {stat.progress}% {stat.title === 'Taux de complétion' ? '' : 'de croissance'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Validation des props avec PropTypes
DashboardStats.propTypes = {
  data: PropTypes.shape({
    eleves: PropTypes.number,
    repetiteurs: PropTypes.number,
    cours: PropTypes.number,
    paiements: PropTypes.number,
    sessions: PropTypes.number,
    completionRate: PropTypes.number
  })
};

export default DashboardStats;