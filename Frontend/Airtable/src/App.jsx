import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import Responses from './pages/Response';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './styles/dashboard.css';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/builder/:formId?" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
              <Route path="/form/:formId" element={<FormViewer />} />
              <Route path="/forms/:formId/responses" element={<PrivateRoute><Responses /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
