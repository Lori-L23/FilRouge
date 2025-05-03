import React from "react";

export default function Parametres() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
        <form className="space-y-4 bg-white p-4 rounded shadow max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Email de contact</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe admin</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="••••••••"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Sauvegarder
          </button>
        </form>
      </div>
    );
  }
  