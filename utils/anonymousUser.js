import User from '../models/userModel.js';

// Cache the anonymous user ID to avoid repeated database queries
let anonymousUserId = null;

// Function to get the Anonymous user ID
export const getAnonymousUserId = async () => {
  try {
    // Return cached ID if available
    if (anonymousUserId) {
      return anonymousUserId;
    }
    
    // Query the database for the anonymous user
    const anonymousUser = await User.findOne({ email: 'anonymous@sukoon.com' });
    if (!anonymousUser) {
      console.error('Anonymous user not found in the database');
      return null;
    }
    
    // Cache the ID for future use
    anonymousUserId = anonymousUser._id;
    return anonymousUserId;
  } catch (error) {
    console.error('Error fetching anonymous user:', error);
    return null;
  }
};
