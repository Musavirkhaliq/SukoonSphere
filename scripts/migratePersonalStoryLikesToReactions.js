import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PersonalStory from '../models/personalStoryModel.js';
import PersonalStoryComment from '../models/personalStoryCommentModel.js';
import PersonalStoryReply from '../models/personalStoryReplyModel.js';
import Reaction from '../models/reactionModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Function to migrate likes to reactions
const migrateLikes = async () => {
  try {
    console.log('Starting migration of personal story likes to reactions...');
    
    // 1. Migrate personal story likes
    const stories = await PersonalStory.find({ likes: { $exists: true, $ne: [] } });
    console.log(`Found ${stories.length} personal stories with likes`);
    
    let storyReactionsCreated = 0;
    
    for (const story of stories) {
      for (const userId of story.likes) {
        try {
          // Check if reaction already exists
          const existingReaction = await Reaction.findOne({
            contentId: story._id,
            contentType: 'personalStory',
            user: userId
          });
          
          if (!existingReaction) {
            // Create new reaction
            await Reaction.create({
              contentId: story._id,
              contentType: 'personalStory',
              user: userId,
              type: 'like'
            });
            storyReactionsCreated++;
          }
        } catch (error) {
          console.error(`Error creating reaction for story ${story._id} and user ${userId}:`, error);
        }
      }
    }
    
    console.log(`Created ${storyReactionsCreated} reactions for personal stories`);
    
    // 2. Migrate personal story comment likes
    const comments = await PersonalStoryComment.find({ likes: { $exists: true, $ne: [] } });
    console.log(`Found ${comments.length} personal story comments with likes`);
    
    let commentReactionsCreated = 0;
    
    for (const comment of comments) {
      for (const userId of comment.likes) {
        try {
          // Check if reaction already exists
          const existingReaction = await Reaction.findOne({
            contentId: comment._id,
            contentType: 'personalStoryComment',
            user: userId
          });
          
          if (!existingReaction) {
            // Create new reaction
            await Reaction.create({
              contentId: comment._id,
              contentType: 'personalStoryComment',
              user: userId,
              type: 'like'
            });
            commentReactionsCreated++;
          }
        } catch (error) {
          console.error(`Error creating reaction for comment ${comment._id} and user ${userId}:`, error);
        }
      }
    }
    
    console.log(`Created ${commentReactionsCreated} reactions for personal story comments`);
    
    // 3. Migrate personal story reply likes
    const replies = await PersonalStoryReply.find({ likes: { $exists: true, $ne: [] } });
    console.log(`Found ${replies.length} personal story replies with likes`);
    
    let replyReactionsCreated = 0;
    
    for (const reply of replies) {
      for (const userId of reply.likes) {
        try {
          // Check if reaction already exists
          const existingReaction = await Reaction.findOne({
            contentId: reply._id,
            contentType: 'personalStoryReply',
            user: userId
          });
          
          if (!existingReaction) {
            // Create new reaction
            await Reaction.create({
              contentId: reply._id,
              contentType: 'personalStoryReply',
              user: userId,
              type: 'like'
            });
            replyReactionsCreated++;
          }
        } catch (error) {
          console.error(`Error creating reaction for reply ${reply._id} and user ${userId}:`, error);
        }
      }
    }
    
    console.log(`Created ${replyReactionsCreated} reactions for personal story replies`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the migration
migrateLikes();
