
// Verify JWT and get user from it
export async function verifyJwtAndGetUser(jwt: string, supabase: any) {
  try {
    console.log('Verifying JWT and getting user...');
    
    // Verify the JWT
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    
    if (error) {
      console.error('JWT verification error:', error);
      throw new Error(`Authentication error: ${error.message}`);
    }
    
    if (!user) {
      console.error('No user found from JWT');
      throw new Error('Unauthorized: No user found');
    }
    
    console.log('User authenticated from JWT:', user.id);
    
    return user;
  } catch (error) {
    console.error('Error in verifyJwtAndGetUser:', error);
    throw error;
  }
}

// Verify admin user (and get the user ID)
export async function verifyAdminUser(jwt: string, supabase: any) {
  try {
    // Get user from JWT
    const user = await verifyJwtAndGetUser(jwt, supabase);
    
    // Check for whitespace and trim if necessary
    const originalId = user.id;
    const trimmedId = originalId.trim();
    if (trimmedId !== originalId) {
      console.log('Whitespace detected in user ID, trimmed from:', originalId, 'to:', trimmedId);
      user.id = trimmedId;
    }
    
    // Debug: Log ID format details and check for special characters
    console.log(`User ID (${typeof user.id}):`, user.id);
    console.log('User ID length:', user.id.length);
    console.log('User ID as JSON:', JSON.stringify(user.id));
    
    // Log the exact query we're about to make
    console.log(`Running query: SELECT is_admin FROM profiles WHERE id = '${user.id}'`);
    
    // Now get the profile with the admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new Error(`Profile check error: ${profileError.message}`);
    }
    
    // Check if profile exists
    if (!profile) {
      console.error(`No profile found for user ID: ${user.id}`);
      throw new Error(`User profile not found in database for ID: ${user.id}`);
    }
    
    const isAdmin = profile.is_admin || false;
    console.log('User admin status:', isAdmin);
    
    return { userId: user.id, isAdmin };
  } catch (error) {
    console.error('Error in verifyAdminUser:', error);
    throw error;
  }
}
