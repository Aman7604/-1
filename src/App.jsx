import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import NotificationSystem from './components/NotificationSystem';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BrowsePage from './pages/BrowsePage';
import UploadPage from './pages/UploadPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onPageChange={setCurrentPage} />;
      case 'login':
        return <AuthPage mode="login" onPageChange={setCurrentPage} />;
      case 'signup':
        return <AuthPage mode="signup" onPageChange={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'browse':
        return <BrowsePage onPageChange={setCurrentPage} />;
      case 'upload':
        return <UploadPage onPageChange={setCurrentPage} />;
      default:
        return <LandingPage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
            {renderPage()}
            <NotificationSystem />
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;