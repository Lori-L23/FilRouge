import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import axios from "axios";
import Api from "../Services/Api";

function Contact() {
  const [formData, setFormData] = useState({
    role: "Élève/Parent",
    subject: "Problème technique",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await Api.post("/api/contact", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setSubmitStatus({
        success: true,
        message: response.data.message || "Message envoyé avec succès!",
      });
      setFormData({
        role: "Élève/Parent",
        subject: "Problème technique",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Erreur complète:", error);
      console.error("Réponse erreur:", error.response);

      let errorMessage = "Erreur lors de l'envoi du message";

      if (error.response) {
        if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="text-center mb-12 mt-20">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">
          Contactez-nous
        </h1>
        <p className="text-xl text-indigo-700 max-w-2xl mx-auto">
          Une question ? Un problème technique ? Nous sommes là pour vous aider
          à connecter Votre eleve a un répétiteur.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulaire de contact */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            Envoyer un message
          </h2>

          {submitStatus && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                submitStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-indigo-700 mb-1"
                  >
                    Vous êtes *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("Élève/Parent")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        formData.role === "Élève/Parent"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <FaUserGraduate /> Élève/Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("Répétiteur")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        formData.role === "Répétiteur"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <FaChalkboardTeacher /> Répétiteur
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-indigo-700 mb-1"
                >
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Problème technique">Problème technique</option>
                  <option value="Question sur les tarifs">
                    Question sur les tarifs
                  </option>
                  <option value="Demande de partenariat">
                    Demande de partenariat
                  </option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez votre demande..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>

        {/* Informations de contact */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              Nos coordonnées
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <FaPhone className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Téléphone</h3>
                  <p className="text-indigo-600">+33 1 23 45 67 89</p>
                  <p className="text-sm text-indigo-500">Lun-Ven, 9h-18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <FaEnvelope className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Email</h3>
                  <p className="text-indigo-600">InnovaLearn@gmail.com</p>
                  <p className="text-sm text-indigo-500">Réponse sous 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  <FaMapMarkerAlt className="text-lg" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Adresse</h3>
                  <p className="text-indigo-600">Akwa Delegation commerce</p>
                  <p className="text-indigo-600"> Littoral, Douala</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Rapide */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              Questions fréquentes
            </h2>

            <div className="space-y-4">
              <div className="border-b border-indigo-100 pb-4">
                <h3 className="font-medium text-indigo-900">
                  Comment devenir répétiteur sur la plateforme ?
                </h3>
                <p className="text-indigo-600 mt-1">
                  Rendez-vous dans l'espace "Devenir tuteur" et complétez votre
                  profil.
                </p>
              </div>

              <div className="border-b border-indigo-100 pb-4">
                <h3 className="font-medium text-indigo-900">
                  Quels sont les tarifs moyens ?
                </h3>
                <p className="text-indigo-600 mt-1">
                  Les tarifs varient entre 2000 et 4000/h selon la matière et le
                  niveau.
                </p>
              </div>

              <div className="">
                <h3 className="font-medium text-indigo-900">
                  Comment sécuriser les paiements ?
                </h3>
                <p className="text-indigo-600 mt-1">
                  Tous les paiements passent par notre plateforme sécurisée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
