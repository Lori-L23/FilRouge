import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";

export default function ProfesseurCard({ repetiteur, note = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (repetiteur?.repetiteur?.id) {
      navigate(`/repetiteurs/${repetiteur.repetiteur.id}`);
    }
  };

  // Formatage de la note avec valeur par défaut
  const formattedNote = note?.toFixed?.(1) || "0.0";

  // Fonction pour gérer les niveaux
  const getNiveaux = () => {
    if (!repetiteur.repetiteur?.niveau_principal) return "Niveaux non spécifiés";
    
    if (Array.isArray(repetiteur.repetiteur.niveau_principal)) {
      return repetiteur.repetiteur.niveau_principal.join(", ");
    }
    
    try {
      const parsed = JSON.parse(repetiteur.repetiteur.niveau_principal);
      return Array.isArray(parsed) ? parsed.join(", ") : repetiteur.repetiteur.niveau_principal;
    } catch {
      return repetiteur.repetiteur.niveau_principal;
    }
  };

  // Fonction pour gérer les classes collège
  const getClassesCollege = () => {
    if (!repetiteur.repetiteur?.classes_college) return [];
    
    try {
      if (Array.isArray(repetiteur.repetiteur.classes_college)) {
        return repetiteur.repetiteur.classes_college;
      }
      const parsed = JSON.parse(repetiteur.repetiteur.classes_college);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return Array.isArray(repetiteur.repetiteur.classes_college) 
        ? repetiteur.repetiteur.classes_college 
        : [repetiteur.repetiteur.classes_college];
    }
  };

  // FONCTION SIMPLIFIÉE POUR LES MATIÈRES
  const getMatieres = () => {
    console.log("=== STRUCTURE DU PROFESSEUR ===", repetiteur);
    
    // Si les matières sont directement dans repetiteur.matieres
    if (repetiteur?.matieres && Array.isArray(repetiteur.matieres)) {
      return repetiteur.matieres;
    }
    
    // Si les matières sont dans repetiteur.repetiteur.matieres
    if (repetiteur?.repetiteur?.matieres && Array.isArray(repetiteur.repetiteur.matieres)) {
      return repetiteur.repetiteur.matieres;
    }
    
    // Si c'est une relation many-to-many via matiere_repetiteur
    if (repetiteur?.matiere_repetiteur && Array.isArray(repetiteur.matiere_repetiteur)) {
      return repetiteur.matiere_repetiteur.map(mr => mr.matiere).filter(Boolean);
    }
    
    return [];
  };

  const matieres = getMatieres();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full transition hover:shadow-lg">
      {/* Photo & Nom */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={repetiteur.repetiteur?.photo || icon}
          alt={`${repetiteur?.prenom || ""} ${repetiteur?.nom || ""}`}
          className="w-16 h-16 rounded-full object-cover border"
          onError={(e) => {
            e.target.src = icon;
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">
            {repetiteur?.prenom || "Prénom"} {repetiteur?.nom || "Nom"}
          </h3>
          <p className="text-sm text-gray-500">{getNiveaux()}</p>
        </div>
      </div>

      <div className="">
        {/* MATIÈRES */}
        {/* <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Matières enseignées</p>
          <div className="flex flex-wrap gap-2">
            {matieres.length > 0 ? (
              matieres.map((matiere, index) => (
                <span
                  key={matiere.id || index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {matiere.nom}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">
                {repetiteur.repetiteur?.matiere_principale || "Matières non spécifiées"}
              </span>
            )}
          </div>
        </div> */}

        {/* Classes Collège */}
        {repetiteur.repetiteur?.niveau_principal === "college/lycee" && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Classes Collège :
            </p>
            <div className="flex flex-wrap gap-2">
              {getClassesCollege().length > 0 ? (
                getClassesCollege().map((classe, index) => (
                  <span
                    key={index}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                  >
                    {classe}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Non renseignées</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Biographie */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Biographie :</p>
        <div>
          <p className="text-sm text-gray-600 line-clamp-3">
            {repetiteur.repetiteur?.biographie || "Aucune biographie fournie"}
          </p>
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
      {repetiteur.repetiteur?.tarif_horaire && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Tarif :</p>
          <p className="text-sm font-semibold text-green-600">
            {repetiteur.repetiteur.tarif_horaire} fcfa/h
          </p>
        </div>
      )}

      {/* Rayon d'intervention */}
      {repetiteur.repetiteur?.rayon_intervention && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Rayon :</p>
          <p className="text-sm text-gray-600">
            {repetiteur.repetiteur.rayon_intervention} km
          </p>
        </div>
      )}

      {/* Statut vérification */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Statut :</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          repetiteur.repetiteur?.statut_verif === "verifie" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {repetiteur.repetiteur?.statut_verif === "verifie" ? "✓ Vérifié" : "En attente"}
        </span>
      </div>

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