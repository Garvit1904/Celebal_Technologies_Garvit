
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from './contexts/AppContext';
import { UserRole } from './constants';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TicketPage from './components/TicketPage';
import AdminPage from './components/AdminPage';
import { FullPageSpinner } from './components/common/Spinner';

const ProtectedRoute: React.FC<{ allowedRoles?: UserRole[] }> = ({ allowedRoles }) => {
  const { user, isLoading } = useAppContext();

  if (isLoading) {
    return <FullPageSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout><Outlet /></Layout>;
};

const App: React.FC = () => {
    const { user, isLoading } = useAppContext();

    if(isLoading && !user) {
        return <FullPageSpinner />;
    }

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets/new" element={<TicketPage />} />
                <Route path="/tickets/:id" element={<TicketPage />} />
            </Route>

            {/* Admin-only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                <Route path="/admin" element={<AdminPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
    );
};

export default App;
