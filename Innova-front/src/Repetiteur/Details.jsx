import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import Api from "../Services/Api";
import icon from "../assets/icon.png";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Details = () => {
  const { id } = useParams();
  const [repetiteur, setRepetiteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRepetiteur = async () => {
      try {
        setLoading(true);
        const response = await Api.get(`/api/repetiteurs/public/${id}`);

        if (!response.data.success) {
          throw new Error(response.data.message || "Erreur de chargement");
        }

        const data = response.data.data;

        setRepetiteur({
          ...data,
          avgRating:
            data.feedback?.length > 0
              ? data.feedback.reduce((sum, fb) => sum + fb.note, 0) /
                data.feedback.length
              : null,
          tarif: data.tarif_horaire
            ? `${data.tarif_horaire}Fcfa/h`
            : "Non spécifié",
          niveaux: Array.isArray(data.classes_college)
            ? data.classes_college
            : [],
          matieres: Array.isArray(data.matieres)
            ? data.matieres.map((m) => (typeof m === "object" ? m.nom : m))
            : [],
        });
      } catch (err) {
        console.error("Détails erreur:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepetiteur();
  }, [id]);

  const handleReservationClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast("Veuillez vous connecter pour réserver un cours");
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Veuillez vous connecter pour réserver un cours",
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!repetiteur)
    return <div className="text-center py-20">Aucun répétiteur trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mt-10">
        <div className="md:flex">
          {/* Colonne gauche - Photo et infos rapides */}
          <div className="md:w-1/3 p-6 bg-gray-50">
            <div className="w-full h-64 rounded-lg overflow-hidden mb-6 bg-gray-200 flex items-center justify-center">
              <img
                src={repetiteur?.photo || icon}
                alt={`${repetiteur.user.prenom} ${repetiteur.user.nom}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = icon;
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    repetiteur.statut_verif === "verifie"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {repetiteur.statut_verif === "verifie"
                    ? "Vérifié"
                    : "En attente"}
                </span>
              </div>

              <div className="flex items-center">
                <FaMoneyBillWave className="text-gray-500 mr-2" />
                <span className="font-medium">Tarif:</span>
                <span className="ml-2">{repetiteur.tarif}</span>
              </div>

              <div className="flex items-start">
                <FaClock className="text-gray-500 mr-2 mt-1" />
                <div>
                  <span className="font-medium">Disponibilités:</span>
                  {repetiteur.disponibilites.length > 0 ? (
                    <ul className="ml-2 list-disc list-inside">
                      {repetiteur.disponibilites.map((dispo, index) => (
                        <li key={index} className="text-sm">
                          {dispo.jour}: {dispo.heure}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="ml-2 text-sm">Non spécifiées</span>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={`/reservation/${id}`}
                  onClick={handleReservationClick}
                >
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                    Réserver un cours
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne droite - Détails */}
          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {repetiteur.user.prenom} {repetiteur.user.nom}
              </h1>

              {repetiteur.avgRating && (
                <div className="flex items-center mt-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(repetiteur.avgRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {repetiteur.avgRating} ({repetiteur.feedback?.length || 0}{" "}
                    avis)
                  </span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <FaChalkboardTeacher className="mr-2 text-blue-600" />À propos
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {repetiteur.biographie || "Aucune description fournie."}
              </p>
            </div>

            {/* Matières enseignées */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                Matières enseignées
              </h2>
              <div className="flex flex-wrap gap-2">
                {repetiteur.matieres?.length > 0 ? (
                  repetiteur.matieres.map((matiere, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {matiere}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Aucune matière renseignée</p>
                )}
              </div>
            </div>

            {/* Niveaux enseignés */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Niveaux enseignés</h2>
              <div className="flex flex-wrap gap-2">
                {repetiteur.niveaux?.length > 0 ? (
                  repetiteur.niveaux.map((niveau, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {niveau}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun niveau renseigné</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Cours proposés</h2>
              {repetiteur.cours.length > 0 ? (
                <div className="space-y-4">
                  {repetiteur.cours.map((cours) => (
                    <div
                      key={cours.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <h3 className="font-medium text-lg">{cours.titre}</h3>
                      <p className="text-gray-600 mb-2">{cours.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {cours.matiere?.nom || "Matière inconnue"}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          Niveau: {cours.niveau_scolaire}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Tarif: {cours.tarif_horaire}Fcfa/h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Aucun cours proposé pour le moment
                </p>
              )}
            </div>
            <div className="flex items-start">
              <FaClock className="text-gray-500 mr-2 mt-1" />
              <div>
                <span className="font-medium">Disponibilités:</span>
                {repetiteur.disponibilites?.length > 0 ? (
                  <ul className="ml-2 list-disc list-inside">
                    {repetiteur.disponibilites.map((dispo, index) => (
                      <li key={index} className="text-sm">
                        {dispo.jour}: {dispo.heure_debut} - {dispo.heure_fin}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-sm">Non spécifiées</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
