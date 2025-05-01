import React, { useState, useEffect } from "react";

const temoignagesData = [
  {
    nom: "Amina D.",
    message: "Grâce à InnovaLearn, ma fille a trouvé un super répétiteur en maths. Les progrès sont visibles !",
    ville: "Douala",
  },
  {
    nom: "Jean-Michel T.",
    message: "Très bonne plateforme, intuitive et rapide pour trouver des enseignants disponibles près de chez moi.",
    ville: "Yaoundé",
  },
  {
    nom: "Brigitte M.",
    message: "Le suivi est impeccable, j’ai adoré le service client et la simplicité d’utilisation.",
    ville: "Bafoussam",
  },
];

const Temoinages = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % temoignagesData.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + temoignagesData.length) % temoignagesData.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % temoignagesData.length);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 mt-20">Témoignages</h1>
      <div className="relative bg-white p-6 rounded-lg shadow-md transition-all duration-500">
        <p className="text-gray-700 italic mb-4">“{temoignagesData[index].message}”</p>
        <p className="font-semibold text-[#7ED321]">{temoignagesData[index].nom}</p>
        <p className="text-gray-500">{temoignagesData[index].ville}</p>

        {/* Boutons de navigation */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default Temoinages;
