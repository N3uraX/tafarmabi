import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Globe } from 'lucide-react';

interface AnalyticsChartsProps {
  viewsOverTime: any[];
  blogAnalytics: any[];
  topReferrers: any[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  viewsOverTime,
  blogAnalytics,
  topReferrers
}) => {
  // Process daily views data
  const dailyViewsData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        views: 0
      };
    });

    viewsOverTime.forEach(view => {
      const viewDate = new Date(view.viewed_at).toISOString().split('T')[0];
      const dayData = last30Days.find(day => day.date === viewDate);
      if (dayData) {
        dayData.views++;
      }
    });

    return last30Days;
  }, [viewsOverTime]);

  // Get max views for scaling
  const maxDailyViews = Math.max(...dailyViewsData.map(d => d.views), 1);
  const maxBlogViews = Math.max(...blogAnalytics.map(b => b.view_count), 1);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Daily Views Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white font-mono">Daily Views (Last 30 Days)</h3>
          <TrendingUp className="w-5 h-5 text-neon-green" />
        </div>
        
        <div className="space-y-2">
          {dailyViewsData.slice(-7).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-3">
              <span className="text-gray-400 font-mono text-xs w-16">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <div className="flex-1 bg-dark-bg rounded-full h-6 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.views / maxDailyViews) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-neon-green to-blue-400 rounded-full"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-mono text-xs">
                  {day.views}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-dark-border">
          <div className="flex justify-between text-sm font-mono">
            <span className="text-gray-400">Total this week:</span>
            <span className="text-neon-green">
              {dailyViewsData.slice(-7).reduce((sum, day) => sum + day.views, 0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Top Posts Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white font-mono">Top Performing Posts</h3>
          <BarChart3 className="w-5 h-5 text-neon-green" />
        </div>
        
        <div className="space-y-3">
          {blogAnalytics.slice(0, 5).map((blog, index) => (
            <div key={blog.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-sm truncate flex-1 mr-2">
                  {blog.blogs.title}
                </span>
                <span className="text-neon-green font-mono text-sm font-semibold">
                  {blog.view_count}
                </span>
              </div>
              <div className="bg-dark-bg rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(blog.view_count / maxBlogViews) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-neon-green to-blue-400 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
        
        {blogAnalytics.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 font-mono text-sm">No data available</p>
          </div>
        )}
      </motion.div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-card border border-dark-border rounded-xl p-6 lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white font-mono">Traffic Sources</h3>
          <Globe className="w-5 h-5 text-neon-green" />
        </div>
        
        {topReferrers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topReferrers.slice(0, 6).map((referrer, index) => (
              <motion.div
                key={referrer.referrer}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-bg border border-dark-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-mono text-sm font-semibold truncate">
                    {referrer.referrer}
                  </span>
                  <span className="text-neon-green font-mono text-sm">
                    {referrer.count}
                  </span>
                </div>
                <div className="bg-dark-card rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(referrer.count / Math.max(...topReferrers.map(r => r.count))) * 100}%` 
                    }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 font-mono text-sm">No referrer data available</p>
            <p className="text-gray-500 font-mono text-xs mt-1">
              Traffic sources will appear as visitors arrive from external sites
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;