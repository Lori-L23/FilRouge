import React, { useState, useEffect } from "react";
import { FiEdit, FiSave, FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import { MdAdminPanelSettings, MdVerified } from "react-icons/md";
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <MdAdminPanelSettings className="mr-2 text-blue-600" />
              Mon profil
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#7ED321] text-white rounded-md hover:bg-[#9ac46e] hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Profil Card */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 ">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <img
                  className="h-25 w-25 rounded-full object-center"
                  src={lori}
                  alt="admin"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {user?.nom} {user?.prenom}
                </h2>
                <p className="text-gray-600 flex items-center justify-center">
                  <FiMail className="mr-1" /> {user?.email}
                </p>
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <MdVerified className="mr-1" />
                  <span className="text-sm">Administrateur vérifié</span>
                </div>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
                      disabled={loading}
                    >
                      <FiSave className="mr-2" />
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Téléphone
                  </h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <FiPhone className="mr-2" />{" "}
                    {user?.telephone || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date de naissance
                  </h3>
                  <p className="mt-1 text-gray-900 flex items-center">
                    <FiCalendar className="mr-2" />{" "}
                    {user?.date_naissance
                      ? new Date(user.date_naissance).toLocaleDateString(
                          "fr-FR"
                        )
                      : "Non renseigné"}
                  </p>
                </div>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition-colors"
                >
                  <FiEdit className="mr-2" />
                  Modifier le profil
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdministrateur;
