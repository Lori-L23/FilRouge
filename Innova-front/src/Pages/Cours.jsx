import React from 'react';
import { FaSearch, FaStar, FaChalkboardTeacher, FaClock, FaUserGraduate, FaChevronRight } from 'react-icons/fa';
import photo1 from '../assets/ang.jpg';
import photo2 from '../assets/maths.jpg';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/philo.jpg';
import photo5 from '../assets/svt.jpg';
import photo6 from '../assets/hist.jpg';

const Cours = () => {
  // Données des cours
  const courses = [
    {
      id: 1,
      title: 'Mathématiques Terminale',
      category: 'Scientifique',
      level: 'Avancé',
      description: 'Maîtrisez les concepts clés des mathématiques de terminale avec nos professeurs expérimentés.',
      duration: '20h',
      students: '1250',
      rating: 4.9,
      price: '25€/h',
      image: photo2,
      
    },
    {
      id: 2,
      title: 'Anglais B2-C1',
      category: 'Langues',
      level: 'Intermédiaire',
      description: 'Améliorez votre fluidité et préparez-vous aux certifications internationales.',
      duration: '30h',
      students: '980',
      rating: 4.8,
      price: '20€/h',
      image: photo1
    },
    {
      id: 3,
      title: 'Physique-Chimie Première',
      category: 'Scientifique',
      level: 'Intermédiaire',
      description: 'Approfondissez votre compréhension des phénomènes physiques et chimiques.',
      duration: '25h',
      students: '750',
      rating: 4.7,
      price: '22€/h',
      image: photo3
    },
    {
      id: 4,
      title: 'Philosophie Terminale',
      category: 'Littéraire',
      level: 'Tous niveaux',
      description: 'Découvrez les grands penseurs et préparez votre bac philo avec succès.',
      duration: '15h',
      students: '620',
      rating: 4.6,
      price: '18€/h',
      image: photo4
    },
    {
      id: 5,
      title: 'Histoire-Géographie',
      category: 'Humanités',
      level: 'Tous niveaux',
      description: 'Parcourez les grands événements historiques et les enjeux géopolitiques actuels.',
      duration: '18h',
      students: '540',
      rating: 4.5,
      price: '16€/h',
      image: photo6
    },
    {
      id: 6,
      title: 'SVT Terminale',
      category: 'Scientifique',
      level: 'Avancé',
      description: 'Approfondissez vos connaissances en biologie et géologie pour le bac.',
      duration: '22h',
      students: '680',
      rating: 4.7,
      price: '21€/h',
      image: photo5,
      featured: true
    }
  ];

  // Catégories de cours
  const categories = [
    { id: 1, name: 'Tous', count: courses.length },
    { id: 2, name: 'Scientifique', count: courses.filter(c => c.category === 'Scientifique').length },
    { id: 3, name: 'Langues', count: courses.filter(c => c.category === 'Langues').length },
    { id: 4, name: 'Littéraire', count: courses.filter(c => c.category === 'Littéraire').length },
    { id: 5, name: 'Humanités', count: courses.filter(c => c.category === 'Humanités').length }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Nos Cours de Soutien
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Trouvez le professeur idéal pour progresser dans toutes les matières
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un cours, une matière, un niveau..."
                className="w-full py-3 pl-12 pr-4 rounded-full bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-400"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
          Cours à la une
        </h2>
        
        {courses.filter(c => c.featured).map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-64 md:h-auto">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-90 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-blue-500" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUserGraduate className="mr-2 text-blue-500" />
                    <span>{course.students} élèves</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="text-gray-800 font-medium">
                      {course.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    {course.price}
                  </span>
                  <button className="w-full sm:w-auto bg-[#7ED321] hover:bg-[#6BBE1F] text-white font-medium py-2 px-6 rounded-lg transition-colors">
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Course Categories */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Catégories
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full border flex items-center transition-colors ${
                  category.id === 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                }`}
              >
                {category.name}
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Courses */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tous nos cours
          </h2>
          <div className="flex items-center w-full md:w-auto">
            <label htmlFor="sort" className="mr-2 text-gray-600 whitespace-nowrap">
              Trier par :
            </label>
            <select
              id="sort"
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
            >
              <option>Plus populaires</option>
              <option>Nouveautés</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-90 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="text-gray-800 font-medium">
                      {course.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-blue-600">
                    {course.price}
                  </span>
                  <button className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center">
                    Voir détails
                    <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="bg-white text-blue-600 font-medium py-3 px-8 border border-blue-600 rounded-lg hover:bg-[#7ED321] hover:text-white hover:border-[#7ED321] transition-colors">
            Voir plus de cours
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Vous souhaitez enseigner ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et partagez vos connaissances avec des milliers d'élèves motivés
          </p>
          <button className="bg-[#7ED321] hover:bg-[#6BBE1F] text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Devenir professeur
          </button>
        </div>
      </section>
    </div>
  );
};

export default Cours;