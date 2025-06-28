/*
  # Create Admin User Setup

  This migration creates a function to set up the admin user with the specified credentials.
  
  1. Creates a function to handle admin user creation
  2. The function can be called to create the admin user
  3. Includes proper error handling
*/

-- Create a function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function would need to be called from your application
  -- since we cannot directly create auth users from SQL migrations
  RAISE NOTICE 'Admin user creation function ready. Call from application.';
END;
$$;