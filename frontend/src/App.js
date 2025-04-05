import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FarmerDashboard from './pages/farmer/Dashboard';
import OperatorDashboard from './pages/operator/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import FieldManagement from './pages/farmer/FieldManagement';
import ServiceRequests from './pages/farmer/ServiceRequests';
import ServiceRequestForm from './pages/farmer/ServiceRequestForm';
import NearbyOperators from './pages/farmer/NearbyOperators';
import AvailableRequests from './pages/operator/AvailableRequests';
import AssignedRequests from './pages/operator/AssignedRequests';
import OperatorProfile from './pages/operator/Profile';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';
import AdminRequests from './pages/admin/ServiceRequests';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" />;
    } else if (user.role === 'operator') {
      return <Navigate to="/operator/dashboard" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  
  return children;
};

function AppRoutes() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navigation user={user} onLogout={logout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              user ? (
                <Navigate to={`/${user.role}/dashboard`} />
              ) : (
                <Login onLogin={login} />
              )
            } />
            <Route path="/register" element={
              user ? (
                <Navigate to={`/${user.role}/dashboard`} />
              ) : (
                <Register onLogin={login} />
              )
            } />
            
            {/* Profile Route - Redirects based on role */}
            <Route path="/profile" element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin/settings" />
                ) : user.role === 'operator' ? (
                  <Navigate to="/operator/profile" />
                ) : (
                  <Navigate to="/farmer/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } />
            
            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/farmer/fields" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FieldManagement user={user} />
              </ProtectedRoute>
            } />
            <Route path="/farmer/service-requests" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <ServiceRequests user={user} />
              </ProtectedRoute>
            } />
            <Route path="/farmer/service-request-form" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <ServiceRequestForm user={user} />
              </ProtectedRoute>
            } />
            <Route path="/farmer/nearby-operators" element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <NearbyOperators user={user} />
              </ProtectedRoute>
            } />
            
            {/* Operator Routes */}
            <Route path="/operator/dashboard" element={
              <ProtectedRoute allowedRoles={['operator']}>
                <OperatorDashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/operator/available-requests" element={
              <ProtectedRoute allowedRoles={['operator']}>
                <AvailableRequests user={user} />
              </ProtectedRoute>
            } />
            <Route path="/operator/assigned-requests" element={
              <ProtectedRoute allowedRoles={['operator']}>
                <AssignedRequests user={user} />
              </ProtectedRoute>
            } />
            <Route path="/operator/profile" element={
              <ProtectedRoute allowedRoles={['operator']}>
                <OperatorProfile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement user={user} />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/new" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/edit/:userId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/form" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/admin/service-requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRequests user={user} />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
