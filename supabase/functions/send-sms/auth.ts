
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

// Verify user is an admin
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
    
    // Debug: Log ID format and check for special characters
    console.log(`User ID (${typeof user.id}):`, user.id);
    console.log('User ID length:', user.id.length);
    console.log('User ID as JSON:', JSON.stringify(user.id));
    
    // Log the exact query we're about to make
    console.log(`Running query: SELECT is_admin FROM profiles WHERE id = '${user.id}'`);
    
    // Get the specific profile with single
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new Error(`Profile check error: ${profileError.message}`);
    }
    
    // Check if profile exists and is admin
    if (!profile) {
      console.error('No profile found for user:', user.id);
      throw new Error(`User profile not found for ID: ${user.id}`);
    }
    
    if (!profile.is_admin) {
      console.error('User not admin:', user.id);
      throw new Error('Only administrators can send test messages');
    }
    
    console.log('Admin status verified for user:', user.id);
    return user.id;
  } catch (error) {
    console.error('Error in verifyAdminUser:', error);
    throw error;
  }
}
