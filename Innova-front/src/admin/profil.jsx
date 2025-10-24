import React, { useState, useEffect } from "react";
import { FiEdit, FiSave, FiPhone, FiMail, FiCalendar, FiUser } from "react-icons/fi";
import { MdAdminPanelSettings, MdVerified, MdEmail, MdPhone, MdCalendarToday } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import lori from "../assets/lori.jpg";

const ProfileAdministrateur = () => {
  const { user, profileType, refetchUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    telephone: "",
  });

  useEffect(() => {
    if (profileType) {
      setFormData({
        telephone: profileType.telephone || "",
      });
    }
  }, [profileType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Api.put("/api/profile", formData);
      if (response.data?.success) {
        toast.success("Profil mis à jour avec succès");
        refetchUser();
        setEditMode(false);
      } else {
        throw new Error(response.data?.message || "Erreur de mise à jour");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-14">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <MdAdminPanelSettings className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Mon profil administrateur
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez vos informations personnelles et vos paramètres
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-[#7ED321] text-white rounded-lg hover:bg-[#6BBE1F] transition-colors duration-200 font-medium flex items-center"
          >
            <FiUser className="mr-2" />
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de profil */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FiUser className="mr-2" />
                Informations personnelles
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative">
                    <img
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      src={lori}
                      alt="Photo de profil"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                      <MdVerified className="text-white text-sm" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {user?.prenom} {user?.nom}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center">
                      <MdEmail className="mr-2 text-blue-500" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MdAdminPanelSettings className="mr-2 text-purple-500" />
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                        Administrateur
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MdPhone className="inline mr-2 text-blue-500" />
                        Numéro de téléphone
                      </label>
                      <input
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Entrez votre numéro de téléphone"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MdCalendarToday className="inline mr-2 text-blue-500" />
                        Date de naissance
                      </label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                        {user?.date_naissance
                          ? new Date(user.date_naissance).toLocaleDateString("fr-FR")
                          : "Non renseigné"}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      <FiSave className="mr-2" />
                      {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        <MdPhone className="inline mr-2" />
                        Téléphone
                      </label>
                      <p className="text-gray-900 text-lg font-medium">
                        {user?.telephone || "Non renseigné"}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        <MdCalendarToday className="inline mr-2" />
                        Date de naissance
                      </label>
                      <p className="text-gray-900 text-lg font-medium">
                        {user?.date_naissance
                          ? new Date(user.date_naissance).toLocaleDateString("fr-FR")
                          : "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      <MdEmail className="inline mr-2" />
                      Adresse email
                    </label>
                    <p className="text-gray-900 text-lg font-medium">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors duration-200 font-medium"
                  >
                    <FiEdit className="mr-2" />
                    Modifier le profil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar avec informations supplémentaires */}
          <div className="space-y-6">
            {/* Statut du compte */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MdVerified className="mr-2 text-green-500" />
                Statut du compte
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vérification</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Vérifié
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rôle</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                    Administrateur
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="text-gray-900 font-medium">
                    {user?.created_at ? formatDate(user.created_at) : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/DashboardAdmin")}
                  className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                >
                  Tableau de bord
                </button>
                <button
                  onClick={() => navigate("/admin/utilisateurs")}
                  className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium"
                >
                  Gestion des utilisateurs
                </button>
                <button
                  onClick={() => navigate("/admin/parametres")}
                  className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 font-medium"
                >
                  Paramètres système
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdministrateur;