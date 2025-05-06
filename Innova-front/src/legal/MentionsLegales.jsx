import React from 'react';

const MentionsLegales = () => {
  return (
    <div className="bg-white py-12 px-6 md:px-20 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 mt-20">Mentions légales</h1>
        <p className="mb-4"><strong>Éditeur :</strong> Société InnovaLearn Cameroun S.A.R.L.</p>
        <p className="mb-4"><strong>Siège social :</strong> Yaoundé, Cameroun</p>
        <p className="mb-4"><strong>Email :</strong> contact@InnovaLearn-cm.com</p>
        <p className="mb-4"><strong>Téléphone :</strong> +237 6 90 XX XX XX</p>
        <p className="mt-8">
          La plateforme est hébergée sur des serveurs conformes aux normes de sécurité. Toute reproduction ou distribution non autorisée du contenu est strictement interdite.
        </p>
      </div>
    </div>
  );
};

export default MentionsLegales;
