import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaUserTie,
  FaLightbulb,
  FaHandsHelping,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import found1 from "../assets/found1.jpg";
import devops from "../assets/devops.jpg";
import sophie from "../assets/sophie.jpg";
import back from "../assets/back.jpg";

const TeamPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Alex Dupont",
      role: "Fondateur & Lead Dev",
      bio: "Expert en React avec 10 ans d'expérience dans le développement front-end.",
      Image: found1,
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
    {
      id: 2,
      name: "Sophie Martin",
      role: "Designer UX/UI",
      bio: "Spécialiste de l'expérience utilisateur avec une passion pour les interfaces intuitives.",
      Image: sophie,
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
    {
      id: 3,
      name: "Thomas Leroy",
      role: "Développeur Fullstack",
      bio: "Polyvalent avec une expertise en Node.js et architectures microservices.",
      Image: devops,
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#",
      },
    },
  ];

  const stats = [
    {
      value: "5+",
      label: "Années d'expérience",
      icon: <FaUserTie className="text-2xl" />,
    },
    {
      value: "200+",
      label: "Projets réalisés",
      icon: <FaLightbulb className="text-2xl" />,
    },
    {
      value: "98%",
      label: "Satisfaction clients",
      icon: <FaHandsHelping className="text-2xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative py-20 px-4 text-center text-white">
        {/* Image de fond avec opacité réduite */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${back})`,
            opacity: 0.7, // Ajustez cette valeur entre 0.1 et 0.5 selon vos besoins
          }}
        ></div>

        {/* Overlay sombre pour améliorer le contraste */}
        <div className="absolute inset-0 bg-black opacity-20 z-10"></div>

        {/* Contenu */}
        <div className="relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-16">
            Rencontrez notre équipe
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Découvrez les passionnés qui travaillent chaque jour pour créer les
            meilleures solutions pour vous
          </p>
          <button
            onClick={() => navigate("/devenir-contributeur")}
            className="mt-8 bg-white text-[#7ED321] hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Rejoindre notre équipe
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-[#7ED321] mb-4 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          Notre équipe de passionnés
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Chaque membre apporte son expertise unique pour créer une expérience
          exceptionnelle
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-53 bg-gray-200 flex items-center justify-center">
                <img
                  src={member.Image}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-[#7ED321] mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                <div className="flex space-x-4">
                  <a
                    href={member.social.linkedin}
                    className="text-gray-500 hover:text-[#0077B5]"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a
                    href={member.social.github}
                    className="text-gray-500 hover:text-black"
                  >
                    <FaGithub className="text-xl" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-gray-500 hover:text-[#1DA1F2]"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Nous sommes toujours à la recherche de talents passionnés pour
            renforcer notre équipe
          </p>
          <button
            onClick={() => navigate("/devenir-contributeur")}
            className="bg-[#7ED321] hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Postuler maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
