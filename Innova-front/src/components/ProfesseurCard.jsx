import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";

export default function ProfesseurCard({ repetiteur, note = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (repetiteur?.id) {
      navigate(`/repetiteurs/${repetiteur.repetiteur.id}`);
    }
  };

  // Formatage de la note avec valeur par défaut
  const formattedNote = note?.toFixed?.(1) || "0.0";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full transition hover:shadow-lg">
      {/* Photo & Nom */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={repetiteur.repetiteur.photo || icon}
          alt={`${repetiteur?.prenom || ""} ${repetiteur?.nom || ""}`}
          className="w-16 h-16 rounded-full object-cover border"
          onError={(e) => {
            e.target.src = icon; // Fallback si l'image ne charge pas
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">
            {repetiteur?.prenom || "Prénom"} {repetiteur?.nom || "Nom"}
          </h3>
          <p className="text-sm text-gray-500">
            {repetiteur.repetiteur.niveaux?.join(", ") ||
              "Niveaux non spécifiés"}
          </p>
        </div>
      </div>

      <div className="">
        {/* Matières */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1 ">Matières </p>
          <div className="flex flex-wrap gap-2">
            {repetiteur.repetiteur.matieres?.length > 0 ? (
              repetiteur.repetiteur.matieres.map((matiere, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {matiere}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Non renseignées</span>
            )}
          </div>
        </div>

        {/* Cours */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Cours </p>
          <div className="flex flex-wrap gap-2">
            {repetiteur.repetiteur.cours?.length > 0 ? (
              repetiteur.repetiteur.cours.map((cours, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {cours.matiere.nom}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">Non renseignées</span>
            )}
          </div>
        </div>
      </div>

      {/* biographie */}

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Biographie :</p>
        <div>
          <h3 className="text-sm ">
            {repetiteur.repetiteur.biographie || "bio"}
          </h3>
          {/* <p className="text-sm text-gray-500">
            {repetiteur.repetiteur.niveaux?.join(', ') || 'Niveaux non spécifiés'}
          </p> */}
        </div>
      </div>

      {/* Note */}
      <div className="flex items-center gap-1 mb-4">
        <Star size={16} className="text-yellow-400" />
        <span className="text-sm text-gray-700 font-medium">
          {formattedNote} / 5
        </span>
      </div>

      {/* Tarif horaire */}
      {repetiteur.tarif_horaire && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Tarif :</p>
          <p className="text-sm">{repetiteur.tarif_horaire} €/h</p>
        </div>
      )}

      {/* Bouton */}
      <div className="mt-auto">
        <button
          onClick={handleClick}
          className="w-full bg-blue-600 text-white text-sm py-2 mt-2 rounded-lg hover:bg-blue-700 transition"
        >
          Voir le profil
        </button>
      </div>
    </div>
  );
}
