import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "Comment fonctionne InnovaLearn?",
      reponse:
        "InnovaLearn met en relation des élèves avec des répétiteurs qualifiés en fonction de leurs besoins scolaires.",
    },
    {
      question: "Est-ce que les répétiteurs sont vérifiés ?",
      reponse:
        "Oui, chaque répétiteur est vérifié manuellement avant de pouvoir proposer ses services.",
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      reponse:
        "Nous acceptons les paiements par Mobile Money (Orange, MTN) et cartes bancaires.",
    },
    {
      question: "Puis-je changer de répétiteur ?",
      reponse:
        "Oui, si vous n’êtes pas satisfait, vous pouvez changer de répétiteur depuis votre profil.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 mt-20 t">Foire aux Questions (FAQ)</h1>
      <div className="space-y-4">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-medium hover:bg-gray-50 focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span>{item.question}</span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? "max-h-40 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{item.reponse}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
