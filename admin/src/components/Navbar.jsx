import { User, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 md:px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-emerald-500">B-CODE</h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-400">Admin Dashboard</p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user?.fullName}</p>
              <p className="text-xs text-gray-600 dark:text-zinc-400">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-zinc-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-900 dark:text-zinc-100" />
          ) : (
            <Menu className="w-5 h-5 text-gray-900 dark:text-zinc-100" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-zinc-800 pt-4 slide-in-left">
          <div className="flex flex-col gap-3">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user?.fullName}</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400">{user?.email}</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-900 dark:text-zinc-100">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-slate-700" />
                  <span className="text-gray-900 dark:text-zinc-100">Dark Mode</span>
                </>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 rounded-lg transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;