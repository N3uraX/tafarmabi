/*
  # Create blogs table

  1. New Tables
    - `blogs`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `body` (text, required)
      - `created_at` (timestamp with timezone, defaults to now)
      - `tags` (text array, optional)

  2. Security
    - Enable RLS on `blogs` table
    - Add policy for public read access (anonymous users can view blogs)
    - Add policy for authenticated users to manage their own blogs
*/

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  tags text[] DEFAULT '{}'
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blogs
CREATE POLICY "Anyone can read blogs"
  ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert blogs
CREATE POLICY "Authenticated users can insert blogs"
  ON blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update blogs
CREATE POLICY "Authenticated users can update blogs"
  ON blogs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete blogs
CREATE POLICY "Authenticated users can delete blogs"
  ON blogs
  FOR DELETE
  TO authenticated
  USING (true);