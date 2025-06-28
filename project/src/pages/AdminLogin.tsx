import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate('/admin');
    } catch (error: any) {
      setError('root', { message: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-card border border-dark-border rounded-xl p-8">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-neon-green mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-mono">Admin Access</h1>
            <p className="text-gray-400 font-mono text-sm mt-2">
              Authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm font-mono mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg text-white font-mono focus:border-neon-green focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-green transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm font-mono mt-1">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm font-mono">{errors.root.message}</p>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-green text-black py-3 rounded-lg font-mono font-semibold hover:bg-neon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;