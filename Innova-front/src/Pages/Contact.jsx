import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

function Contact() {
  return (
    <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">Contactez-nous</h1>
        <p className="text-xl text-indigo-700 max-w-2xl mx-auto">
          Une question ? Un problème technique ? Nous sommes là pour vous aider à connecter Votre eleve a un répétiteur.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulaire de contact */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            Envoyer un message
          </h2>
          
          <form className="space-y-6">
            <div className="flex ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                <label htmlFor="role" className="block text-sm font-medium text-indigo-700 mb-1">
                  Vous êtes *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200"
                  >
                    <FaUserGraduate /> Élève/Parent
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200"
                  >
                    <FaChalkboardTeacher /> Répétiteur
                  </button>
                </div>
              </div>
 
                </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-indigo-700 mb-1 ">
                  Sujet *
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Problème technique</option>
                  <option>Question sur les tarifs</option>
                  <option>Demande de partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-indigo-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez votre demande..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Informations de contact */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">Nos coordonnées</h2>
            
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
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">Questions fréquentes</h2>
            
            <div className="space-y-4">
              <div className="border-b border-indigo-100 pb-4">
                <h3 className="font-medium text-indigo-900">Comment devenir répétiteur sur la plateforme ?</h3>
                <p className="text-indigo-600 mt-1">Rendez-vous dans l'espace "Devenir tuteur" et complétez votre profil.</p>
              </div>
              
              <div className="border-b border-indigo-100 pb-4">
                <h3 className="font-medium text-indigo-900">Quels sont les tarifs moyens ?</h3>
                <p className="text-indigo-600 mt-1">Les tarifs varient entre 15€ et 40€/h selon la matière et le niveau.</p>
              </div>
              
              <div className="">
                <h3 className="font-medium text-indigo-900">Comment sécuriser les paiements ?</h3>
                <p className="text-indigo-600 mt-1">Tous les paiements passent par notre plateforme sécurisée.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;