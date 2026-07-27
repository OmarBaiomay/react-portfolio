import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Wrench, Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Notifications', path: '/notifications', icon: Bell }
  ];

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center md:hidden"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300' : 'relative'}
          ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 min-h-screen p-4 shadow-sm
        `}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg md:hidden"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
          </button>
        )}

        <nav className="space-y-2 mt-12 md:mt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold shadow-md'
                    : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;