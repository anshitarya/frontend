import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import InboxPage from './pages/InboxPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SearchPage from './pages/SearchPage';
import { apiService } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('inbox');
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend health on startup
    const checkHealth = async () => {
      try {
        await apiService.healthCheck();
        setIsHealthy(true);
      } catch (error) {
        setIsHealthy(false);
        console.error('Backend health check failed:', error);
      }
    };

    checkHealth();
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'inbox':
        return <InboxPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'search':
        return <SearchPage />;
      default:
        return <InboxPage />;
    }
  };

  if (isHealthy === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Backend Unavailable</h2>
            <p className="text-gray-600 mb-4">
              Cannot connect to the API server. Please ensure the backend is running at:
            </p>
            <code className="bg-gray-100 px-3 py-1 rounded text-sm break-all">https://review-management-system-x8un.onrender.com/api</code>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isHealthy === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <p className="text-lg font-semibold">Connecting to backend...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
