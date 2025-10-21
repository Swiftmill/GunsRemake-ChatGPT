import React, { useEffect, useState } from 'react';
import { FiAward, FiDatabase, FiUsers } from 'react-icons/fi';
import api from '../api/client';
import useAuth from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import AdminTable from '../components/AdminTable';

const AdminPage = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [overviewResponse, usersResponse, badgesResponse] = await Promise.all([
          api.get('/admin/overview'),
          api.get('/admin/users'),
          api.get('/admin/badges')
        ]);
        setOverview(overviewResponse.data);
        setUsers(usersResponse.data);
        setBadges(badgesResponse.data);
      } catch (error) {
        console.warn(error);
      }
    };

    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="glass-card p-10 text-center text-white/60">
        <p>Admin access required. Sign in with an administrator account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Control Center</h1>
        <p className="text-sm text-white/60">Manage badges, templates, users and review platform analytics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={overview?.totals?.users || 0} trend={8.2} icon={<FiUsers />} />
        <StatCard title="Badges" value={overview?.totals?.badges || 0} trend={2.5} icon={<FiAward />} />
        <StatCard title="Links" value={overview?.totals?.links || 0} trend={12.1} icon={<FiDatabase />} />
      </div>

      <AdminTable
        items={users}
        columns={[
          { key: 'displayName', label: 'Display Name' },
          { key: 'username', label: 'Username', render: (value) => `@${value}` },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' }
        ]}
      />

      <AdminTable
        items={badges}
        columns={[
          { key: 'name', label: 'Badge' },
          { key: 'description', label: 'Description' },
          { key: 'color', label: 'Color' }
        ]}
      />
    </div>
  );
};

export default AdminPage;
