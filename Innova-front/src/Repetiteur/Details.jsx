import e from 'express';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Details = () => {
  const { id } = useParams();
  const tutor = tutorData.find(t => t.id === parseInt(id));
  /**
     * Récupère les détails du client depuis l'API
//      */
//   useEffect(() => {
//     const fetchClient = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`http://localhost:3000/repetiteur/details/${id}`);
//             setClient(response.data);
//         } catch (err) {
//             setError("Erreur lors du chargement des détails du client");
//             console.error("Erreur API:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchClient();
// }, [id]); // Dépendance à l'ID pour recharger si changement

  return (
    <div className="container mx-auto px-4 py-8">
      {tutor ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Colonne de gauche */}
            <div className="md:w-1/3 p-8">
              <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                <img 
                  src={tutor.image} 
                  alt={tutor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mb-4">
                  Réserver un cours
                </button>
                
                <div className="space-y-2 text-left">
                  <p><span className="font-medium">Tarif:</span> {tutor.rate}</p>
                  <p><span className="font-medium">Disponibilités:</span> {tutor.availability.join(', ')}</p>
                  <p><span className="font-medium">Niveaux enseignés:</span> {tutor.levels.join(', ')}</p>
                </div>
              </div>
            </div>
            
            {/* Colonne de droite */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(tutor.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-600">{tutor.rating} ({tutor.reviewsCount} avis)</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">À propos</h2>
                <p className="text-gray-700">{tutor.bio}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Matières enseignées</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(subject => (
                    <span key={subject} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Avis des élèves</h2>
                {/* Composant d'avis ici */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Professeur non trouvé</p>
        </div>
      )}
    </div>
  );
};
export default Details;