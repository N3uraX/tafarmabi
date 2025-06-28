import { supabaseAdmin } from '../lib/supabaseAdmin';

/**
 * Creates the admin user with the specified credentials
 * This should be run once to set up the admin account
 */
export const createAdminUser = async () => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'greetmeasap@gmail.com',
      password: '$Gr33t-me@sap',
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);
    return { success: true, user: data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

// Utility function to check if admin user exists
export const checkAdminUserExists = async () => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error checking users:', error);
      return false;
    }

    const adminExists = data.users.some(user => user.email === 'greetmeasap@gmail.com');
    return adminExists;
  } catch (error) {
    console.error('Error checking admin user:', error);
    return false;
  }
};