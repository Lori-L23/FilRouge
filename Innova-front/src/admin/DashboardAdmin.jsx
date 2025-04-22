import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import { useAuth } from '../Contexts/AuthContext';

import logo from "../assets/logo.png";
import lori from "../assets/lori.jpg"

import axios from 'axios';
import { 
  Layout, 
  Menu, // Import manquant ajouté ici
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  DatePicker, 
  message 
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  CalendarOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

// Configuration des items du menu
const items = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: 'Tableau de bord',
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: <Link to="/api/user">Utilisateurs</Link>,
  },
  {
    key: '3',
    icon: <BookOutlined />,
    label: <Link to="/admin/cours">Cours</Link>,
  },
  {
    key: '4',
    icon: <DollarOutlined />,
    label: <Link to="/admin/paiements">Paiements</Link>,
  },
  {
    key: '5',
    icon: <CalendarOutlined />,
    label: <Link to="/admin/reservations">Réservations</Link>,
  },
  {
    key: '6',
    icon: <SettingOutlined />,
    label: <Link to="/admin/parametres">Paramètres</Link>,
  }
];

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reservationsRes] = await Promise.all([
        axios.get('/api/admin/stats', { 
          params: { 
            start_date: dateRange[0]?.format('YYYY-MM-DD'),
            end_date: dateRange[1]?.format('YYYY-MM-DD') 
          } 
        }),
        axios.get('/api/admin/reservations/latest')
      ]);
      
      setStats(statsRes.data);
      setReservations(Array.isArray(reservationsRes.data) ? reservationsRes.data : []);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Élève',
      key: 'eleve',
      render: (_, record) => `${record.eleve?.user?.prenom || ''} ${record.eleve?.user?.nom || ''}`
    },
    {
      title: 'Professeur',
      key: 'professeur',
      render: (_, record) => `${record.repetiteur?.user?.prenom || ''} ${record.repetiteur?.user?.nom || ''}`
    },
    {
      title: 'Date Début',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: date => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: statut => {
        const statusMap = {
          'confirmed': { color: 'green', text: 'Confirmé' },
          'pending': { color: 'orange', text: 'En attente' },
          'cancelled': { color: 'red', text: 'Annulé' },
          'completed': { color: 'blue', text: 'Terminé' }
        };
        const status = statusMap[statut] || { color: 'default', text: statut };
        return <Tag color={status.color}>{status.text}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link to={`/admin/reservations/${record.id}`}>Voir</Link>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
         <div className='flex'>
            <img src={lori} alt="lori" className="h-20 rounded-full w-16 mt-4 ml-16 mb-4 content-around" />
            {/* <img src={logo} alt="Logo" className="h-12 w-auto mt-4  mb-4" /> */}
         </div>
        
    
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['1']}
          items={items} // Utilisation de la prop items au lieu de children
        />
      </Sider>

      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }} />
        
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <h1>Tableau de Bord Administrateur</h1>
            
            {/* Filtres */}
            <div style={{ marginBottom: 20 }}>
              <RangePicker 
                onChange={setDateRange} 
                style={{ width: 300 }} 
              />
            </div>
            
            {/* Statistiques */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Utilisateurs" 
                    value={stats.users_count || 0} 
                    loading={loading}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Réservations" 
                    value={stats.reservations_count || 0} 
                    loading={loading}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Revenus (FCFA)" 
                    value={stats.revenue || 0} 
                    precision={2}
                    loading={loading}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Cours terminés" 
                    value={stats.completed_sessions || 0} 
                    loading={loading}
                  />
                </Card>
              </Col>
            </Row>
            
            {/* Dernières réservations */}
            <Card title="Dernières Réservations" style={{ marginBottom: 20 }}>
              <Table 
                columns={columns} 
                dataSource={reservations} 
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'Aucune donnée disponible' }}
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}