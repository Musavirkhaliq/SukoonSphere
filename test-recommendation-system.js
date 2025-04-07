import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserActivity from './models/analytics/userActivityModel.js';
import UserPreference from './models/analytics/userPreferenceModel.js';
import Recommendation from './models/analytics/recommendationModel.js';
import User from './models/userModel.js';
import Post from './models/postModel.js';

dotenv.config();

// Test script to verify the recommendation system
async function testRecommendationSystem() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB successfully');

    // Get a test user
    const testUser = await User.findOne({ role: 'user' });
    if (!testUser) {
      console.error('No test user found');
      return;
    }
    console.log(`Using test user: ${testUser.name} (${testUser._id})`);

    // Get some test content
    const testPosts = await Post.find().limit(5);
    if (testPosts.length === 0) {
      console.error('No test posts found');
      return;
    }
    console.log(`Found ${testPosts.length} test posts`);

    // 1. Test logging user activity
    console.log('\n1. Testing activity logging...');
    for (const post of testPosts) {
      await UserActivity.logActivity(
        testUser._id,
        'view',
        'post',
        post._id,
        'Post',
        {
          tags: post.tags || [],
          referrer: 'test',
          device: 'desktop'
        }
      );
      console.log(`Logged view activity for post: ${post._id}`);
    }

    // Log a like activity
    await UserActivity.logActivity(
      testUser._id,
      'like',
      'post',
      testPosts[0]._id,
      'Post'
    );
    console.log(`Logged like activity for post: ${testPosts[0]._id}`);

    // 2. Test updating user preferences
    console.log('\n2. Testing preference updates...');
    for (const post of testPosts) {
      await UserPreference.updatePreferences(testUser._id, {
        activityType: 'view',
        contentType: 'post',
        contentId: post._id,
        creatorId: post.createdBy,
        metadata: {
          tags: post.tags || [],
          timeSpent: 60 // 1 minute
        }
      });
      console.log(`Updated preferences for post: ${post._id}`);
    }

    // 3. Test generating recommendations
    console.log('\n3. Testing recommendation generation...');
    await Recommendation.generateRecommendations(testUser._id);
    console.log('Generated recommendations');

    // 4. Test retrieving recommendations
    console.log('\n4. Testing recommendation retrieval...');
    const recommendations = await Recommendation.getUserRecommendations(testUser._id, null, 10);
    console.log(`Retrieved ${recommendations.length} recommendations`);
    
    if (recommendations.length > 0) {
      console.log('Sample recommendation:');
      console.log(JSON.stringify(recommendations[0], null, 2));
    }

    // 5. Test marking a recommendation as clicked
    if (recommendations.length > 0) {
      console.log('\n5. Testing recommendation click tracking...');
      await Recommendation.markRecommendationClicked(testUser._id, recommendations[0]._id);
      console.log(`Marked recommendation ${recommendations[0]._id} as clicked`);
    }

    // 6. Test getting popular content
    console.log('\n6. Testing popular content retrieval...');
    const popularContent = await UserActivity.getPopularContent('view', 'post', 7, 5);
    console.log(`Retrieved ${popularContent.length} popular posts`);

    // 7. Test getting user preferences
    console.log('\n7. Testing user preference retrieval...');
    const preferences = await UserPreference.getTopPreferences(testUser._id);
    console.log('User preferences:');
    console.log(JSON.stringify(preferences, null, 2));

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testRecommendationSystem();
