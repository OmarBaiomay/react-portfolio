import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Wrench,
  TrendingUp,
  Users,
  Contact,
  FolderKanban,
  Receipt,
  FileText,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { statsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatMoney } from '../lib/crm.jsx';

const Dashboard = () => {
  const { t } = useLanguage();
  const D = t.dashboard;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await statsAPI.getOverview();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">{D.title}</h1>
        <p className="mt-1 text-muted">{D.welcome}</p>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{D.crmSection}</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <StatsCard
          title={D.leadsTotal}
          value={stats.leads?.total || 0}
          icon={Contact}
          color="bg-accent/15 text-accent"
        />
        <StatsCard
          title={D.leadsNewMonth}
          value={stats.leads?.newThisMonth || 0}
          icon={TrendingUp}
          color="bg-sky-500/15 text-sky-300"
        />
        <StatsCard
          title={D.projectsActive}
          value={stats.projects?.active || 0}
          icon={FolderKanban}
          color="bg-violet-500/15 text-violet-300"
        />
        <StatsCard
          title={D.overdueTasks}
          value={stats.projects?.overdueTasks || 0}
          icon={Users}
          color="bg-rose-500/15 text-rose-300"
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{D.salesSection}</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <StatsCard
          title={D.openQuotes}
          value={formatMoney(stats.sales?.openQuotesValue)}
          icon={FileText}
          color="bg-amber-500/15 text-amber-300"
        />
        <StatsCard
          title={D.unpaidInvoices}
          value={formatMoney(stats.sales?.unpaidInvoicesValue)}
          icon={Receipt}
          color="bg-rose-500/15 text-rose-300"
        />
        <StatsCard
          title={D.paidThisMonth}
          value={formatMoney(stats.sales?.paidThisMonth)}
          icon={TrendingUp}
          color="bg-emerald-500/15 text-emerald-300"
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{D.catalogSection}</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <StatsCard
          title={D.totalPackages}
          value={stats.catalog?.packages || 0}
          icon={Package}
          color="bg-accent/15 text-accent"
        />
        <StatsCard
          title={D.activePackages}
          value={stats.catalog?.activePackages || 0}
          icon={TrendingUp}
          color="bg-accent/10 text-accent"
        />
        <StatsCard
          title={D.maintenancePlans}
          value={stats.catalog?.maintenance || 0}
          icon={Wrench}
          color="bg-surface text-accent"
        />
        <StatsCard
          title={D.activePlans}
          value={stats.catalog?.activePlans || 0}
          icon={Users}
          color="bg-accent/15 text-accent"
        />
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">{D.quickActions}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/leads"
            className="group rounded-lg bg-surface p-4 text-center transition hover:border-accent/40 hover:bg-elevated"
          >
            <Contact className="mx-auto mb-2 h-8 w-8 text-accent transition group-hover:scale-110" />
            <p className="font-medium text-ink">{D.manageLeads}</p>
            <p className="mt-1 text-xs text-muted">{D.manageLeadsDesc}</p>
          </Link>
          <Link
            to="/projects"
            className="group rounded-lg bg-surface p-4 text-center transition hover:border-accent/40 hover:bg-elevated"
          >
            <FolderKanban className="mx-auto mb-2 h-8 w-8 text-accent transition group-hover:scale-110" />
            <p className="font-medium text-ink">{D.manageProjects}</p>
            <p className="mt-1 text-xs text-muted">{D.manageProjectsDesc}</p>
          </Link>
          <Link
            to="/invoices"
            className="group rounded-lg bg-surface p-4 text-center transition hover:border-accent/40 hover:bg-elevated"
          >
            <Receipt className="mx-auto mb-2 h-8 w-8 text-accent transition group-hover:scale-110" />
            <p className="font-medium text-ink">{D.manageInvoices}</p>
            <p className="mt-1 text-xs text-muted">{D.manageInvoicesDesc}</p>
          </Link>
          <Link
            to="/packages"
            className="group rounded-lg bg-surface p-4 text-center transition hover:border-accent/40 hover:bg-elevated"
          >
            <Package className="mx-auto mb-2 h-8 w-8 text-accent transition group-hover:scale-110" />
            <p className="font-medium text-ink">{D.managePackages}</p>
            <p className="mt-1 text-xs text-muted">{D.managePackagesDesc}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
