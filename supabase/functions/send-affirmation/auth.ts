
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
    
    // Debug: Print user ID being checked
    console.log('Checking admin status for user:', user.id);
    
    // First, check RLS permissions by trying a simple query
    console.log('Testing database permissions on profiles table...');
    const { data: testAccess, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database permission test failed:', testError);
      if (testError.message.includes('permission denied')) {
        throw new Error(`RLS permission error: The Supabase client doesn't have permission to read from the profiles table. Error: ${testError.message}`);
      }
    } else {
      console.log('Database permission test passed, client can access profiles table');
    }
    
    // First, check if the profile exists at all with a simple query to log information
    const { data: profileExists, error: existsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id);
    
    if (existsError) {
      console.error('Error checking if profile exists:', existsError);
    } else {
      console.log('Profile query results:', profileExists);
    }
    
    // Now get the profile with the admin status
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
      console.error(`No profile found for user ID: ${user.id}`);
      
      // Try to retrieve raw profile data to debug
      const { data: rawProfiles } = await supabase
        .from('profiles')
        .select('*');
      
      console.log('Available profiles in database:', rawProfiles);
      
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
