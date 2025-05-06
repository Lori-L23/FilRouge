import React from 'react';

const CGU = () => {
  return (
    <div className="bg-gray-100 py-12 px-6 md:px-20 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 mt-20">Conditions Générales d'Utilisation</h1>
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Objet</h2>
        <p className="mb-4">
          Les présentes CGU ont pour objet de définir les modalités d'utilisation des services proposés sur notre plateforme éducative.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">2. Inscription</h2>
        <p className="mb-4">
          L'accès aux fonctionnalités complètes nécessite une inscription en tant qu'élève ou répétiteur.
        </p>
        <h2 className="text-xl font-semibold mt-4 mb-2">3. Obligations des utilisateurs</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Fournir des informations exactes</li>
          <li>Respecter les règles de courtoisie</li>
          <li>Ne pas usurper l'identité d’un autre utilisateur</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">4. Suspension / Suppression</h2>
        <p className="mb-4">
          La plateforme se réserve le droit de suspendre ou supprimer tout compte ne respectant pas les présentes conditions.
        </p>
      </div>
    </div>
  );
};

export default CGU;
