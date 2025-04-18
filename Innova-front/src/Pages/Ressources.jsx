
import React from 'react';
import { FaBookOpen, FaGraduationCap, FaVideo, FaFileAlt, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Ressources = () => {
  // Données des ressources
  const resourceCategories = [
    {
      title: "Guides Pédagogiques",
      icon: <FaBookOpen className="text-3xl text-blue-500" />,
      items: [
        {
          title: "Comment réussir en mathématiques",
          type: "PDF",
          link: "https://eduscol.education.fr/document/33172/download"
        },
        {
          title: "Méthodologie de travail efficace",
          type: "Article",
          link: "https://www.etudiant.gouv.fr/fr/fiches-pratiques/reussir-ses-etudes-superieures-1787"
        },
        {
          title: "Préparation aux examens",
          type: "Série vidéo",
          link: "https://www.lumni.fr/dossier/reviser-le-bac"
        }
      ]
    },
    {
      title: "Tutoriels Vidéo",
      icon: <FaVideo className="text-3xl text-indigo-500" />,
      items: [
        {
          title: "Les bases de la physique",
          type: "Playlist",
          link: "https://www.khanacademy.org/science/physics"
        },
        {
          title: "Maîtriser la dissertation",
          type: "Tutoriel",
          link: "https://www.youtube.com/watch?v=9LtG7gOzU8U"
        }
      ]
    },
    {
      title: "Outils Éducatifs",
      icon: <FaChalkboardTeacher className="text-3xl text-purple-500" />,
      items: [
        {
          title: "Générateur de fiches de révision",
          type: "Outil en ligne",
          link: "https://www.studysmarter.fr/creation-fiche-revision/"
        },
        {
          title: "Planificateur d'étude",
          type: "Template",
          link: "https://eduscol.education.fr/document/33173/download"
        }
      ]
    }
  ];

  const featuredResources = [
    {
      title: "Webinaire : Apprendre à apprendre",
      excerpt: "Découvrez les techniques des meilleurs étudiants",
      category: "Événement",
      date: "15 Nov. 2023",
      link: "https://eduscol.education.fr/document/33173/download"
    },
    {
      title: "Livre Blanc - L'éducation du futur",
      excerpt: "Notre vision pour 2030",
      category: "Publication",
      date: "1 Oct. 2023",
      link: "https://www.youtube.com/watch?v=9LtG7gOzU8U"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 ">
        <div className="container mx-auto px-4 text-center mt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Ressources Éducatives</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Tout le savoir dont vous avez besoin pour exceller dans votre parcours d'apprentissage
          </p>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Ressources Phares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featuredResources.map((resource, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                  {resource.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{resource.date}</span>
                  <Link 
                    to={resource.link} 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Voir la ressource <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resource Categories */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explorez par Catégorie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </div>
                
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link 
                        to={item.link} 
                        className="flex justify-between items-center py-2 hover:text-blue-600 transition-colors"
                      >
                        <span>{item.title}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={`/ressources/${category.title.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tout voir →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous avez une ressource à partager ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'éducateurs et contribuez à l'évolution des ressources pédagogiques
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/devenir-contributeur" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Devenir contributeur
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 font-medium py-3 px-8 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ressources;