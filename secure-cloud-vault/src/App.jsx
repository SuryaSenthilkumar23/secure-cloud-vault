import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import './App.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('login');
  const { currentUser, loading } = useAuth();

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Wait for Firebase to finish loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Auto-redirect based on auth state
  useEffect(() => {
    if (currentUser && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('dashboard');
    } else if (!currentUser && currentPage === 'dashboard') {
      setCurrentPage('login');
    }
  }, [currentUser, currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return currentUser ? (
          <DashboardPage onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} />
        );
      default:
        return <LoginPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;