import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
// import { BanIcon } from '@heroicons/react/24/outline'; // Remplacez par l'icône que vous souhaitez utiliser

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
  NoSymbolIcon
} from '@heroicons/react/24/outline';

const TableauDonnees = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [],
    eleves: [],
    repetiteurs: [],
    cours: [],
    reservations: [],
    paiements: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const endpoints = [
        '/api/users',
        '/api/eleves',
        '/api/repetiteurs',
        '/api/cours',
        '/api/reservations',
        '/api/paiements'
      ];

      const requests = endpoints.map(endpoint => 
        axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      const responses = await Promise.all(requests);
      
      setData({
        users: responses[0].data,
        eleves: responses[1].data,
        repetiteurs: responses[2].data,
        cours: responses[3].data,
        reservations: responses[4].data,
        paiements: responses[5].data
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        alert('Session expirée. Veuillez vous reconnecter.');
        logout();
      } else {
        alert('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const statusClasses = {
      'en_attente': 'bg-orange-100 text-orange-800',
      'acceptee': 'bg-green-100 text-green-800',
      'refusee': 'bg-red-100 text-red-800',
      'annulee': 'bg-gray-100 text-gray-800'
    };
    
    const statusIcons = {
      'en_attente': <ClockIcon className="h-4 w-4 mr-1" />,
      'acceptee': <CheckCircleIcon className="h-4 w-4 mr-1" />,
      'refusee': <XCircleIcon className="h-4 w-4 mr-1" />,
      'annulee': <NoSymbolIcon className="h-4 w-4 mr-1" />
    };
    
    const statusText = {
      'en_attente': 'En attente',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée',
      'annulee': 'Annulée'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusIcons[status]}
        {statusText[status] || status}
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
    <div className="space-y-8">
      {/* Tableau des Utilisateurs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Utilisateurs ({data.users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.users?.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.prenom} {user.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.telephone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau des Élèves */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Élèves ({data.eleves.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Naissance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.eleves.map(eleve => {
                const user = data.users.find(u => u.id === eleve.user_id);
                return (
                  <tr key={eleve.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{eleve.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user?.prenom} {user?.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{eleve.niveau_scolaire}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(eleve.date_naissance).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau des Répétiteurs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Répétiteurs ({data.repetiteurs.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matières</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.repetiteurs.map(repetiteur => {
                const user = data.users.find(u => u.id === repetiteur.user_id);
                return (
                  <tr key={repetiteur.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repetiteur.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user?.prenom} {user?.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {JSON.parse(repetiteur.matieres).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {repetiteur.statut_verif === 'verifie' ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Vérifié</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Non vérifié</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau des Cours */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Cours ({data.cours.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif (FCFA/h)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.cours.map(cours => {
                const matiere = data.matieres.find(m => m.id === cours.matiere_id);
                const repetiteur = data.repetiteurs.find(r => r.id === cours.repetiteur_id);
                const user = data.users.find(u => u.id === repetiteur?.user_id);
                
                return (
                  <tr key={cours.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cours.titre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{matiere?.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{cours.niveau_scolaire}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cours.tarif_horaire}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau des Réservations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Réservations ({data.reservations.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Répétiteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.reservations.map(reservation => {
                const eleve = data.eleves.find(e => e.id === reservation.eleve_id);
                const userEleve = data.users.find(u => u.id === eleve?.user_id);
                const repetiteur = data.repetiteurs.find(r => r.id === reservation.repetiteur_id);
                const userRepetiteur = data.users.find(u => u.id === repetiteur?.user_id);
                
                return (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userEleve?.prenom} {userEleve?.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userRepetiteur?.prenom} {userRepetiteur?.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.date_reservation).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(reservation.statut)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau des Paiements */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Paiements ({data.paiements.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant (FCFA)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.paiements.map(paiement => {
                const reservation = data.reservations.find(r => r.id === paiement.reservation_id);
                
                return (
                  <tr key={paiement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Réservation #{reservation?.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paiement.montant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{paiement.methode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{paiement.statut}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableauDonnees;