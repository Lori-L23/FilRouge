import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import lori from "../assets/lori.jpg";
import {
  AcademicCapIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
  BookOpenIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Eleves = () => {
  const { user } = useAuth();
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [elevesPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      key: "1",
      icon: <ChartBarIcon className="h-5 w-5" />,
      label: "Tableau de bord",
      path: "/DashboardAdmin",
    },
    {
      key: "2",
      icon: <UsersIcon className="h-5 w-5" />,
      label: "Utilisateurs",
      path: "/admin/utilisateurs",
    },
    {
      key: "3",
      icon: <UserGroupIcon className="h-5 w-5" />,
      label: "Répétiteurs",
      path: "/admin/repetiteurs",
    },
    {
      key: "4",
      icon: <AcademicCapIcon className="h-5 w-5" />,
      label: "Élèves",
      path: "/admin/eleves",
    },
    {
      key: "5",
      icon: <BookOpenIcon className="h-5 w-5" />,
      label: "Cours",
      path: "/admin/cours",
    },
    {
      key: "6",
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      label: "Paiements",
      path: "/admin/paiements",
    },
    {
      key: "7",
      icon: <CalendarIcon className="h-5 w-5" />,
      label: "Réservations",
      path: "/admin/reservations",
    },
    {
      key: "8",
      icon: <CogIcon className="h-5 w-5" />,
      label: "Paramètres",
      path: "/admin/parametres",
    },
  ];

  useEffect(() => {
    fetchEleves();
  }, []);

  const fetchEleves = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await Api.get("/api/data/eleves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEleves(response.data.data || response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des élèves:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEleves = eleves.filter((eleve) => {
    const matchesSearch = 
      eleve.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNiveau = !niveauFilter || 
      eleve.niveau_scolaire?.toLowerCase().includes(niveauFilter.toLowerCase());
    
    return matchesSearch && matchesNiveau;
  });

  // Pagination
  const indexOfLastEleve = currentPage * elevesPerPage;
  const indexOfFirstEleve = indexOfLastEleve - elevesPerPage;
  const currentEleves = filteredEleves.slice(indexOfFirstEleve, indexOfLastEleve);
  const totalPages = Math.ceil(filteredEleves.length / elevesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getNiveauBadge = (niveau) => {
    const niveaux = {
      primaire: "bg-blue-100 text-blue-800",
      college: "bg-green-100 text-green-800",
      lycee: "bg-purple-100 text-purple-800",
      universite: "bg-orange-100 text-orange-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${niveaux[niveau] || "bg-gray-100 text-gray-800"}`}>
        {niveau}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed md:static md:flex flex-col w-64 bg-blue-700 border-r border-gray-200 h-full z-40 ${sidebarOpen ? "flex" : "hidden"
          }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-xl font-semibold text-white">InnovaLearn</span>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-4">
            <img
              className="w-10 h-10 rounded-full"
              src={user?.photo || lori}
              alt="Profile"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs font-medium text-white">Administrateur</p>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-1 ml-4">
              <h1 className="text-lg font-semibold text-gray-900">
                Gestion des Élèves
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.photo || lori}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Élèves</h2>
                <p className="text-gray-600 mt-1">
                  Total: {eleves.length} élèves
                </p>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nom, prénom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau scolaire</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    value={niveauFilter}
                    onChange={(e) => setNiveauFilter(e.target.value)}
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="6eme">6ème</option>
                    <option value="5eme">5ème</option>
                    <option value="4eme">4ème</option>
                    <option value="3eme">3ème</option>
                    <option value="2nde">2nde</option>
                    <option value="1ere">1ère</option>
                    <option value="Tle">Terminale</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setNiveauFilter("");
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>

            {/* Tableau des élèves */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau scolaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEleves.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Aucun élève trouvé
                        </td>
                      </tr>
                    ) : (
                      currentEleves.map((eleve) => (
                        <tr key={eleve.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {eleve.user?.prenom} {eleve.user?.nom}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {eleve.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getNiveauBadge(eleve.niveau_scolaire)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {eleve.user?.telephone || "Non renseigné"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(eleve.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredEleves.length > elevesPerPage && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{indexOfFirstEleve + 1}</span> à{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastEleve, filteredEleves.length)}
                        </span>{" "}
                        sur <span className="font-medium">{filteredEleves.length}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <ChevronRightIcon className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}

              {filteredEleves.length === 0 && (
                <div className="text-center py-8">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun élève</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Aucun élève ne correspond à vos critères de recherche.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Eleves;