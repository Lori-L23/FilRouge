import React, { useEffect, useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import RecentUsers from '../components/RecentUsers';
import axios from 'axios';

export default function Profilad() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Récupérer les stats
        axios.get('/api/admin/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setStats(res.data));

        // Récupérer les utilisateurs récents
        axios.get('/api/admin/recent-users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setUsers(res.data));
    }, []);

    return (
        <div className="container py-4">
            <h1 className="mb-4">Tableau de Bord Admin</h1>
            
            {stats && <DashboardStats data={stats} />}
            
            <div className="card mt-4">
                <div className="card-header">
                    <h3>Utilisateurs Récents</h3>
                </div>
                <div className="card-body">
                    <RecentUsers users={users} />
                </div>
            </div>
        </div>
    );
}