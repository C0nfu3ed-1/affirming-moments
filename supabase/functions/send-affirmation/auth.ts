
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
    
    // Check if the user ID exists in the database directly
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('id', user.id);
      
    console.log('Profile count for user ID:', count);
    if (countError) {
      console.error('Error checking profile count:', countError);
    }
    
    // Log the exact query we're about to make
    console.log(`Running query: SELECT is_admin FROM profiles WHERE id = '${user.id}'`);
    
    // Now get the profile with the admin status - use maybeSingle instead of single
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new Error(`Profile check error: ${profileError.message}`);
    }
    
    // Check if profile exists
    if (!profile) {
      console.error(`Profile not found for user ID: ${user.id}. Checking if user exists in auth.users table.`);
      
      // Check if the user exists in auth.users to confirm it's a valid user
      console.log(`Attempting to verify the user exists in auth system...`);
      const { user: authUser } = await supabase.auth.getUser(jwt);
      console.log(`Auth verification result:`, authUser ? 'User exists' : 'User not found');
      
      throw new Error(`User profile not found in database for ID: ${user.id}. This likely means the profile record was not properly created during signup.`);
    }
    
    const isAdmin = profile.is_admin || false;
    console.log('User admin status:', isAdmin);
    
    return { userId: user.id, isAdmin };
  } catch (error) {
    console.error('Error in verifyAdminUser:', error);
    throw error;
  }
}
