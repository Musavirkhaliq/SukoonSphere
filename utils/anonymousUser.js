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
    let anonymousUser = await User.findOne({ email: 'anonymous@sukoon.com' });
    
    // If user doesn't exist, create it
    if (!anonymousUser) {
      anonymousUser = await User.create({
        name: 'Anonymous',
        email: 'anonymous@sukoon.com',
        password: 'anonymous', // This won't be used for login
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created anonymous user');
    }
    
    // Cache the ID for future use
    anonymousUserId = anonymousUser._id;
    return anonymousUserId;
  } catch (error) {
    console.error('Error fetching/creating anonymous user:', error);
    throw error;
  }
};
