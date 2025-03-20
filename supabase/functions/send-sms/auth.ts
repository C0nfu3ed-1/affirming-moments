
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
    
    // Debug: Print user ID being checked with specific format for debugging
    console.log(`id: ${user.id}`);
    console.log(`user.id: ${user.id}`);
    console.log('User ID type:', typeof user.id);
    
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
    
    // Check if profile exists and is admin
    if (!profile) {
      console.error('No profile found for user after maybeSingle:', user.id);
      throw new Error(`User profile not found after maybeSingle for ID: ${user.id}`);
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
