import React from 'react';
import { FiUsers, FiBook, FiDollarSign, FiUserCheck } from 'react-icons/fi';

const StatsCards = ({ elevesCount, repetiteursCount, coursCount, paiementsCount }) => {
  const stats = [
    { title: 'Élèves', value: elevesCount, icon: <FiUsers className="text-blue-500" />, color: 'bg-blue-100' },
    { title: 'Répétiteurs', value: repetiteursCount, icon: <FiUserCheck className="text-green-500" />, color: 'bg-green-100' },
    { title: 'Cours', value: coursCount, icon: <FiBook className="text-purple-500" />, color: 'bg-purple-100' },
    { title: 'Paiements', value: paiementsCount, icon: <FiDollarSign className="text-yellow-500" />, color: 'bg-yellow-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
            <div className="text-3xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;