import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import Api from "../Services/Api";
import icon from "../assets/found1.jpg";
// import LoadingSpinner from "../components/LoadingSpinner"; // Créez ce composant pour un loader uniforme

const Details = () => {
  const { id } = useParams();
  const [repetiteur, setRepetiteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepetiteur = async () => {
      try {
        setLoading(true);
        const response = await Api.get(
          `/api/repetiteurs/${id}?with=user,cours.matiere,feedback`
        );

        if (!response.data) {
          throw new Error("Répétiteur non trouvé");
        }

        const data = response.data;

        // Calcul de la note moyenne
        const avgRating =
          data.feedback?.length > 0
            ? (
                data.feedback.reduce((sum, fb) => sum + fb.note, 0) /
                data.feedback.length
              ).toFixed(1)
            : null;

        setRepetiteur({
          ...data,
          avgRating,
          matieres: Array.isArray(data.matieres) ? data.matieres : [],
          cours: Array.isArray(data.cours) ? data.cours : [],
          niveaux: data.niveaux || [],
          tarif: data.tarif_horaire
            ? `${data.tarif_horaire}€/h`
            : "Non spécifié",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepetiteur();
  }, [id]);

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
                src={icon}
                alt={`${repetiteur.user.prenom} ${repetiteur.user.nom}`}
                className="w-full h-full object-cover"
                // onError={(e) => {
                //   e.target.src = "/default-avatar.png";
                // }}
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

              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-2" />
                <span className="font-medium">Disponibilités:</span>
                <span className="ml-2">Lun-Ven, 9h-18h</span>{" "}
                {/* À adapter avec vos données */}
              </div>

              <div className="pt-4">
                <Link to={`/reservation/${id}`}>
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

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                Matières enseignées
              </h2>
              <div className="flex flex-wrap gap-2">
                {repetiteur.matieres.length > 0 ? (
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

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Niveaux enseignés</h2>
              <div className="flex flex-wrap gap-2">
                {repetiteur.niveaux.length > 0 ? (
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

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Cours </p>
              <div className="flex flex-wrap gap-2">
                {repetiteur.cours?.length > 0 ? (
                  repetiteur.cours.map((cours, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default Details;
