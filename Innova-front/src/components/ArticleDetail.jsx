import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Article1 from '../assets/article.avif';
import Article3 from '../assets/art.avif'
import Article2 from '../assets/photo15.jpg';
import Article4 from '../assets/art2.avif';
import Article5 from '../assets/act3.jpg';

const articles = [
  {
    id: 1,
    titre: "L'impact du digital sur l'éducation au Cameroun",
    contenu: `La digitalisation transforme l'accès au savoir avec de nouvelles méthodes d'apprentissage.
    Elle permet aux élèves, même dans des zones reculées, d’accéder à des ressources éducatives.
    
    Grâce aux répétiteurs en ligne et aux plateformes de tutorat, l'apprentissage devient plus personnalisé.`,
    date: "20 Avril 2025",
    auteur: "Marie T.",
    image: Article1
  },
  {
    id: 2,
    titre: "Trouver un bon répétiteur : nos conseils",
    contenu: `Entre qualification, pédagogie et proximité, découvrez nos astuces pour bien choisir un répétiteur.
    
    Il est essentiel de vérifier ses compétences, d’échanger avec lui, et d’évaluer la compatibilité avec l’élève.`,
    date: "15 Avril 2025",
    auteur: "Jean B.",
    image: Article3
  },
  {
    id: 3,
    titre: "Les matières les plus demandées en 2025",
    contenu: `Mathématiques, Anglais, Informatique... quelles matières cartonnent chez les élèves ?
    
    Le choix des matières dépend du niveau scolaire et des ambitions des apprenants.`,
    date: "10 Avril 2025",
    auteur: "Sandra K.",
    image: Article2
  },
];

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.id === parseInt(id));

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600">Article introuvable</h2>
        <button onClick={() => navigate("/blog")} className="mt-20 text-blue-500 hover:underline ">
          ← Retour au blog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-[#7ED321] mb-6 inline-block hover:underline mt-20"
      >
        ← Retour
      </button>

      <img src={article.image} alt={article.titre} className="w-full h-64 object-cover rounded-xl mb-6 shadow" />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.titre}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>{article.date}</span>
        <span className="mx-2">•</span>
        <span>Par {article.auteur}</span>
      </div>

      <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
        {article.contenu}
      </div>
    </div>
  );
};

export default ArticleDetail;
