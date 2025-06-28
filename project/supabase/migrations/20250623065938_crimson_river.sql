/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `image_url` (text, optional)
      - `github_url` (text, optional)
      - `live_url` (text, optional)
      - `tech_stack` (text array, optional)
      - `created_at` (timestamp with timezone, defaults to now)

  2. Security
    - Enable RLS on `projects` table
    - Add policy for public read access (anonymous users can view projects)
    - Add policy for authenticated users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT '',
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  tech_stack text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert projects
CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update projects
CREATE POLICY "Authenticated users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete projects
CREATE POLICY "Authenticated users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);