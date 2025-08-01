@@ .. @@
 import { LogOut, FileText, Code2, Mail } from 'lucide-react';
+import { BarChart3 } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
 import BlogManager from '../components/admin/BlogManager';
 import ProjectManager from '../components/admin/ProjectManager';
 import MessageManager from '../components/admin/MessageManager';
+import AnalyticsManager from '../components/admin/AnalyticsManager';

 const AdminDashboard = () => {
 }
-  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'messages'>('messages');
+  const [activeTab, setActiveTab] = useState<'analytics' | 'blogs' | 'projects' | 'messages'>('analytics');
   const { signOut, user } = useAuth();

   const tabs = [
   ]
+    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
     { id: 'messages', label: 'Messages', icon: Mail },
     { id: 'blogs', label: 'Blog Posts', icon: FileText },
     { id: 'projects', label: 'Projects', icon: Code2 }
@@ .. @@
         {/* Tab Navigation */}
         <div className="flex space-x-1 bg-dark-card rounded-lg p-1 mb-8 w-fit">
           {tabs.map((tab) => (
             <motion.button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as 'blogs' | 'projects' | 'messages')}
         )
         )
         }
+              onClick={() => setActiveTab(tab.id as 'analytics' | 'blogs' | 'projects' | 'messages')}
               className={`flex items-center space-x-2 px-4 py-2 rounded-md font-mono text-sm transition-colors ${
                 activeTab === tab.id
                   ? 'bg-neon-green text-black'
               }
@@ .. @@
           transition={{ duration: 0.3 }}
         >
+          {activeTab === 'analytics' && <AnalyticsManager />}
           {activeTab === 'messages' && <MessageManager />}
           {activeTab === 'blogs' && <BlogManager />}
           {activeTab === 'projects' && <ProjectManager />}