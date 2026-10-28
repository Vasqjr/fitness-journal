import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ProgressPage from './pages/ProgressPage';
import ExercisesPage from './pages/ExercisesPage';
import Navbar from './components/Navbar';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>
      <Navbar />
      <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 56px)' }}>
        {children}
      </div>
    </>
  ) : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/workouts" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/workouts" element={
            <ProtectedRoute><WorkoutsPage /></ProtectedRoute>
          } />
          <Route path="/workouts/:id" element={
            <ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><ProgressPage /></ProtectedRoute>
          } />
          <Route path="/exercises" element={
            <ProtectedRoute><ExercisesPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}