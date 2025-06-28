import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neon-green font-mono">Verifying access...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Additional security check: verify user has admin role
  // This checks if the user email matches the admin email
  const isAdmin = user.email === 'greetmeasap@gmail.com' || 
                  user.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white font-mono mb-4">Access Denied</h1>
          <p className="text-gray-400 font-mono mb-6">
            You don't have permission to access this area.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-neon-green text-black px-6 py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;