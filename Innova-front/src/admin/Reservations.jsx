import React from "react";
export default function Reservations() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Réservations</h1>
        <ul className="space-y-4">
          <li className="bg-white p-4 rounded shadow">
            <p>
              <span className="font-semibold">Élève:</span> Paul M.
            </p>
            <p>
              <span className="font-semibold">Cours:</span> Français - 14h00 le 5 mai
            </p>
          </li>
        </ul>
      </div>
    );
  }
  