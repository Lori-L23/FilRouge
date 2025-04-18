import React from 'react';
import { FaChalkboardTeacher, FaHandshake, FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';

const DevenirContributeur = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    customSubject: '',
    motivation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Détermine la matière finale
    const finalSubject = formData.subject === 'Autre' 
      ? formData.customSubject 
      : formData.subject;
  
    if (!finalSubject) {
      alert('Veuillez sélectionner ou spécifier une matière');
      return;
    }
  
    // Validation des champs obligatoires
    if (!formData.name || !formData.email || !formData.motivation) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
  
    // Soumission avec la matière correcte
    const submissionData = {
      ...formData,
      subject: finalSubject
    };
  
    // Envoi des données...
    console.log('Données soumises:', submissionData);
    alert('Votre candidature a été soumise avec succès !');
    
    // Réinitialisation du formulaire
    setFormData({
      name: '',
      email: '',
      subject: '',
      customSubject: '',
      motivation: ''
    });
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
              text: "Inscription en 5 minutes seulement"
            },
            {
              icon: <FaHandshake className="text-3xl text-blue-600 mb-4" />,
              title: "Communauté bienveillante",
              text: "Rejoignez notre réseau d'experts"
            },
            {
              icon: <FaChalkboardTeacher className="text-3xl text-blue-600 mb-4" />,
              title: "Flexibilité totale",
              text: "Contribuez selon vos disponibilités"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              {item.icon}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>

        {/* CTA Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Commencez dès maintenant</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Domaine d'expertise *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
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
              
              {formData.subject === 'Autre' && (
                <div className="mt-4">
                  <label htmlFor="customSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    Veuillez préciser votre matière *
                  </label>
                  <input
                    id="customSubject"
                    name="customSubject"
                    type="text"
                    value={formData.customSubject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required={formData.subject === 'Autre'}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                Votre motivation *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows="4"
                value={formData.motivation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Envoyer ma candidature
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DevenirContributeur;