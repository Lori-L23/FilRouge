import React, { useState } from 'react';
import { FiEdit, FiSave, FiPhone, FiBook, FiTarget, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const Profil = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'TEZEMBONG Wendy',
    location: 'Douala, Cameroun',
    birthYear: '2004',
    gender: 'Feminin',
    phone: '',
    level: 'Terminale',
    subjects: ['Mathématiques', 'Physique'],
    goal: 'Préparation au baccalauréat'
  });

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Prof. Dupont', content: 'Votre prochain cours est prévu pour demain à 15h', time: '10:30', unread: true },
    { id: 2, sender: 'InnovaLearn', content: 'Votre compte a été mis à jour', time: 'Hier', unread: false }
  ]);

  const [scheduledClasses, setScheduledClasses] = useState([
    { id: 1, subject: 'Mathématiques', tutor: 'Prof. Dupont', date: '15/06/2023', time: '15:00 - 16:30' },
    { id: 2, subject: 'Physique', tutor: 'Dr. Martin', date: '17/06/2023', time: '10:00 - 11:30' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Ici vous ajouteriez la logique pour sauvegarder dans votre backend
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <FaUserGraduate className="mr-3 text-blue-600" />
          Mon Profil Élève
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Profil */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Votre profil</h2>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <FiEdit className="mr-1" /> Modifier
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                  <img 
                    src="https://source.unsplash.com/random/300x300/?student" 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {editMode && (
                  <button className="text-sm text-blue-600 mb-4">Changer de photo</button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Où êtes-vous?</label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Année de naissance</label>
                      <input
                        type="text"
                        name="birthYear"
                        value={profile.birthYear}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option>Masculin</option>
                        <option>Féminin</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                      >
                        <FiSave className="mr-2" /> Sauvegarder
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg font-semibold">{profile.firstName}</p>
                  <p><span className="font-medium">Localisation:</span> {profile.location}</p>
                  <p><span className="font-medium">Année de naissance:</span> {profile.birthYear}</p>
                  <p><span className="font-medium">Sexe:</span> {profile.gender}</p>
                  <p className="text-gray-500 text-sm">+237</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiPhone className="mr-2 text-blue-600" />
                Téléphone (facultatif)
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Votre numéro de téléphone ne sera pas visible sur InnovaLearn.
              </p>
              <input
                type="tel"
                placeholder="Votre numéro de téléphone"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
          </div>

          {/* Colonne centrale - Cours et objectifs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBook className="mr-2 text-blue-600" />
                Mes cours
              </h2>

              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-3">Que voulez-vous apprendre?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={profile.level}
                      onChange={(e) => setProfile({...profile, level: e.target.value})}
                    >
                      <option>Collège</option>
                      <option>Seconde</option>
                      <option>Première</option>
                      <option>Terminale</option>
                      <option>Université</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={profile.subjects[0]}
                      onChange={(e) => setProfile({...profile, subjects: [e.target.value, ...profile.subjects.slice(1)]})}
                    >
                      <option>Mathématiques</option>
                      <option>Physique</option>
                      <option>Chimie</option>
                      <option>Philosophie</option>
                      <option>SVT</option>
                      <option>Francais(litterature+Langue francaise)</option>
                      <option>Histoire</option>
                      <option>Geographie</option>
                      <option>ECM</option>
                    </select>
                  </div>
                </div>

                <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                  <FiTarget className="mr-1" /> Ajouter une autre matière
                </button>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Quel est votre objectif?</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md h-24"
                  placeholder="Décrivez vos objectifs d'apprentissage..."
                  value={profile.goal}
                  onChange={(e) => setProfile({...profile, goal: e.target.value})}
                />
              </div>
            </div>

            {/* Section Messages */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiMessageSquare className="mr-2 text-blue-600" />
                  Messages
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {messages.filter(m => m.unread).length} non lus
                </span>
              </div>

              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg ${message.unread ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{message.sender}</p>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Cours programmés */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCalendar className="mr-2 text-blue-600" />
                Cours programmés
              </h2>

              <div className="space-y-4">
                {scheduledClasses.map(cls => (
                  <div key={cls.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{cls.subject}</h3>
                        <p className="text-gray-600 flex items-center">
                          <FaChalkboardTeacher className="mr-1 text-blue-600" /> {cls.tutor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{cls.date}</p>
                        <p className="text-gray-600">{cls.time}</p>
                      </div>
                    </div>
                    <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                      Voir les détails
                    </button>
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

export default Profil;