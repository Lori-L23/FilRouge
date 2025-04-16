import React, { useState } from 'react';
import { FiEdit, FiSave, FiMail, FiPhone, FiMapPin, FiDollarSign, FiStar, FiCalendar, FiBook, FiAward } from 'react-icons/fi';
import { FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';
import photo from '../assets/profile.jpg'; // Remplacez par le chemin de votre image

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Prof. Jean Dupont',
    photo: photo,
    subjects: ['Mathématiques', 'Physique'],
    level: 'Lycée',
    experience: '5 ans',
    location: 'Yaoundé, Cameroun',
    rate: '25€/h',
    bio: 'Enseignant certifié avec expérience en prépa scientifique. Méthode adaptée à chaque élève.',
    education: 'Master en Mathématiques, Université de Yaoundé',
    email: 'j.dupont@example.com',
    phone: '+237 6 12 34 56 78',
    available: ['Lun 15h-18h', 'Mer 10h-12h', 'Ven 16h-20h']
  });

  const [reviews, setReviews] = useState([
    { id: 1, student: 'Marie K.', rating: 5, comment: 'Excellent professeur, très patient et pédagogue!', date: '15/06/2023' },
    { id: 2, student: 'Paul L.', rating: 4, comment: 'Progrès significatifs en physique grâce à ses cours', date: '02/06/2023' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Ajouter ici la logique de sauvegarde
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaChalkboardTeacher className="mr-3 text-blue-600" />
            Mon Profil Répétiteur
          </h1>
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg ${editMode ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {editMode ? (
              <>
                <FiEdit className="mr-2" /> Annuler
              </>
            ) : (
              <>
                <FiEdit className="mr-2" /> Modifier le profil
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Photo de profil */}
              <div className="relative">
                <img 
                  src={profile.photo} 
                  alt="Photo de profil" 
                  className="w-full h-48 object-cover"
                />
                {editMode && (
                  <button className="absolute bottom-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-full text-sm shadow-md flex items-center">
                    <FiEdit className="mr-1" /> Changer
                  </button>
                )}
              </div>

              {/* Détails du profil */}
              <div className="p-6">
                {editMode ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matières enseignées</label>
                        <select
                          multiple
                          className="w-full p-2 border border-gray-300 rounded-md h-auto"
                          value={profile.subjects}
                          onChange={(e) => setProfile({...profile, subjects: Array.from(e.target.selectedOptions, option => option.value)})}
                        >
                          <option value="Mathématiques">Mathématiques</option>
                          <option value="Physique">Physique</option>
                          <option value="Chimie">Chimie</option>
                          <option value="Philosophie">Philosophie</option>
                          <option value="Anglais">Anglais</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveau enseigné</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={profile.level}
                          onChange={(e) => setProfile({...profile, level: e.target.value})}
                        >
                          <option>Collège</option>
                          <option>Lycée</option>
                          <option>Université</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
                        <input
                          type="text"
                          name="experience"
                          value={profile.experience}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire</label>
                        <input
                          type="text"
                          name="rate"
                          value={profile.rate}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center mt-4"
                      >
                        <FiSave className="mr-2" /> Sauvegarder
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    
                    <div className="flex items-center text-gray-700">
                      <FaGraduationCap className="mr-2 text-blue-600" />
                      <span>{profile.subjects.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FiBook className="mr-2 text-blue-600" />
                      <span>Niveau: {profile.level}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FiAward className="mr-2 text-blue-600" />
                      <span>Expérience: {profile.experience}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FiMapPin className="mr-2 text-blue-600" />
                      <span>{profile.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FiDollarSign className="mr-2 text-blue-600" />
                      <span>Tarif: {profile.rate}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiMail className="mr-2 text-blue-600" />
                Contact
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiMail className="mr-2 text-gray-500" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiPhone className="mr-2 text-gray-500" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Bio et disponibilités */}
          <div className="lg:col-span-2 space-y-6">
            {/* À propos */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
              {editMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md h-32"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Formation</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md h-24"
                    name="education"
                    value={profile.education}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{profile.bio}</p>
                  <div>
                    <h3 className="font-medium text-gray-900">Formation</h3>
                    <p className="text-gray-700">{profile.education}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Disponibilités */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" />
                  Mes disponibilités
                </h2>
                <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                  <FiEdit className="mr-1" /> Modifier
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {profile.available.map((slot, index) => (
                  <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-center">
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            {/* Avis */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiStar className="mr-2 text-blue-600" />
                  Avis des élèves
                </h2>
                <div className="flex items-center">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">4.8</span>
                  <span className="text-gray-500 ml-1">({reviews.length} avis)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{review.student}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`${i < review.rating ? 'text-yellow-500' : 'text-gray-300'} ml-1`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-gray-400 text-sm">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;