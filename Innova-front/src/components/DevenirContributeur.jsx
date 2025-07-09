import React, { useState } from "react";
import { FaChalkboardTeacher, FaHandshake, FaUserPlus } from "react-icons/fa";
import Api from "../Services/Api";

const DevenirContributeur = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    customSubject: "",
    motivation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Déterminer le sujet final
    const finalSubject = formData.subject === "Autre" 
      ? formData.customSubject 
      : formData.subject;

    // Validation côté client
    if (!finalSubject) {
      setSubmitStatus({
        success: false,
        message: "Veuillez sélectionner ou spécifier une matière",
      });
      setIsSubmitting(false);
      return;
    }

    const submissionData = {
      name: formData.name,
      email: formData.email,
      subject: finalSubject,
      motivation: formData.motivation,
    };

    try {
      const response = await Api.post("/api/contributors", submissionData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      setSubmitStatus({
        success: true,
        message: response.data.message || "Votre candidature a été soumise avec succès!",
      });

      // Réinitialiser le formulaire après succès
      setFormData({
        name: "",
        email: "",
        subject: "",
        customSubject: "",
        motivation: "",
      });
    } catch (error) {
      let errorMessage = "Erreur lors de la soumission";
      
      if (error.response) {
        if (error.response.data?.errors) {
          // Gestion des erreurs de validation Laravel
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
        } else if (error.response.data?.message) {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <FaChalkboardTeacher className="inline-block mr-3 text-blue-600" />
            Devenir Contributeur
          </h1>
          <p className="text-xl text-gray-600">
            Partagez votre savoir et aidez des milliers d'étudiants à réussir
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <FaUserPlus className="text-3xl text-blue-600 mb-4" />,
              title: "Processus simple",
              text: "Inscription en 5 minutes seulement",
            },
            {
              icon: <FaHandshake className="text-3xl text-blue-600 mb-4" />,
              title: "Communauté bienveillante",
              text: "Rejoignez notre réseau d'experts",
            },
            {
              icon: <FaChalkboardTeacher className="text-3xl text-blue-600 mb-4" />,
              title: "Flexibilité totale",
              text: "Contribuez selon vos disponibilités",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              {item.icon}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* CTA Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Commencez dès maintenant
          </h2>
          
          {/* Affichage des messages de statut */}
          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom complet *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Domaine d'expertise *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez une matière</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique-Chimie">Physique-Chimie</option>
                <option value="Philosophie">Philosophie</option>
                <option value="Anglais">Anglais</option>
                <option value="Français">Français</option>
                <option value="Histoire-Géographie">Histoire-Géographie</option>
                <option value="Informatique">Informatique</option>
                <option value="Autre">Autre</option>
              </select>

              {formData.subject === "Autre" && (
                <div className="mt-4">
                  <label
                    htmlFor="customSubject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Veuillez préciser votre matière *
                  </label>
                  <input
                    id="customSubject"
                    name="customSubject"
                    type="text"
                    value={formData.customSubject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={formData.subject === "Autre"}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="motivation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Votre motivation *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows="4"
                value={formData.motivation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer ma candidature"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DevenirContributeur;