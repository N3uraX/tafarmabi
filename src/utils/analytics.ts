import { supabase } from '../lib/supabase';

// Generate a hash from IP address for privacy
export const hashIP = async (ip: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'blog-analytics-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Get client IP address (fallback methods)
export const getClientIP = async (): Promise<string> => {
  try {
    // Try to get IP from a service (in production, you might want to use your own endpoint)
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    // Fallback to a simple hash of user agent + timestamp
    const fallback = navigator.userAgent + Date.now().toString();
    return await hashIP(fallback);
  }
};

// Generate session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('blog-session-id');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('blog-session-id', sessionId);
  }
  return sessionId;
};

// Check if view should be tracked (rate limiting)
export const shouldTrackView = (blogId: string): boolean => {
  const lastTracked = localStorage.getItem(`blog-view-${blogId}`);
  const now = Date.now();
  
  if (!lastTracked) {
    localStorage.setItem(`blog-view-${blogId}`, now.toString());
    return true;
  }
  
  const timeDiff = now - parseInt(lastTracked);
  const thirtySeconds = 30 * 1000;
  
  if (timeDiff > thirtySeconds) {
    localStorage.setItem(`blog-view-${blogId}`, now.toString());
    return true;
  }
  
  return false;
};

// Track blog view
export const trackBlogView = async (blogId: string): Promise<void> => {
  if (!shouldTrackView(blogId)) {
    return;
  }

  try {
    const ipHash = await hashIP(await getClientIP());
    const sessionId = getSessionId();
    
    const { error } = await supabase
      .from('blog_views')
      .insert({
        blog_id: blogId,
        ip_hash: ipHash,
        user_agent: navigator.userAgent.substring(0, 500), // Limit length
        referrer: document.referrer.substring(0, 500), // Limit length
        session_id: sessionId
      });

    if (error) {
      console.error('Error tracking blog view:', error);
    }
  } catch (error) {
    console.error('Error tracking blog view:', error);
  }
};

// Analytics API functions
export const getAnalyticsSummary = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_blog_analytics_summary');

    if (error) throw error;
    return data[0] || {
      total_views: 0,
      total_unique_views: 0,
      views_this_week: 0,
      views_this_month: 0,
      most_viewed_blog_id: null,
      most_viewed_blog_title: null,
      most_viewed_count: 0
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
};

export const getBlogAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_analytics')
      .select(`
        *,
        blogs (
          id,
          title,
          created_at
        )
      `)
      .order('view_count', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog analytics:', error);
    throw error;
  }
};

export const getBlogViewsOverTime = async (days: number = 30) => {
  try {
    const { data, error } = await supabase
      .from('blog_views')
      .select('viewed_at, blog_id')
      .gte('viewed_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('viewed_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog views over time:', error);
    throw error;
  }
};

export const getTopReferrers = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_views')
      .select('referrer')
      .neq('referrer', '')
      .not('referrer', 'is', null);

    if (error) throw error;
    
    // Count referrers
    const referrerCounts: { [key: string]: number } = {};
    data?.forEach(view => {
      if (view.referrer) {
        try {
          const domain = new URL(view.referrer).hostname;
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        } catch {
          referrerCounts['Direct'] = (referrerCounts['Direct'] || 0) + 1;
        }
      }
    });

    return Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching top referrers:', error);
    throw error;
  }
};

export const resetBlogAnalytics = async (blogId: string) => {
  try {
    // Delete all views for this blog
    const { error: viewsError } = await supabase
      .from('blog_views')
      .delete()
      .eq('blog_id', blogId);

    if (viewsError) throw viewsError;

    // Delete analytics record (will be recreated when new views come in)
    const { error: analyticsError } = await supabase
      .from('blog_analytics')
      .delete()
      .eq('blog_id', blogId);

    if (analyticsError) throw analyticsError;
  } catch (error) {
    console.error('Error resetting blog analytics:', error);
    throw error;
  }
};