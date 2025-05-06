import React from 'react';

const Confidentialite = () => {
  return (
    <div className="bg-gray-50 py-12 px-6 md:px-20 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 mt-20">Politique de Confidentialité</h1>
        <p className="mb-4">
          Cette politique de confidentialité décrit comment nous recueillons, utilisons et protégeons les informations personnelles des utilisateurs de notre plateforme éducative basée au Cameroun.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Données collectées</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Nom, prénom, email, numéro de téléphone</li>
          <li>Informations scolaires ou professionnelles</li>
          <li>Données de navigation sur la plateforme</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Finalité de la collecte</h2>
        <p className="mb-4">Vos données sont utilisées pour :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Améliorer nos services éducatifs</li>
          <li>Mettre en relation élèves et répétiteurs</li>
          <li>Communiquer avec vous concernant votre compte ou des mises à jour importantes</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Hébergement & Sécurité</h2>
        <p className="mb-4">
          Les données sont hébergées de manière sécurisée. Nous utilisons des outils de chiffrement et des serveurs conformes aux normes en vigueur au Cameroun.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Vos droits</h2>
        <p className="mb-4">
          Conformément à la loi camerounaise sur la protection des données personnelles, vous pouvez accéder, modifier ou supprimer vos données à tout moment.
        </p>
      </div>
    </div>
  );
};

export default Confidentialite;
