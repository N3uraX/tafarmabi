import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Loader, Key } from 'lucide-react';
import { createAdminUser, checkAdminUserExists } from '../utils/createAdminUser';

const SetupAdmin = () => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'creating' | 'success' | 'error' | 'missing-key'>('checking');
  const [message, setMessage] = useState('');
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    // Check if service role key is available
    if (!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
      setStatus('missing-key');
      setMessage('Service role key is required for admin user creation. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your environment variables.');
      return;
    }

    checkAdmin();
  };

  const checkAdmin = async () => {
    setStatus('checking');
    setMessage('Checking for existing admin user...');
    
    try {
      const exists = await checkAdminUserExists();
      setAdminExists(exists);
      
      if (exists) {
        setStatus('success');
        setMessage('Admin user already exists and is ready to use.');
      } else {
        setStatus('ready');
        setMessage('Admin user not found. Click below to create it.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to check admin user. Please ensure your Supabase configuration is correct.');
    }
  };

  const handleCreateAdmin = async () => {
    setStatus('creating');
    setMessage('Creating admin user...');
    
    const result = await createAdminUser();
    
    if (result.success) {
      setStatus('success');
      setMessage('Admin user created successfully! You can now sign in.');
      setAdminExists(true);
    } else {
      setStatus('error');
      setMessage(`Failed to create admin user: ${result.error}`);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
      case 'creating':
        return <Loader className="w-8 h-8 text-neon-green animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      case 'missing-key':
        return <Key className="w-8 h-8 text-yellow-400" />;
      default:
        return <Shield className="w-8 h-8 text-neon-green" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'missing-key':
        return 'text-yellow-400';
      default:
        return 'text-neon-green';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-white font-mono mb-4">
            Admin Setup
          </h1>
          
          <p className={`font-mono text-sm mb-6 ${getStatusColor()}`}>
            {message}
          </p>

          {status === 'missing-key' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 font-mono text-xs text-left">
                <strong>Required:</strong> Add your Supabase Service Role Key to the environment variables:
                <br /><br />
                <code>VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</code>
                <br /><br />
                You can find this key in your Supabase Dashboard → Settings → API
              </p>
            </div>
          )}

          {status === 'ready' && (
            <motion.button
              onClick={handleCreateAdmin}
              className="w-full bg-neon-green text-black py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Admin User
            </motion.button>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-mono text-sm">
                  <strong>Email:</strong> greetmeasap@gmail.com<br />
                  <strong>Password:</strong> $Gr33t-me@sap
                </p>
              </div>
              
              <motion.a
                href="/admin/login"
                className="block w-full bg-neon-green text-black py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Admin Login
              </motion.a>
            </div>
          )}

          {(status === 'error' || status === 'missing-key') && (
            <motion.button
              onClick={checkEnvironment}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-mono font-semibold hover:bg-gray-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          )}

          <div className="mt-6 pt-4 border-t border-dark-border">
            <a 
              href="/"
              className="text-gray-400 hover:text-neon-green font-mono text-sm transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupAdmin;