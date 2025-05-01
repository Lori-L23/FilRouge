import React, { useState } from "react";
import { Link } from "react-router-dom";
import Article1 from '../assets/article.avif';
import Article3 from '../assets/art.avif'
import Article2 from '../assets/photo15.jpg';
import Article4 from '../assets/art2.avif';
import Article5 from '../assets/act3.jpg';

const articles = [
  {
    id: 1,
    titre: "L'impact du digital sur l'éducation au Cameroun",
    extrait: "La digitalisation transforme l'accès au savoir avec de nouvelles méthodes d'apprentissage...",
    date: "20 Avril 2025",
    auteur: "Marie T.",
    image: Article1
  },
  {
    id: 2,
    titre: "Trouver un bon répétiteur : nos conseils",
    extrait: "Entre qualification, pédagogie et proximité, découvrez nos astuces pour bien choisir un répétiteur...",
    date: "15 Avril 2025",
    auteur: "Jean B.",
    image: Article3
  },
  {
    id: 3,
    titre: "Les matières les plus demandées en 2025",
    extrait: "Mathématiques, Anglais, Informatique... quelles matières cartonnent chez les élèves ?...",
    date: "10 Avril 2025",
    auteur: "Sandra K.",
    image: Article2
  },
  {
    id: 4,
    titre: "Comment motiver son enfant à apprendre ?",
    extrait: "La motivation scolaire est un défi pour les parents. Voici quelques astuces pratiques...",
    date: "5 Avril 2025",
    auteur: "Lucie N.",
    image: Article4 
  },
  {
    id: 5,
    titre: "Les outils numériques préférés des répétiteurs",
    extrait: "Zoom, Google Classroom, WhatsApp... découvrez les outils plébiscités pour le suivi pédagogique...",
    date: "1er Avril 2025",
    auteur: "Pascal E.",
    image:Article5
  },
];

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-blue-700 text-center mt-20">Nos Articles de Blog</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentArticles.map(article => (
          <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={article.image} alt={article.titre} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{article.titre}</h2>
              <p className="text-gray-600 text-sm mb-2">{article.date} • {article.auteur}</p>
              <p className="text-gray-700 mb-4">{article.extrait}</p>
              <Link
                to={`/blog/${article.id}`}
                className="inline-block bg-[#7ED321] text-white px-4 py-2 rounded hover:bg-[#6BBE1F] transition"
              >
                Lire l'article →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => changePage(i + 1)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === i + 1
                ? "bg-[#7ED321] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
