/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `image_url` (text, optional with default)
      - `github_url` (text, optional with default)
      - `live_url` (text, optional with default)
      - `tech_stack` (text array, optional with default)
      - `created_at` (timestamp with timezone, auto-generated)
  2. Security
    - Enable RLS on `projects` table
    - Add policies for public read access and authenticated user write access
*/

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT ''::text,
  github_url text DEFAULT ''::text,
  live_url text DEFAULT ''::text,
  tech_stack text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

-- Create policies
CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);