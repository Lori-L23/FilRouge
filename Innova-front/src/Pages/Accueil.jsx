import React, { useState} from "react";
import {
  FaSearch,
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import photo1 from "../assets/photo1.jpg";
import photo2 from "../assets/photo14.jpg";
import photo3 from "../assets/photo15.jpg";
import photo4 from "../assets/photo2.jpg";
import SubjectScroller from "../components/SubjectScroller";
import car1 from "../assets/car1.png";
import car2 from "../assets/car2.png";
import car3 from "../assets/car3.png";
import carr1 from "../assets/carr1.png";
import carr2 from "../assets/carr2.png";
import carr3 from "../assets/carr3.png";
import { Link, Links } from "react-router-dom";

const Accueil = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données des cours populaires
  const popularCourses = [
    {
      id: 1,
      title: "Mathématiques Terminale",
      tutor: "Prof. Dupont",
      rating: 4.9,
      image: photo1,
      description:
        "  Découvrez les mathématiques à travers des cours  adaptés. ",
    },
    {
      id: 2,
      title: "Physique-Chimie 1ère",
      tutor: "Dr. Martin",
      rating: 4.2,
      image: photo3,
      description:
        "   Explorez les bases de la physique avec des cours clairs et interactifs. ",
    },

    {
      id: 3,
      title: "Anglais A1-B2",
      tutor: "Mr. Smith",
      rating: 4.5,
      image: photo2,
      description:
        "Améliorez votre anglais avec des cours pratiques qui renforcent votre vocabulaire.",
    },
    {
      id: 4,
      title: "Philosophie Terminale",
      tutor: "Mme. Rousseau",
      rating: 4.3,
      image: photo4,
      description:
        "Plongez dans l exploration des grandes questions de l existence.",
    },
  ];

  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: "Vincent",
      subject: "Maths",
      quote:
        "Les cours de maths m'ont aidé à comprendre des concepts difficiles comme l'algèbre et la géométrie. Mes résultats se sont améliorés et je me sens plus à l'aise avec la matière.",
      stats: "Plus 500+ d'élèves ont déjà atteint leur objectif",
      image: car1,
      presentation: carr1,
    },
    {
      id: 2,
      name: "Sophie",
      subject: "Physique",
      quote:
        "Grâce à mon répétiteur, j'ai pu combler mes lacunes en physique et obtenir mon bac avec mention. La patience et les explications claires ont fait toute la différence.",
      stats: "50 000 nouveaux élèves chaque mois",
      image: car2,
      presentation: carr2,
    },
    {
      id: 3,
      name: "Thomas",
      subject: "Anglais",
      quote:
        "De niveau intermédiaire, je peux maintenant tenir des conversations fluides en anglais. Les cours personnalisés ont boosté ma confiance et mes compétences linguistiques.",
      stats: "95% de satisfaction",
      image: car3,
      presentation: carr3,
    },
  ];
  return (
    <div className="font-sans ">
      
      {/* Section Hero avec Swiper */}
      <section className="relative bg-gray-50">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full"
        >
          <SwiperSlide>
            <div
              className="h-96 flex items-center justify-center text-white relative"
              // style={{
              //   backgroundImage: "url('https://source.unsplash.com/random/1600x900/?education')",
              //   backgroundSize: "cover",
              //   backgroundPosition: "center",
              // }}
            >
              <div className="absolute inset-0 bg-indigo-600 bg-opacity-40"></div>
              <div className="text-center px-4 relative z-10">
                <h1 className="text-4xl font-bold mb-4">
                  Trouvez le professeur parfait
                </h1>
                <p className="text-xl mb-8">
                  Pour progresser dans toutes les matières
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="h-96 flex items-center justify-center text-white relative"
              // style={{
              //   backgroundImage: "url('https://source.unsplash.com/random/1600x900/?tutoring')",
              //   backgroundSize: "cover",
              //   backgroundPosition: "center",
              // }}
            >
              <div className="absolute inset-0 bg-indigo-600 bg-opacity-40"></div>
              <div className="text-center px-4 relative z-10">
                <h1 className="text-4xl font-bold mb-4">Devenez répétiteur</h1>
                <p className="text-xl mb-8">
                  Partagez vos connaissances et gagnez de l'argent
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Barre de recherche superposée */}
        <div className="container mx-auto px-1 transform -translate-y-1/2 relative z-20">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Rechercher une matière, un niveau, un professeur..."
                  className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors">
                Trouver un professeur
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Composant de défilement des matières */}
      <div className="bg-gray-50">
        <SubjectScroller />
      </div>

      {/* Section Cours populaires */}
      <section className="container mx-auto px-4 w-screen py-16 mt-12 bg-white ">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0E77F3] mb-4">
            COURS POPULAIRES
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les matières où nos élèves progressent le plus rapidement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-bl-4xl shadow-md  overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">Avec {course.tutor}</p>
                <p className="text-gray-600 mb-4"> {course.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="text-gray-800 font-medium">
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link  to="/cours" className="bg-[#7ED321] text-white font-medium py-3 px-8 border border-[#7ED321] rounded-lg hover:bg-white  hover:text-[#7ED321] transition-colors">
            Voir tous les cours
          </Link>
        </div>
      </section>

      {/* Section Avis et témoignages avec Swiper */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">
              Ces élèves ont commencé comme vous
            </h2>
            <p className="text-xl text-white ">{testimonials[0].stats}</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <Swiper
              modules={[Autoplay, Navigation]}
              autoplay={{ delay: 8000, disableOnInteraction: false }}
              navigation={{
                nextEl: ".testimonial-next",
                prevEl: ".testimonial-prev",
              }}
              loop={true}
              spaceBetween={30}
              breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 1.2, centeredSlides: true },
              }}
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
                    <div className="flex flex-col md:flex-row">
                      {/* Colonne de gauche - Photo et info élève */}
                      <div className="md:w-2/5 p-8 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            Apprend les {testimonial.subject}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < Math.floor(testimonial.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              } mx-1`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Colonne de droite - Témoignage et image */}
                      <div className="md:w-3/5 bg-white p-8 flex flex-col">
                        <div className="mb-6">
                          <FaQuoteLeft className="text-gray-300 text-3xl mb-4" />
                          <p className="text-gray-700 text-lg italic">
                            "{testimonial.quote}"
                          </p>
                        </div>

                        <div className="mt-auto h-48 rounded-lg overflow-hidden">
                          <img
                            src={testimonial.presentation}
                            alt="Présentation cours"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Boutons de navigation */}
            <button className="testimonial-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors">
              <FaChevronLeft className="text-gray-700 text-xl" />
            </button>
            <button className="testimonial-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors">
              <FaChevronRight className="text-gray-700 text-xl" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-black">
            Rejoignez des milliers d'élèves et de professeurs qui apprennent et
            enseignent différemment
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-white">
          <Link to='/trouverprofesseur'>
            <button className="bg-[#7ED321] text-white  border-2  font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-[#7ED321] transition-colors">
              Trouver un professeur
            </button>
          </Link>
            <Link to='/devenirprofesseur'>
            <button className="bg-white border-2  text-[#7ED321] hover:border-[#7ED321]  font-medium py-3 px-8 rounded-lg hover:bg-[#7ED321] hover:text-white transition-colors">
              Devenir répétiteur
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
