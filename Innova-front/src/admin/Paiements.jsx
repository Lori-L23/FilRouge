import React from "react";

export default function Paiements() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Historique des paiements</h1>
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Utilisateur</th>
              <th className="p-2">Méthode</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">01/05/2025</td>
              <td className="p-2">15 000 FCFA</td>
              <td className="p-2">Sarah L.</td>
              <td className="p-2">Orange Money</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  