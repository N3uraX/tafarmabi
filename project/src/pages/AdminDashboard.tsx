import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, FileText, Code2, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlogManager from '../components/admin/BlogManager';
import ProjectManager from '../components/admin/ProjectManager';
import MessageManager from '../components/admin/MessageManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'messages'>('messages');
  const { signOut, user } = useAuth();

  const tabs = [
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Code2 }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Code2 className="w-8 h-8 text-neon-green" />
              <div>
                <h1 className="text-xl font-bold text-white font-mono">Admin Dashboard</h1>
                <p className="text-sm text-gray-400 font-mono">Welcome back, {user?.email}</p>
              </div>
            </div>
            
            <motion.button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-mono text-sm">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-dark-card rounded-lg p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'blogs' | 'projects' | 'messages')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-neon-green text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'messages' && <MessageManager />}
          {activeTab === 'blogs' && <BlogManager />}
          {activeTab === 'projects' && <ProjectManager />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;