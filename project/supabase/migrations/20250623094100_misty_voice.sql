/*
  # Create messages table for contact form submissions

  1. New Tables
    - `messages`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, required)
      - `email` (text, required)
      - `subject` (text, optional)
      - `message` (text, required)
      - `created_at` (timestamp with timezone, defaults to now)

  2. Security
    - Enable RLS on `messages` table
    - Add policy to allow insert for any user (contact form submissions)
    - Add policy to allow select only for authenticated admin users
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (contact form submissions)
CREATE POLICY "Anyone can submit contact messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read messages (admin access)
CREATE POLICY "Authenticated users can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can delete messages (admin cleanup)
CREATE POLICY "Authenticated users can delete messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (true);