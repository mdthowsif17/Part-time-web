import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
import UserHome from './pages/UserHome';
import EmployerHome from './pages/EmployerHome';
import PostJobPage from './pages/PostJobPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import './index.css';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/home" />;
  return children;
}

function HomeRouter() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'employer') return <EmployerHome />;
  return <UserHome />;
}

function NavbarWrapper() {
  const location = useLocation();
  const { user } = useAuth();
  if (location.pathname === '/' && !user) return null;
  return <Navbar />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <WelcomePage />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <AuthPage mode="login" />} />
        <Route path="/register" element={user ? <Navigate to="/home" /> : <AuthPage mode="register" />} />
        <Route path="/home" element={<HomeRouter />} />
        <Route path="/post-job" element={
          <ProtectedRoute role="employer"><PostJobPage /></ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute role="user"><MyApplicationsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
