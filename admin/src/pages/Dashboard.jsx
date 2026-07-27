import { useEffect, useState } from 'react';
import { Package, Wrench, TrendingUp, Users } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { packageAPI, maintenanceAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    maintenance: 0,
    activePackages: 0,
    activePlans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pkgStats, maintStats] = await Promise.all([
        packageAPI.getStats(),
        maintenanceAPI.getStats()
      ]);

      setStats({
        packages: pkgStats.data.totalPackages || 0,
        maintenance: maintStats.data.totalPlans || 0,
        activePackages: pkgStats.data.activePackages || 0,
        activePlans: maintStats.data.activePlans || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-zinc-400">Welcome to B-CODE Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Packages"
          value={stats.packages}
          icon={Package}
          color="bg-emerald-100 dark:bg-emerald-500/20"
        />
        <StatsCard
          title="Active Packages"
          value={stats.activePackages}
          icon={TrendingUp}
          color="bg-blue-100 dark:bg-blue-500/20"
        />
        <StatsCard
          title="Maintenance Plans"
          value={stats.maintenance}
          icon={Wrench}
          color="bg-purple-100 dark:bg-purple-500/20"
        />
        <StatsCard
          title="Active Plans"
          value={stats.activePlans}
          icon={Users}
          color="bg-orange-100 dark:bg-orange-500/20"
        />
      </div>

      {/* Quick Actions - Fixed Colors */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/packages"
            className="p-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-center group"
          >
            <Package className="w-8 h-8 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-gray-900 dark:text-zinc-100 font-medium">Manage Packages</p>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Create and edit pricing packages</p>
          </a>
          <a
            href="/maintenance"
            className="p-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-center group"
          >
            <Wrench className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-gray-900 dark:text-zinc-100 font-medium">Manage Plans</p>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Update maintenance offerings</p>
          </a>
          <a
            href="/notifications"
            className="p-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-center group"
          >
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-gray-900 dark:text-zinc-100 font-medium">Send Notifications</p>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">Notify users and admins</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;