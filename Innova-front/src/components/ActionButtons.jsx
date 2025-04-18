import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();

  // Configuration centralisée pour une meilleure maintenabilité
  const buttonsConfig = [
    {
      id: 1,
      text: 'Trouver un professeur',
      bgColor: 'bg-[#7ED321]',
      textColor: 'text-white',
      border: 'border-2 border-transparent',
      hoverStyles: 'hover:bg-white hover:text-[#7ED321] hover:border-[#7ED321]',
      onClick: () => navigate('/trouver-professeur')
    },
    {
      id: 2,
      text: 'Devenir répétiteur',
      bgColor: 'bg-white',
      textColor: 'text-[#7ED321]',
      border: 'border-2 border-gray-300',
      hoverStyles: 'hover:bg-[#7ED321] hover:text-white hover:border-[#7ED321]',
      onClick: () => navigate('/devenir-repetiteur')
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8">
      {buttonsConfig.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          className={`
            ${button.bgColor}
            ${button.textColor}
            ${button.border}
            ${button.hoverStyles}
            font-medium
            py-3 px-6
            sm:py-3 sm:px-8
            md:py-4 md:px-10
            rounded-lg
            transition-all
            duration-300
            ease-in-out
            transform
            hover:scale-105
            focus:outline-none
            focus:ring-2
            focus:ring-[#7ED321]
            focus:ring-opacity-50
            active:scale-95
            whitespace-nowrap
            text-sm sm:text-base
          `}
          aria-label={button.text}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;