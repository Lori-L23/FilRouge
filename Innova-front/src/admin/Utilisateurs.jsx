import React from 'react';

export default function Utilisateurs() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 mt-20">Gestion des utilisateurs</h1>
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rôle</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Jean Dupont</td>
              <td className="p-2">jean@example.com</td>
              <td className="p-2">Élève</td>
              <td className="p-2 space-x-2">
                <button className="text-blue-500 hover:underline">Modifier</button>
                <button className="text-red-500 hover:underline">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  