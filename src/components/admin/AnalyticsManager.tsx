import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Calendar,
  RefreshCw,
  Trash2,
  ExternalLink,
  Clock
} from 'lucide-react';
import {
  getAnalyticsSummary,
  getBlogAnalytics,
  getBlogViewsOverTime,
  getTopReferrers,
  resetBlogAnalytics
} from '../../utils/analytics';
import AnalyticsCharts from './AnalyticsCharts';

interface AnalyticsSummary {
  total_views: number;
  total_unique_views: number;
  views_this_week: number;
  views_this_month: number;
  most_viewed_blog_id: string | null;
  most_viewed_blog_title: string | null;
  most_viewed_count: number;
}

interface BlogAnalytics {
  id: string;
  blog_id: string;
  view_count: number;
  unique_views: number;
  last_viewed: string | null;
  blogs: {
    id: string;
    title: string;
    created_at: string;
  };
}

const AnalyticsManager = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [blogAnalytics, setBlogAnalytics] = useState<BlogAnalytics[]>([]);
  const [viewsOverTime, setViewsOverTime] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [summaryData, analyticsData, viewsData, referrersData] = await Promise.all([
        getAnalyticsSummary(),
        getBlogAnalytics(),
        getBlogViewsOverTime(30),
        getTopReferrers()
      ]);

      setSummary(summaryData);
      setBlogAnalytics(analyticsData);
      setViewsOverTime(viewsData);
      setTopReferrers(referrersData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const handleResetAnalytics = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to reset analytics for "${blogTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await resetBlogAnalytics(blogId);
      await fetchAnalyticsData(); // Refresh data
    } catch (error) {
      console.error('Error resetting analytics:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getViewsThisWeek = (blogId: string) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return viewsOverTime.filter(view => 
      view.blog_id === blogId && new Date(view.viewed_at) >= weekAgo
    ).length;
  };

  const getViewsThisMonth = (blogId: string) => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return viewsOverTime.filter(view => 
      view.blog_id === blogId && new Date(view.viewed_at) >= monthAgo
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neon-green font-mono">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-mono">Blog Analytics</h2>
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200 disabled:opacity-50"
          whileHover={{ scale: refreshing ? 1 : 1.05 }}
          whileTap={{ scale: refreshing ? 1 : 0.95 }}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="font-mono text-sm">Refresh</span>
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Eye className="w-8 h-8 text-neon-green" />
            <span className="text-2xl font-bold text-white font-mono">
              {summary?.total_views?.toLocaleString() || 0}
            </span>
          </div>
          <h3 className="text-gray-400 font-mono text-sm">Total Views</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {summary?.total_unique_views?.toLocaleString() || 0}
            </span>
          </div>
          <h3 className="text-gray-400 font-mono text-sm">Unique Visitors</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {summary?.views_this_month?.toLocaleString() || 0}
            </span>
          </div>
          <h3 className="text-gray-400 font-mono text-sm">Views This Month</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white font-mono">
              {blogAnalytics.length > 0 
                ? Math.round((summary?.total_views || 0) / blogAnalytics.length)
                : 0
              }
            </span>
          </div>
          <h3 className="text-gray-400 font-mono text-sm">Avg Views/Post</h3>
        </motion.div>
      </div>

      {/* Charts Section */}
      <AnalyticsCharts 
        viewsOverTime={viewsOverTime}
        blogAnalytics={blogAnalytics}
        topReferrers={topReferrers}
      />

      {/* Most Viewed Post Highlight */}
      {summary?.most_viewed_blog_title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neon-green/10 to-blue-500/10 border border-neon-green/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-mono mb-2">
                🏆 Most Viewed Post
              </h3>
              <p className="text-neon-green font-mono">
                "{summary.most_viewed_blog_title}"
              </p>
              <p className="text-gray-400 font-mono text-sm mt-1">
                {summary.most_viewed_count.toLocaleString()} total views
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-neon-green opacity-50" />
          </div>
        </motion.div>
      )}

      {/* Analytics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-dark-border">
          <h3 className="text-xl font-bold text-white font-mono">Blog Performance</h3>
        </div>

        {blogAnalytics.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-mono">No analytics data yet.</p>
            <p className="text-gray-500 font-mono text-sm mt-2">
              Views will appear here once visitors start reading your blog posts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-mono text-sm">Blog Post</th>
                  <th className="text-left p-4 text-gray-300 font-mono text-sm">Published</th>
                  <th className="text-center p-4 text-gray-300 font-mono text-sm">Total Views</th>
                  <th className="text-center p-4 text-gray-300 font-mono text-sm">Unique Views</th>
                  <th className="text-center p-4 text-gray-300 font-mono text-sm">This Week</th>
                  <th className="text-center p-4 text-gray-300 font-mono text-sm">This Month</th>
                  <th className="text-left p-4 text-gray-300 font-mono text-sm">Last Viewed</th>
                  <th className="text-center p-4 text-gray-300 font-mono text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogAnalytics.map((analytics, index) => (
                  <motion.tr
                    key={analytics.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-dark-border hover:bg-dark-bg/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="text-white font-mono font-semibold text-sm">
                            {analytics.blogs.title}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 font-mono text-sm">
                        {formatDate(analytics.blogs.created_at)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-white font-mono font-semibold">
                        {analytics.view_count.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-blue-400 font-mono font-semibold">
                        {analytics.unique_views.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-purple-400 font-mono">
                        {getViewsThisWeek(analytics.blog_id)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-yellow-400 font-mono">
                        {getViewsThisMonth(analytics.blog_id)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-gray-400 font-mono text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(analytics.last_viewed)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <motion.a
                          href={`/blog/${analytics.blog_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                          whileHover={{ scale: 1.1 }}
                          title="View post"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
                        <motion.button
                          onClick={() => handleResetAnalytics(analytics.blog_id, analytics.blogs.title)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          title="Reset analytics"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsManager;