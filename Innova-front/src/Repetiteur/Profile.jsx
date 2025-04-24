import React, { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiPhone, FiMapPin, FiDollarSign, FiBook } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';

const ProfileRepetiteur = () => {
  const { user, profile, refetchUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    matieres: [],
    niveaux: [],
    tarif_horaire: '',
    biographie: '',
    rayon_intervention: ''
  });

  // Initialiser les données du formulaire
  useEffect(() => {
    if (profile) {
      setFormData({
        matieres: JSON.parse(profile.matieres || '[]'),
        niveaux: JSON.parse(profile.niveaux || '[]'),
        tarif_horaire: profile.tarif_horaire || '',
        biographie: profile.biographie || '',
        rayon_intervention: profile.rayon_intervention || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, options } = e.target;
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`/api/repetiteurs/${user.id}`, {
        ...formData,
        matieres: JSON.stringify(formData.matieres),
        niveaux: JSON.stringify(formData.niveaux)
      });
      refetchUser();
      setEditMode(false);
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
    }
  };

  if (!user || !profile) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <FaChalkboardTeacher className="mr-3 text-blue-600" />
          Mon Profil Répétiteur
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
                    src={user.photo || "https://source.unsplash.com/random/300x300/?teacher"} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-semibold">{user.prenom} {user.nom}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>{user.telephone || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FiMapPin className="mr-2 text-blue-600" />
                  <span>{user.position || 'Localisation non spécifiée'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Informations professionnelles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informations professionnelles</h2>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Matières enseignées</label>
                      <select
                        multiple
                        name="matieres"
                        value={formData.matieres}
                        onChange={handleArrayChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                      >
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Physique">Physique</option>
                        <option value="Chimie">Chimie</option>
                        <option value="Philosophie">Philosophie</option>
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveaux enseignés</label>
                      <select
                        multiple
                        name="niveaux"
                        value={formData.niveaux}
                        onChange={handleArrayChange}
                        className="w-full p-2 border border-gray-300 rounded-md h-auto min-h-[100px]"
                      >
                        <option value="primaire">Primaire</option>
                        <option value="6eme">6ème</option>
                        <option value="5eme">5ème</option>
                        <option value="4eme">4ème</option>
                        <option value="3eme">3ème</option>
                        <option value="2nd">Seconde</option>
                        <option value="1ere">Première</option>
                        <option value="terminale">Terminale</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (FCFA)</label>
                      <input
                        type="number"
                        name="tarif_horaire"
                        value={formData.tarif_horaire}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rayon d'intervention (km)</label>
                      <input
                        type="number"
                        name="rayon_intervention"
                        value={formData.rayon_intervention}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                    <textarea
                      name="biographie"
                      value={formData.biographie}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md h-32"
                      placeholder="Décrivez votre expérience et méthodologie..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FiSave className="mr-2" /> Sauvegarder
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Matières enseignées</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(profile.matieres || '[]').map((matiere, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {matiere}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Niveaux enseignés</h3>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(profile.niveaux || '[]').map((niveau, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {niveau}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Tarif horaire</h3>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 text-blue-600" />
                        <span>{profile.tarif_horaire || 'Non spécifié'} FCFA</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Rayon d'intervention</h3>
                      <p>{profile.rayon_intervention || 'Non spécifié'} km</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Biographie</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {profile.biographie || 'Aucune description fournie'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Section disponibilités (à implémenter) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Disponibilités</h2>
              <p className="text-gray-600">Fonctionnalité à venir...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRepetiteur;