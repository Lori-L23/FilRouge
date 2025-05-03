import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Api from "../Services/Api";
import lori from "../assets/lori.jpg";

import {
  ChartBarIcon,
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CogIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  NoSymbolIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    users_count: 0,
    eleves_count: 0,
    repetiteurs_count: 0,
    reservations_count: 0,
    completed_sessions: 0,
    revenue: 0,
    pending_reservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(7);
  const [totalReservations, setTotalReservations] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, currentPage]);

  useEffect(() => {
    console.log("[DEBUG] Current user:", user);
    console.log("[DEBUG] Current stats:", stats);
    console.log("[DEBUG] Current reservations:", reservations);
  }, [user, stats, reservations]);

  const fetchDashboardData = async () => {
    console.log("[DEBUG] Starting data fetch...");
    setLoading(true);
    setReservationsLoading(true);
    setApiError(null);
    setNetworkError(false);
    setAuthError(false);

    try {
      // Vérification basique côté client
      if (!user || user.role !== "admin") {
        setAuthError(true);
        return;
      }

      const token = localStorage.getItem("auth_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: dateRange[0],
          end_date: dateRange[1],
          page: currentPage,
          per_page: reservationsPerPage
        },
      };

      console.log("[DEBUG] Sending requests...");
      const [statsRes, reservationsRes] = await Promise.all([
        Api.get("/api/admin/stats", config).catch((err) => {
          console.error("[DEBUG] Stats error:", err.response);
          throw err;
        }),
        Api.get("/api/reservations/latest", config).catch((err) => {
          console.error("[DEBUG] Reservations error:", err.response);
          throw err;
        }),
      ]);

      console.log("[DEBUG] API responses:", {
        stats: statsRes.data,
        reservations: reservationsRes.data,
      });

      // Handle both direct data and data wrapped in 'data' property
      setStats(statsRes.data.data || statsRes.data);
      setReservations(reservationsRes.data.data || reservationsRes.data.reservations);
      setTotalReservations(reservationsRes.data.total || reservationsRes.data.data?.length || 0);
    } catch (error) {
      console.error("[DEBUG] Full error:", error);

      if (error.message === "Network Error") {
        setNetworkError(true);
      } else if (error.response?.status === 403) {
        setApiError("Permission denied: Admin access required");
      } else if (error.response?.status === 401) {
        logout();
        alert("Session expired. Please login again.");
      } else {
        setApiError(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
      setReservationsLoading(false);
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(totalReservations / reservationsPerPage);

  const menuItems = [
    { key: "1", icon: <ChartBarIcon className="h-5 w-5" />, label: "Tableau de bord", path: "/DashboardAdmin" },
    { key: "2", icon: <UsersIcon className="h-5 w-5" />, label: "Utilisateurs", path: "/admin/utilisateurs" },
    { key: "3", icon: <UserGroupIcon className="h-5 w-5" />, label: "Répétiteurs", path: "/admin/repetiteurs" },
    { key: "4", icon: <AcademicCapIcon className="h-5 w-5" />, label: "Élèves", path: "/admin/eleves" },
    { key: "5", icon: <BookOpenIcon className="h-5 w-5" />, label: "Cours", path: "/admin/cours" },
    { key: "6", icon: <CurrencyDollarIcon className="h-5 w-5" />, label: "Paiements", path: "/admin/paiements" },
    { key: "7", icon: <CalendarIcon className="h-5 w-5" />, label: "Réservations", path: "/admin/reservations" },
    { key: "8", icon: <CogIcon className="h-5 w-5" />, label: "Paramètres", path: "/admin/parametres" },
  ];
  

  const statusBadge = (status) => {
    const statusClasses = {
      en_attente: "bg-orange-100 text-orange-800",
      acceptee: "bg-green-100 text-green-800",
      refusee: "bg-red-100 text-red-800",
      annulee: "bg-gray-100 text-gray-800",
    };

    const statusIcons = {
      en_attente: <ClockIcon className="h-4 w-4 mr-1" />,
      acceptee: <CheckCircleIcon className="h-4 w-4 mr-1" />,
      refusee: <XCircleIcon className="h-4 w-4 mr-1" />,
      annulee: <NoSymbolIcon className="h-4 w-4 mr-1" />,
    };

    const statusText = {
      en_attente: "En attente",
      acceptee: "Acceptée",
      refusee: "Refusée",
      annulee: "Annulée",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusIcons[status]}
        {statusText[status] || status}
      </span>
    );
  };

  const handleDateChange = (e, index) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = e.target.value;
    setDateRange(newDateRange);
    setCurrentPage(1); // Reset to first page when date range changes
  };

  const getSafe = (fn, defaultValue = "N/A") => {
    try {
      return fn();
    } catch (e) {
      return defaultValue;
    }
  };

  if (authError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
          <h3 className="mb-4 text-xl font-medium text-gray-900">
            Accès refusé
          </h3>
          <p className="mb-4 text-gray-500">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
          <Link
            to="/"
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`md:flex flex-col w-64 bg-blue-700 border-r border-gray-200 ${
          sidebarOpen ? "flex" : "hidden"
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
                className="flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="md:hidden text-shadow-gray-600 hover:text-gray-600"
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
              <h1 className="text-lg font-semibold text-gray-600">
                Tableau de Bord
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/reservations"
                className="relative p-1 text-gray-400 hover:text-gray-500"
              >
                <CalendarIcon className="h-6 w-6" />
                {stats.pending_reservations > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {stats.pending_reservations}
                  </span>
                )}
              </Link>
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
            {/* Header with date picker */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">
                Aperçu Général
              </h2>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleDateChange(e, 0)}
                  value={dateRange[0] || ""}
                />
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleDateChange(e, 1)}
                  value={dateRange[1] || ""}
                />
              </div>
            </div>

            {/* Stats cards */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow-sm h-32 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Users */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Utilisateurs totaux
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.users_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Students */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-50 text-green-600">
                        <AcademicCapIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Élèves
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.eleves_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Teachers */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                        <UsersIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Répétiteurs
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.repetiteurs_count}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reservations */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Réservations
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.reservations_count}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Completed sessions */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-teal-50 text-teal-600">
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Sessions terminées
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.completed_sessions}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pending reservations */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-50 text-red-600">
                        <ClockIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Réservations en attente
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.pending_reservations}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                        <CurrencyDollarIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">
                          Revenus (FCFA)
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {new Intl.NumberFormat("fr-FR").format(stats.revenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Latest reservations */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Dernières Réservations
                </h3>
                <Link
                  to="/admin/reservations"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Voir tout
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Élève
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Répétiteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservationsLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : reservations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          Aucune réservation trouvée
                        </td>
                      </tr>
                    ) : (
                      reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reservation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={lori}
                                  alt="Élève"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getSafe(
                                    () =>
                                      reservation.eleve?.user?.prenom +
                                      " " +
                                      reservation.eleve?.user?.nom,
                                    "Élève inconnu"
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {getSafe(
                                    () => reservation.eleve?.niveau_scolaire,
                                    "Niveau inconnu"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={lori}
                                  alt="Répétiteur"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getSafe(
                                    () =>
                                      reservation.repetiteur?.user?.prenom +
                                      " " +
                                      reservation.repetiteur?.user?.nom,
                                    "Répétiteur inconnu"
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {getSafe(
                                    () =>
                                      reservation.repetiteur?.statut_verif ===
                                      "verifie"
                                        ? "Vérifié"
                                        : "Non vérifié",
                                    "Statut inconnu"
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              reservation.date_reservation
                            ).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {statusBadge(reservation.statut)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/admin/reservations/${reservation.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!reservationsLoading && reservations.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(currentPage - 1) * reservationsPerPage + 1}</span> à{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * reservationsPerPage, totalReservations)}
                        </span>{" "}
                        sur <span className="font-medium">{totalReservations}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Précédent</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
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
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Suivant</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;