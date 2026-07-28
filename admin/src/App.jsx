import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';
import Appearance from './pages/Appearance';
import HeroShapes from './pages/HeroShapes';
import Manifesto from './pages/Manifesto';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Leads from './pages/Leads';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { Quotes, Contracts, Invoices } from './pages/SalesDocs';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? '#0e0e0e' : '#fff',
            color: isDark ? '#fafafa' : '#0a0a0a',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,10,0.08)'}`,
          },
        }}
      />
      {user ? (
        <div className="flex h-screen flex-col overflow-hidden bg-bg">
          <Navbar />
          <div className="flex min-h-0 flex-1">
            <Sidebar />
            <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
              <div className="h-full min-h-0 flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
                  <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
                  <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
                  <Route path="/quotes" element={<PrivateRoute><Quotes /></PrivateRoute>} />
                  <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
                  <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
                  <Route path="/packages" element={<PrivateRoute><Packages /></PrivateRoute>} />
                  <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
                  <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                  <Route path="/appearance" element={<PrivateRoute><Appearance /></PrivateRoute>} />
                  <Route path="/hero-shapes" element={<PrivateRoute><HeroShapes /></PrivateRoute>} />
                  <Route path="/manifesto" element={<PrivateRoute><Manifesto /></PrivateRoute>} />
                  <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
