import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Bell,
  Palette,
  Users,
  Settings,
  Quote,
  Box,
  X,
  Contact,
  FolderKanban,
  FileText,
  ScrollText,
  Receipt,
  ChevronDown,
  Briefcase,
  Truck,
  ShoppingBag,
  Globe2,
  Shield,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

function pathMatches(pathname, path) {
  if (pathname === path) return true;
  return pathname.startsWith(`${path}/`);
}

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
          isActive
            ? 'bg-accent font-semibold text-white shadow-glow'
            : 'text-muted hover:bg-surface hover:text-ink'
        }`
      }
    >
      <item.icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
      <span className="truncate">{item.name}</span>
    </NavLink>
  );
}

function NavGroup({ id, label, icon: Icon, items, open, onToggle, onNavigate, pathname }) {
  const hasActive = items.some((item) => pathMatches(pathname, item.path));

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-semibold transition ${
          hasActive
            ? 'bg-accent/15 text-accent'
            : 'text-ink hover:bg-surface'
        }`}
      >
        <Icon className="h-[1.125rem] w-[1.125rem] shrink-0 opacity-80" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-0.5 ps-2 pb-1">
            {items.map((item) => (
              <NavItem key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const { t, isRtl } = useLanguage();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const groups = useMemo(() => {
    const g = t.nav.groups || {};
    return [
      {
        id: 'sales',
        label: g.sales || 'Sales & CRM',
        icon: Briefcase,
        items: [
          { name: t.nav.leads, path: '/leads', icon: Contact },
          { name: t.nav.quotes, path: '/quotes', icon: FileText },
          { name: t.nav.contracts, path: '/contracts', icon: ScrollText },
          { name: t.nav.invoices, path: '/invoices', icon: Receipt },
        ],
      },
      {
        id: 'delivery',
        label: g.delivery || 'Delivery',
        icon: Truck,
        items: [{ name: t.nav.projects, path: '/projects', icon: FolderKanban }],
      },
      {
        id: 'catalog',
        label: g.catalog || 'Catalog',
        icon: ShoppingBag,
        items: [
          { name: t.nav.packages, path: '/packages', icon: Package },
          { name: t.nav.maintenance, path: '/maintenance', icon: Wrench },
        ],
      },
      {
        id: 'website',
        label: g.website || 'Website',
        icon: Globe2,
        items: [
          { name: t.nav.appearance, path: '/appearance', icon: Palette },
          { name: t.nav.heroShapes, path: '/hero-shapes', icon: Box },
          { name: t.nav.manifesto, path: '/manifesto', icon: Quote },
          { name: t.nav.notifications, path: '/notifications', icon: Bell },
        ],
      },
      {
        id: 'system',
        label: g.system || 'System',
        icon: Shield,
        items: [
          ...(user?.role === 'admin'
            ? [{ name: t.nav.users, path: '/users', icon: Users }]
            : []),
          { name: t.nav.settings, path: '/settings', icon: Settings },
        ],
      },
    ].filter((group) => group.items.length > 0);
  }, [t, user?.role]);

  // Keep the active section open when the route changes.
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      groups.forEach((group) => {
        if (group.items.some((item) => pathMatches(pathname, item.path))) {
          next[group.id] = true;
        }
      });
      return next;
    });
  }, [pathname, groups]);

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeMobileMenu = () => {
    if (isMobile) setIsMobileOpen(false);
  };

  const edgeClass = isRtl ? 'right-0' : 'left-0';
  const hiddenClass = isRtl
    ? isMobileOpen
      ? 'translate-x-0'
      : 'translate-x-full'
    : isMobileOpen
      ? 'translate-x-0'
      : '-translate-x-full';
  const fabSide = isRtl ? 'left-6' : 'right-6';

  return (
    <>
      {isMobile && !isMobileOpen ? (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className={`fixed bottom-6 ${fabSide} z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-glow md:hidden`}
          aria-label={t.a11y.openMenu}
        >
          <LayoutDashboard className="h-6 w-6" />
        </button>
      ) : null}

      {isMobile && isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label={t.a11y.closeMenu}
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`
          ${isMobile ? `fixed inset-y-0 ${edgeClass} z-50 transform transition-transform duration-300` : 'relative h-full shrink-0 overflow-y-auto'}
          ${isMobile ? hiddenClass : ''}
          w-64 border-line/10 bg-elevated p-3 shadow-sm sm:p-4
          ${isRtl ? 'border-l' : 'border-r'}
        `}
      >
        {isMobile ? (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 end-4 icon-btn md:hidden"
            aria-label={t.a11y.closeMenu}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        <div className="mb-5 mt-10 flex items-center gap-3 px-2 md:mt-1">
          <span
            className="brand-logo-mask inline-block h-9 w-9 shrink-0 bg-ink"
            style={{
              WebkitMaskImage: 'url(/images/logo.svg)',
              maskImage: 'url(/images/logo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{t.brand}</p>
            <p className="truncate text-xs text-muted">{t.admin}</p>
          </div>
        </div>

        <nav className="space-y-3" aria-label="Admin">
          <NavItem
            item={{ name: t.nav.dashboard, path: '/dashboard', icon: LayoutDashboard }}
            onNavigate={closeMobileMenu}
          />

          <div className="space-y-2 border-t border-line/10 pt-3">
            {groups.map((group) => (
              <NavGroup
                key={group.id}
                id={group.id}
                label={group.label}
                icon={group.icon}
                items={group.items}
                open={Boolean(openGroups[group.id])}
                onToggle={toggleGroup}
                onNavigate={closeMobileMenu}
                pathname={pathname}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
