/*
  # Add cover image support to blogs table

  1. Schema Changes
    - Add `cover_image_url` column to blogs table
    - Set default value to empty string for consistency

  2. Security
    - No changes to RLS policies needed as they already cover all columns
*/

-- Add cover_image_url column to blogs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE blogs ADD COLUMN cover_image_url text DEFAULT '';
  END IF;
END $$;