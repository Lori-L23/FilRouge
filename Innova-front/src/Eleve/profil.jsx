import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiPhone, FiBook, FiTarget, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { FaUserGraduate } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';

const ProfileEleve = () => {
  const { user, profile, refetchUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    telephone: '',
    niveau_scolaire: '',
    objectif: ''
  });

  // Initialiser les données du formulaire
  useEffect(() => {
    if (profile) {
      setFormData({
        telephone: user?.telephone || '',
        niveau_scolaire: profile?.niveau_scolaire || '',
        objectif: profile?.objectif || ''
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mise à jour des données utilisateur
      await Api.put(`/api/eleves/${user.id}`, formData);
      refetchUser(); // Recharger les données
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (!user || !profile) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

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
                <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
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
                    src={user.photo || "https://source.unsplash.com/random/300x300/?student"} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveau scolaire</label>
                      <select
                        name="niveau_scolaire"
                        value={formData.niveau_scolaire}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="6eme">6ème</option>
                        <option value="5eme">5ème</option>
                        <option value="4eme">4ème</option>
                        <option value="3eme">3ème</option>
                        <option value="2nd">Seconde</option>
                        <option value="1ere">Première</option>
                        <option value="terminale">Terminale</option>
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
                  <p className="text-lg font-semibold">{user.prenom} {user.nom}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Téléphone:</span> {user.telephone || 'Non renseigné'}</p>
                  <p><span className="font-medium">Niveau scolaire:</span> {profile.niveau_scolaire}</p>
                  <p><span className="font-medium">Date de naissance:</span> {new Date(user.date_naissance).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne centrale - Cours et objectifs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBook className="mr-2 text-blue-600" />
                Mes informations académiques
              </h2>

              {editMode ? (
                <div className="mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objectif d'apprentissage</label>
                    <textarea
                      name="objectif"
                      className="w-full p-3 border border-gray-300 rounded-md h-24"
                      value={formData.objectif}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Objectif d'apprentissage</h3>
                    <p className="text-gray-700">{profile.objectif || "Non spécifié"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section Cours programmés (à remplacer par vos données réelles) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCalendar className="mr-2 text-blue-600" />
                Mes cours réservés
              </h2>
              <p className="text-gray-600">Fonctionnalité à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEleve;