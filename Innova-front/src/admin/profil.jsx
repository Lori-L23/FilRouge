import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Api from '../Services/Api';
import StatsCards from './StatsCards';
import RecentActivityTable from './RecentActivityTable';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentUsers: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          Api.get('/api/admin/stats'),
          Api.get('/api/admin/recent-users')
        ]);

        setDashboardData({
          stats: statsRes.data,
          recentUsers: usersRes.data,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Erreur dashboard admin:", error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || "Erreur de chargement"
        }));
        
        // Déconnexion si non autorisé
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    fetchDashboardData();
  }, [logout]);

  if (dashboardData.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {dashboardData.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tableau de Bord Administrateur
          </h1>
        </div>

        {/* Cartes de statistiques */}
        {dashboardData.stats && (
          <StatsCards 
            elevesCount={dashboardData.stats.eleves}
            repetiteursCount={dashboardData.stats.repetiteurs}
            coursCount={dashboardData.stats.cours}
            paiementsCount={dashboardData.stats.paiements}
          />
        )}

        {/* Activité récente */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Activité Récente
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            <RecentActivityTable users={dashboardData.recentUsers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;