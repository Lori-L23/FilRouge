import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ListeFeedbacks from "../components/ListeFeedbacks";
import icon from "../assets/icon.png";
import { FaStar } from "react-icons/fa";
import Api from "../Services/Api";

const Details = () => {
  const { id } = useParams();
  const [repetiteur, setRepetiteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepetiteur = async () => {
      // try {
        setLoading(true);
        const response = await Api.get(`/api/repetiteurs/${id}`);

        if (!response) {
          throw new Error("Erreur lors de la récupération");
        }

        // const { data } = await response.json();
        const data = response.data;
        setRepetiteur({
          ...data,
          matieres: Array.isArray(data.matieres) ? data.matieres : [],
          niveaux: Array.isArray(data.niveaux) ? data.niveaux : [],
        });
      // } catch (err) {
      //   setError(err.message);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchRepetiteur();
  }, [id]);

  // if (loading)
  //   return <div className="text-center py-8">Chargement en cours...</div>;
  // if (error)
  //   return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;
  // if (!repetiteur)
  //   return <div className="text-center py-8">Aucun répétiteur trouvé</div>;

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mt-20">
        <div className="md:flex">
          {/* Colonne gauche */}
          <div className="md:w-1/3 p-8">
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <img
                src={repetiteur?.photo || icon}
                alt="Photo du répétiteur"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mb-4">
                Réserver un cours
              </button>
              <div className="space-y-2 text-left">
                {/* <p>
                  <strong>Tarif :</strong>{" "}
                  {repetiteur?.tarif_horaire
                    ? `${repetiteur?.tarif_horaire}€/h`
                    : "Non renseigné"}
                </p> */}
                <p>
                  <strong>Disponibilités :</strong> À définir
                </p>
                <p>
                  <strong>Niveaux :</strong> {repetiteur?.niveaux?.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {repetiteur?.user?.prenom} {repetiteur?.user?.nom}
            </h1>

            {/* Note fictive */}
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < 4 ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-gray-600">7.0 (10 avis)</span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">À propos</h2>
              <p className="text-gray-700">{repetiteur?.biographie}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                Matières enseignées
              </h2>
              <div className="flex flex-wrap gap-2">
                {repetiteur?.matieres?.map((matiere, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {matiere}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Avis</h2>
              <p className="text-gray-700 mb-4">
                Vous pouvez laisser un avis sur mes cours :
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-4">
                Laisser un avis
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-3">Mes Cours</h2>
            <p className="text-gray-700 mb-4">
              Voici la liste de mes cours disponibles :
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {repetiteur?.cours?.map((cours, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                {cours.matieres.nom}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">
              Vous pouvez réserver un cours avec moi :
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-4">
              Réserver un cours
            </button>

         

            {/* <div>
              <ListeFeedbacks repetiteurId={repetiteur?.id} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
