import React from "react";

export default function Eleves() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Élèves</h1>
        <ul className="space-y-4">
          <li className="bg-white p-4 rounded shadow">
            <div>
              <p className="font-semibold">Camille D.</p>
              <p className="text-sm text-gray-600">Niveau: Collège</p>
            </div>
          </li>
        </ul>
      </div>
    );
  }
  