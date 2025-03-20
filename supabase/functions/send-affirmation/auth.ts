
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
    
    // Verify the user is an admin
    console.log('Checking admin status for user:', user.id);
    
    // Debug: Let's print out what we're querying
    console.log(`Querying profiles table for id = ${user.id}`);
    
    // First, check if the profile exists at all
    const { data: allProfiles, error: countError } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', user.id);
      
    if (countError) {
      console.error('Error fetching profiles:', countError);
      throw new Error(`Database error: ${countError.message}`);
    }
    
    console.log('Profiles matching user ID:', allProfiles);
    
    if (!allProfiles || allProfiles.length === 0) {
      console.error('No profile found for user in database:', user.id);
      throw new Error(`User profile not found in database for ID: ${user.id}`);
    }
    
    // Now get the specific profile with maybeSingle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error('Profile check error:', profileError);
      throw new Error(`Profile check error: ${profileError.message}`);
    }
    
    // Check if profile exists and if user is admin or sending to self
    if (!profile) {
      console.error('No profile found for user after maybeSingle:', user.id);
      throw new Error(`User profile not found after maybeSingle for ID: ${user.id}`);
    }
    
    const isAdmin = profile.is_admin || false;
    return { userId: user.id, isAdmin };
  } catch (error) {
    console.error('Error in verifyAdminUser:', error);
    throw error;
  }
}
