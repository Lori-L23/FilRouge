// import React, { useState, useEffect } from 'react';
// import { FaSearch, FaStar, FaChalkboardTeacher, FaClock, FaUserGraduate, FaBook, FaSpinner } from 'react-icons/fa';

// // Simulate API calls
// const fakeApi = {
//   fetchCourses: () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
//         const defaultCourses = [
//           {
//             id: 1,
//             title: 'Mathématiques Terminale',
//             category: 'Scientifique',
//             level: 'Avancé',
//             description: 'Maîtrisez les concepts clés avec nos professeurs expérimentés.',
//             duration: '20h',
//             students: '1250',
//             rating: 4.9,
//             price: '25€/h',
//             image: '/images/maths.jpg',
//             tutorId: 't1',
//             featured: true
//           },
//           // ... autres cours par défaut
//         ];
//         resolve(savedCourses.length ? savedCourses : defaultCourses);
//       }, 800);
//     });
//   },
//   fetchTutors: () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const savedTutors = JSON.parse(localStorage.getItem('tutors') || '[]');
//         const defaultTutors = [
//           {
//             id: 't1',
//             name: 'Prof. Dupont',
//             specialty: 'Mathématiques',
//             experience: '10 ans',
//             bio: 'Enseignant certifié avec grande expérience en prépa scientifique'
//           },
//           // ... autres tuteurs par défaut
//         ];
//         resolve(savedTutors.length ? savedTutors : defaultTutors);
//       }, 800);
//     });
//   }
// };

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [tutors, setTutors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('Tous');
//   const [sortBy, setSortBy] = useState('popularite');

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const [coursesData, tutorsData] = await Promise.all([
//           fakeApi.fetchCourses(),
//           fakeApi.fetchTutors()
//         ]);
        
//         setCourses(coursesData);
//         setTutors(tutorsData);
//       } catch (error) {
//         console.error("Erreur de chargement", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();

//     // Simuler un abonnement aux nouvelles inscriptions
//     const handleStorageChange = () => {
//       const newCourses = JSON.parse(localStorage.getItem('courses') || [];
//       const newTutors = JSON.parse(localStorage.getItem('tutors') || [];
//       if (newCourses.length !== courses.length || newTutors.length !== tutors.length) {
//         loadData();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // Fonction pour ajouter un nouveau cours (simulé)
//   const addNewCourse = (newCourse) => {
//     const updatedCourses = [...courses, newCourse];
//     setCourses(updatedCourses);
//     localStorage.setItem('courses', JSON.stringify(updatedCourses));
//     window.dispatchEvent(new Event('storage'));
//   };

//   // Filtrer et trier les cours
//   const filteredCourses = courses
//     .filter(course => 
//       (selectedCategory === 'Tous' || course.category === selectedCategory) &&
//       (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.description.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === 'popularite') return b.students - a.students;
//       if (sortBy === 'nouveaute') return b.id - a.id;
//       if (sortBy === 'prix-croissant') return parseFloat(a.price) - parseFloat(b.price);
//       if (sortBy === 'prix-decroissant') return parseFloat(b.price) - parseFloat(a.price);
//       return 0;
//     });

//   // Obtenir les infos du tuteur
//   const getTutorInfo = (tutorId) => {
//     return tutors.find(tutor => tutor.id === tutorId) || {};
//   };

//   // Catégories dynamiques
//   const categories = [
//     { id: 1, name: 'Tous', count: courses.length },
//     { id: 2, name: 'Scientifique', count: courses.filter(c => c.category === 'Scientifique').length },
//     // ... autres catégories
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <FaSpinner className="animate-spin text-4xl text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ... (même structure que précédemment mais avec les données dynamiques) ... */}
      
//       {/* Exemple de carte de cours modifiée pour inclure les infos du tuteur */}
//       {filteredCourses.map(course => {
//         const tutor = getTutorInfo(course.tutorId);
//         return (
//           <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//             <div className="h-48 overflow-hidden">
//               <img 
//                 src={course.image} 
//                 alt={course.title} 
//                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//               />
//             </div>
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-2">
//                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                   {course.category}
//                 </span>
//                 <span className="flex items-center text-yellow-500">
//                   <FaStar className="mr-1" />
//                   <span className="text-gray-800 font-medium">{course.rating}</span>
//                 </span>
//               </div>
              
//               <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              
//               {/* Info du tuteur */}
//               {tutor && (
//                 <div className="flex items-center mb-3">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
//                     <FaChalkboardTeacher className="text-gray-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">{tutor.name}</p>
//                     <p className="text-xs text-gray-500">{tutor.experience} d'expérience</p>
//                   </div>
//                 </div>
//               )}
              
//               <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-bold text-blue-600">{course.price}</span>
//                 <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
//                   Voir détails
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
      
//       {/* ... reste du code ... */}
//     </div>
//   );
// };

// export default CoursesPage;


import React from 'react';
import { FaSearch, FaStar, FaChalkboardTeacher, FaClock, FaUserGraduate, FaBook } from 'react-icons/fa';
import photo1 from '../assets/ang.jpg'
import photo2 from '../assets/maths.jpg'
import photo3 from '../assets/photo3.jpg'
import photo4 from '../assets/philo.jpg'
import photo5 from '../assets/svt.jpg'
import photo6 from '../assets/hist.jpg'

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
    <>
    
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Nos Cours de Soutien</h1>
          <p className="text-xl mb-8 max-w-xl mx-auto ">
            Trouvez le professeur idéal pour progresser dans toutes les matières
          </p>
          
          <div className="max-w-2xl mx-50 relative">
            <input
              type="text"
              placeholder="Rechercher un cours, une matière, un niveau..."
              className="w-full p-4 pl-12 border-0 rounded-full bg-white shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-800"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 " />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Course */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cours à la une</h2>
          {courses.filter(c => c.featured).map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 h-40 md:h-auto">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-110 object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 justify-around flex flex-col ">
                  <div className="flex items-center mb-8 ">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-2">
                      {course.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  
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
                      <span className="text-gray-800 font-medium">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <button className="bg-[#7ED321] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                      S'inscrire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Catégories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`px-4 py-2 rounded-full border flex items-center ${category.id === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'}`}
              >
                {category.name}
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* All Courses */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tous nos cours</h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Trier par :</span>
              <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Plus populaires</option>
                <option>Nouveautés</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full object-cover h-90  hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-gray-800 font-medium">{course.rating}</span>
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">{course.price}</span>
                    <button className="text-blue-600 hover:text-[#7ED321] font-medium flex items-center">
                      Voir détails
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white text-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous souhaitez enseigner ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et partagez vos connaissances avec des milliers d'élèves motivés
          </p>
          <button className="bg-[#7ED321] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Devenir professeur
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cours;