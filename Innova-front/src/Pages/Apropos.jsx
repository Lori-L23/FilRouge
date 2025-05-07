import React from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa";
import teamImage from "../assets/Team.jpg"; // Remplacez par votre image d'équipe
import { Link, useNavigate } from "react-router-dom";

const Apropos = () => {

   const navigate = useNavigate();
  // Données des valeurs
  const values = [
    {
      icon: <FaGraduationCap className="text-3xl mb-4 text-blue-600" />,
      title: "Excellence académique",
      description:
        "Nous sélectionnons rigoureusement nos répétiteurs pour garantir un enseignement de qualité.",
    },
    {
      icon: <FaUsers className="text-3xl mb-4 text-blue-600" />,
      title: "Approche personnalisée",
      description:
        "Des solutions adaptées à chaque étudiant pour maximiser leur potentiel.",
    },
    {
      icon: <FaLightbulb className="text-3xl mb-4 text-blue-600" />,
      title: "Innovation pédagogique",
      description:
        "Méthodes modernes et outils interactifs pour un apprentissage efficace.",
    },
    {
      icon: <FaHandshake className="text-3xl mb-4 text-blue-600" />,
      title: "Engagement total",
      description: "Votre réussite est notre priorité absolue.",
    },
  ];

  // Statistiques
  const stats = [
    { value: "10000+", label: "Étudiants accompagnés" },
    { value: "95%", label: "Taux de satisfaction" },
    { value: "500+", label: "Répétiteurs qualifiés" },
    { value: "20+", label: "Matières couvertes" },
  ];

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32">
        <div className="container mx-auto px-4 text-center mt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Mission</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Connecter les étudiants avec des répétiteurs qualifiés pour
            améliorer leur apprentissage.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8"></div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src={teamImage}
                alt="Équipe InnovaLearn"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre histoire
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Notre histoire a commencé il y a quelques années, lorsqu'un
                groupe de passionnés d'éducation a remarqué une lacune dans
                l'offre de cours particuliers accessibles et de qualité.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Chez InnovaLearn, nous sommes guidés par des valeurs qui
                nourrissent notre mission et influencent chaque aspect de notre
                travail.
              </p>
              <Link
                to="/equipe"
                className="bg-[#7ED321] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Rencontrer notre équipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ce qui nous distingue et guide chacune de nos actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 justify-items-center">
                <p className="text-5xl font-bold mb-3">{stat.value}</p>
                <p className="text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'apprentissage et découvrez la
            différence InnovaLearn
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 text-white">
            <button
              onClick={() => navigate("/trouverprofesseur")}
              className="bg-[#7ED321] text-white border-2 font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-[#7ED321] transition-colors"
            >
              Trouver un professeur
            </button>
            <button
              onClick={() => navigate("/devenirprofesseur")}
              className="bg-white border-2 text-[#7ED321] hover:border-[#7ED321] font-medium py-3 px-8 rounded-lg hover:bg-[#7ED321] hover:text-white transition-colors"
            >
              Devenir répétiteur
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apropos;
