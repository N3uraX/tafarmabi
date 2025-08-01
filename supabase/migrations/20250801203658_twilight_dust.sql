/*
  # Add Blog Analytics Tracking

  1. New Tables
    - `blog_analytics`
      - `id` (uuid, primary key)
      - `blog_id` (uuid, foreign key to blogs table)
      - `view_count` (integer, default 0)
      - `unique_views` (integer, default 0)
      - `last_viewed` (timestamp with timezone)
      - `created_at` (timestamp with timezone, defaults to now)
      - `updated_at` (timestamp with timezone, defaults to now)
    
    - `blog_views`
      - `id` (uuid, primary key)
      - `blog_id` (uuid, foreign key to blogs table)
      - `ip_hash` (text, hashed IP for privacy)
      - `user_agent` (text, optional)
      - `referrer` (text, optional)
      - `viewed_at` (timestamp with timezone, defaults to now)
      - `session_id` (text, for tracking unique sessions)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert (view tracking) and authenticated read/delete
    
  3. Indexes
    - Index on blog_id for both tables
    - Index on viewed_at for time-based queries
    - Index on ip_hash for unique visitor tracking
*/

-- Create blog_analytics table for aggregated stats
CREATE TABLE IF NOT EXISTS blog_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  view_count integer DEFAULT 0 NOT NULL,
  unique_views integer DEFAULT 0 NOT NULL,
  last_viewed timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(blog_id)
);

-- Create blog_views table for individual view records
CREATE TABLE IF NOT EXISTS blog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  ip_hash text NOT NULL,
  user_agent text DEFAULT '',
  referrer text DEFAULT '',
  viewed_at timestamptz DEFAULT now() NOT NULL,
  session_id text NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_id ON blog_analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_updated_at ON blog_analytics(updated_at);

CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_viewed_at ON blog_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_blog_views_ip_hash ON blog_views(ip_hash);
CREATE INDEX IF NOT EXISTS idx_blog_views_session_id ON blog_views(session_id);

-- Enable RLS
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- Policies for blog_analytics
CREATE POLICY "Anyone can read blog analytics"
  ON blog_analytics
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage blog analytics"
  ON blog_analytics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for blog_views
CREATE POLICY "Anyone can insert blog views"
  ON blog_views
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read blog views"
  ON blog_views
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete blog views"
  ON blog_views
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to update analytics when a view is recorded
CREATE OR REPLACE FUNCTION update_blog_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update analytics record
  INSERT INTO blog_analytics (blog_id, view_count, unique_views, last_viewed, updated_at)
  VALUES (
    NEW.blog_id,
    1,
    CASE WHEN NOT EXISTS (
      SELECT 1 FROM blog_views 
      WHERE blog_id = NEW.blog_id 
      AND ip_hash = NEW.ip_hash 
      AND viewed_at > NOW() - INTERVAL '24 hours'
    ) THEN 1 ELSE 0 END,
    NEW.viewed_at,
    NOW()
  )
  ON CONFLICT (blog_id) DO UPDATE SET
    view_count = blog_analytics.view_count + 1,
    unique_views = blog_analytics.unique_views + CASE WHEN NOT EXISTS (
      SELECT 1 FROM blog_views 
      WHERE blog_id = NEW.blog_id 
      AND ip_hash = NEW.ip_hash 
      AND viewed_at > NOW() - INTERVAL '24 hours'
      AND id != NEW.id
    ) THEN 1 ELSE 0 END,
    last_viewed = NEW.viewed_at,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update analytics
CREATE TRIGGER update_blog_analytics_trigger
  AFTER INSERT ON blog_views
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_analytics();

-- Function to get blog analytics with time periods
CREATE OR REPLACE FUNCTION get_blog_analytics_summary()
RETURNS TABLE (
  total_views bigint,
  total_unique_views bigint,
  views_this_week bigint,
  views_this_month bigint,
  most_viewed_blog_id uuid,
  most_viewed_blog_title text,
  most_viewed_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ba.view_count), 0) as total_views,
    COALESCE(SUM(ba.unique_views), 0) as total_unique_views,
    COALESCE(SUM(
      (SELECT COUNT(*) FROM blog_views bv 
       WHERE bv.blog_id = ba.blog_id 
       AND bv.viewed_at >= DATE_TRUNC('week', NOW()))
    ), 0) as views_this_week,
    COALESCE(SUM(
      (SELECT COUNT(*) FROM blog_views bv 
       WHERE bv.blog_id = ba.blog_id 
       AND bv.viewed_at >= DATE_TRUNC('month', NOW()))
    ), 0) as views_this_month,
    (SELECT ba2.blog_id FROM blog_analytics ba2 ORDER BY ba2.view_count DESC LIMIT 1) as most_viewed_blog_id,
    (SELECT b.title FROM blogs b 
     JOIN blog_analytics ba2 ON b.id = ba2.blog_id 
     ORDER BY ba2.view_count DESC LIMIT 1) as most_viewed_blog_title,
    (SELECT ba2.view_count FROM blog_analytics ba2 ORDER BY ba2.view_count DESC LIMIT 1) as most_viewed_count
  FROM blog_analytics ba;
END;
$$ LANGUAGE plpgsql;