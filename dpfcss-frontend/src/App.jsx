import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import useAuthStore from './store/authStore';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import PatientDashboard from './pages/patient/PatientDashboard';
import PatientMessages from './pages/patient/PatientMessages';
import PatientSettings from './pages/patient/PatientSettings';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderMessages from './pages/provider/ProviderMessages';
import ProviderSettings from './pages/provider/ProviderSettings';
import ProviderPatients from './pages/provider/ProviderPatients';
import ProviderAppointments from './pages/provider/ProviderAppointments';

import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
            background: 'rgba(8, 15, 40, 0.95)',
            color: '#f0f6ff',
            border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '0.875rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 30px rgba(14,165,233,0.12), 0 10px 40px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#06d6a0', secondary: 'rgba(6,214,160,0.1)' } },
          error:   { iconTheme: { primary: '#f87171', secondary: 'rgba(239,68,68,0.1)'  } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient routes */}
        <Route path="/patient" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </PrivateRoute>
        } />
        <Route path="/patient/messages" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientMessages />
          </PrivateRoute>
        } />
        <Route path="/patient/settings" element={
          <PrivateRoute allowedRoles={['patient']}>
            <PatientSettings />
          </PrivateRoute>
        } />

        {/* Provider routes */}
        <Route path="/provider" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </PrivateRoute>
        } />
        <Route path="/provider/patients" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderPatients />
          </PrivateRoute>
        } />
        <Route path="/provider/appointments" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderAppointments />
          </PrivateRoute>
        } />
        <Route path="/provider/messages" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderMessages />
          </PrivateRoute>
        } />
        <Route path="/provider/settings" element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderSettings />
          </PrivateRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
