import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import lori from "../assets/lori.jpg";
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UserGroupIcon,
  UsersIcon,
  UserGroupIcon as RepetiteurIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BookOpenIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Parametres = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Paramètres généraux
    siteName: "InnovaLearn",
    siteDescription: "Plateforme de cours particuliers",
    maintenanceMode: false,
    
    // Paramètres de notification
    emailNotifications: true,
    reservationAlerts: true,
    paymentAlerts: true,
    
    // Paramètres de sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Paramètres de paiement
    commissionRate: 15,
    minWithdrawal: 5000,
    
    // Paramètres utilisateurs
    userRegistration: true,
    emailVerification: true,
  });

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
      icon: <RepetiteurIcon className="h-5 w-5" />,
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

  const tabs = [
    { id: "general", name: "Général", icon: CogIcon },
    { id: "notifications", name: "Notifications", icon: BellIcon },
    { id: "security", name: "Sécurité", icon: ShieldCheckIcon },
    { id: "payments", name: "Paiements", icon: CreditCardIcon },
    { id: "users", name: "Utilisateurs", icon: UserGroupIcon },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // Implémentez la sauvegarde des paramètres
      console.log("Sauvegarde des paramètres:", settings);
      alert("Paramètres sauvegardés avec succès!");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde des paramètres");
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={settings.siteName}
              onChange={(e) => handleSettingChange("siteName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du site
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange("maintenanceMode", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Mode maintenance
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de notification</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Notifications par email
              </label>
              <p className="text-sm text-gray-500">
                Recevoir des notifications importantes par email
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Alertes de réservation
              </label>
              <p className="text-sm text-gray-500">
                Notifications pour les nouvelles réservations
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reservationAlerts}
              onChange={(e) => handleSettingChange("reservationAlerts", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Alertes de paiement
              </label>
              <p className="text-sm text-gray-500">
                Notifications pour les paiements reçus
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.paymentAlerts}
              onChange={(e) => handleSettingChange("paymentAlerts", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de sécurité</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Authentification à deux facteurs
              </label>
              <p className="text-sm text-gray-500">
                Renforcez la sécurité de votre compte
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai d'expiration de session (minutes)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de paiement</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux de commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={settings.commissionRate}
              onChange={(e) => handleSettingChange("commissionRate", parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retrait minimum (FCFA)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={settings.minWithdrawal}
              onChange={(e) => handleSettingChange("minWithdrawal", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres utilisateurs</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Inscription utilisateurs
              </label>
              <p className="text-sm text-gray-500">
                Autoriser les nouvelles inscriptions
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.userRegistration}
              onChange={(e) => handleSettingChange("userRegistration", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Vérification email
              </label>
              <p className="text-sm text-gray-500">
                Exiger la vérification des emails
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailVerification}
              onChange={(e) => handleSettingChange("emailVerification", e.target.checked)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "payments":
        return renderPaymentSettings();
      case "users":
        return renderUserSettings();
      default:
        return renderGeneralSettings();
    }
  };

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
                Paramètres
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
                <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
                <p className="text-gray-600 mt-1">
                  Configurez les paramètres de la plateforme
                </p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Navigation latérale */}
                <div className="md:w-64 bg-gray-50 border-r border-gray-200">
                  <nav className="space-y-1 p-4">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            activeTab === tab.id
                              ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <IconComponent className="h-5 w-5 mr-3" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 p-6">
                  {renderContent()}
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={saveSettings}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Sauvegarder les paramètres
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Parametres;