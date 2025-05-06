import React from 'react';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className={`${color} p-4 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;