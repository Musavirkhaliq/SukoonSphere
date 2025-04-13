import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/postModel.js';
import Comment from '../models/postCommentsModel.js';
import Reply from '../models/postReplyModel.js';
import Article from '../models/articles/articleModel.js';
import ArticleComment from '../models/articles/articleCommentsModel.js';
import ArticleReply from '../models/articles/articleReplyModel.js';
import Video from '../models/videos/videoModel.js';
import VideoComment from '../models/videos/videoCommentModel.js';
import VideoReply from '../models/videos/videoReplyModel.js';
import Answer from '../models/qaSection/answerModel.js';
import AnswerComment from '../models/qaSection/answerCommentModel.js';
import AnswerReply from '../models/qaSection/answerReplyModel.js';
import PersonalStory from '../models/personalStoryModel.js';
import PersonalStoryComment from '../models/personalStoryCommentModel.js';
import PersonalStoryReply from '../models/personalStoryReplyModel.js';
import Reaction from '../models/reactionModel.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to migrate likes from a model to reactions
async function migrateLikes(model, contentType) {
  console.log(`Migrating likes for ${contentType}...`);

  try {
    // Get all documents with likes
    const documents = await model.find({ likes: { $exists: true, $ne: [] } });
    console.log(`Found ${documents.length} ${contentType} with likes`);

    let migratedCount = 0;

    // Process each document
    for (const doc of documents) {
      // For each user who liked the document
      for (const userId of doc.likes) {
        try {
          // Create a reaction
          await Reaction.create({
            contentId: doc._id,
            contentType,
            user: userId,
            type: 'like'
          });
          migratedCount++;
        } catch (error) {
          // Skip duplicates (if a reaction already exists)
          if (error.code !== 11000) {
            console.error(`Error creating reaction for ${contentType} ${doc._id} by user ${userId}:`, error);
          }
        }
      }
    }

    console.log(`Successfully migrated ${migratedCount} likes for ${contentType}`);
  } catch (error) {
    console.error(`Error migrating likes for ${contentType}:`, error);
  }
}

// Main migration function
async function migrateAllLikes() {
  try {
    // Migrate likes for all content types
    await migrateLikes(Post, 'post');
    await migrateLikes(Comment, 'comment');
    await migrateLikes(Reply, 'reply');
    await migrateLikes(Article, 'article');
    await migrateLikes(ArticleComment, 'articleComment');
    await migrateLikes(ArticleReply, 'articleReply');
    await migrateLikes(Video, 'video');
    await migrateLikes(VideoComment, 'videoComment');
    await migrateLikes(VideoReply, 'videoReply');
    await migrateLikes(Answer, 'answer');
    await migrateLikes(AnswerComment, 'answerComment');
    await migrateLikes(AnswerReply, 'answerReply');
    await migrateLikes(PersonalStory, 'personalStory');
    await migrateLikes(PersonalStoryComment, 'personalStoryComment');
    await migrateLikes(PersonalStoryReply, 'personalStoryReply');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateAllLikes();
