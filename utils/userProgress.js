import User from '../models/userModel.js';

/**
 * Update user points based on activity type
 * @param {string} userId - The ID of the user
 * @param {string} activityType - The type of activity (post, comment, story, like, reply)
 * @returns {Promise<number>} - The updated points
 */
export const updateUserPoints = async (userId, activityType) => {
  try {
    // Points awarded for different activities
    const pointsMap = {
      post: 10,
      story: 15,
      comment: 5,
      reply: 3,
      like: 1
    };

    // Get points for the activity type, default to 1 if not found
    const pointsToAdd = pointsMap[activityType] || 1;

    // Update user points
    const user = await User.findById(userId);
    if (!user) return 0;

    // Initialize points if not already set
    if (!user.points) user.points = 0;
    
    // Add points
    user.points += pointsToAdd;
    
    // Save user
    await user.save();
    
    return user.points;
  } catch (error) {
    console.error('Error updating user points:', error);
    return 0;
  }
};

/**
 * Award badges to users based on their activities and points
 * @param {string} userId - The ID of the user
 * @param {string} activityType - The type of activity
 * @returns {Promise<Array>} - Array of newly earned badges
 */
export const awardBadges = async (userId, activityType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    // Initialize badges array if not already set
    if (!user.badges) user.badges = [];
    
    // Get current badges
    const currentBadges = new Set(user.badges);
    const newBadges = [];
    
    // Define badge criteria
    const badgeCriteria = {
      // Points-based badges
      'bronze': { points: 50 },
      'silver': { points: 200 },
      'gold': { points: 500 },
      'platinum': { points: 1000 },
      
      // Activity-based badges
      'storyteller': { activityType: 'story', count: 5 },
      'commenter': { activityType: 'comment', count: 10 },
      'contributor': { activityType: 'post', count: 10 },
      'supporter': { activityType: 'like', count: 20 },
    };
    
    // Check for points-based badges
    if (user.points >= badgeCriteria.platinum.points && !currentBadges.has('platinum')) {
      user.badges.push('platinum');
      newBadges.push('platinum');
    } else if (user.points >= badgeCriteria.gold.points && !currentBadges.has('gold')) {
      user.badges.push('gold');
      newBadges.push('gold');
    } else if (user.points >= badgeCriteria.silver.points && !currentBadges.has('silver')) {
      user.badges.push('silver');
      newBadges.push('silver');
    } else if (user.points >= badgeCriteria.bronze.points && !currentBadges.has('bronze')) {
      user.badges.push('bronze');
      newBadges.push('bronze');
    }
    
    // For activity-specific badges, we would need to track counts in the user model
    // This is a simplified implementation
    
    // Save user if any new badges were added
    if (newBadges.length > 0) {
      await user.save();
    }
    
    return newBadges;
  } catch (error) {
    console.error('Error awarding badges:', error);
    return [];
  }
};
