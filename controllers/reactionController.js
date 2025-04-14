import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";
import Reaction from "../models/reactionModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import mongoose from "mongoose";
import { io } from "../server.js";

// React to content
export const reactToContent = async (req, res) => {
  const { userId } = req.user;
  const { contentType, contentId } = req.params;
  const { type } = req.body;

  // Validate reaction type
  const validReactionTypes = [
    "like",
    "heart",
    "haha",
    "wow",
    "support",
    "relate",
    "agree",
    "sad",
    "angry",
    "insightful"
  ];

  if (!validReactionTypes.includes(type)) {
    throw new BadRequestError("Invalid reaction type");
  }

  try {
    // Check if user has already reacted to this content
    const existingReaction = await Reaction.findOne({
      contentId,
      contentType,
      user: userId,
    });

    if (existingReaction) {
      // If same reaction type, remove it (toggle off)
      if (existingReaction.type === type) {
        await Reaction.findByIdAndDelete(existingReaction._id);

        // Get updated reaction counts
        const reactionCounts = await getReactionCounts(contentId, contentType);

        return res.status(StatusCodes.OK).json({
          message: "Reaction removed",
          reactionCounts,
          userReaction: null
        });
      }

      // If different reaction type, update it
      existingReaction.type = type;
      await existingReaction.save();

      // Get updated reaction counts
      const reactionCounts = await getReactionCounts(contentId, contentType);

      return res.status(StatusCodes.OK).json({
        message: "Reaction updated",
        reactionCounts,
        userReaction: existingReaction.type
      });
    }

    try {
      // Create new reaction
      const reaction = await Reaction.create({
        contentId,
        contentType,
        user: userId,
        type,
      });

      // Get updated reaction counts
      const reactionCounts = await getReactionCounts(contentId, contentType);

      // Create notification for the content owner (if not reacting to own content)
      await createReactionNotification(contentType, contentId, userId, type, req.user.username);

      res.status(StatusCodes.CREATED).json({
        message: "Reaction added",
        reactionCounts,
        userReaction: reaction.type
      });
    } catch (createError) {
      // Handle duplicate key error (race condition where reaction was created between our check and create)
      if (createError.code === 11000) {
        // Try to find the reaction again
        const reaction = await Reaction.findOne({
          contentId,
          contentType,
          user: userId,
        });

        if (reaction) {
          // Update the existing reaction
          reaction.type = type;
          await reaction.save();

          // Get updated reaction counts
          const reactionCounts = await getReactionCounts(contentId, contentType);

          return res.status(StatusCodes.OK).json({
            message: "Reaction updated",
            reactionCounts,
            userReaction: reaction.type
          });
        }
      }

      // If it's not a duplicate key error or we couldn't find the reaction, rethrow
      throw createError;
    }
  } catch (error) {
    console.error("Error in reactToContent:", error);
    throw error;
  }
};

// Get reactions for content
export const getContentReactions = async (req, res) => {
  const { contentType, contentId } = req.params;
  const { userId } = req.user || {};

  try {
    // Get reaction counts
    const reactionCounts = await getReactionCounts(contentId, contentType);

    // Get user's reaction if logged in
    let userReaction = null;
    if (userId) {
      const reaction = await Reaction.findOne({
        contentId,
        contentType,
        user: userId
      });

      if (reaction) {
        userReaction = reaction.type;
      }
    }

    res.status(StatusCodes.OK).json({
      reactionCounts,
      userReaction
    });
  } catch (error) {
    console.error("Error in getContentReactions:", error);
    throw error;
  }
};

// Get users who reacted to content
export const getUsersWhoReacted = async (req, res) => {
  const { contentType, contentId } = req.params;
  const { type } = req.query;

  try {
    let query = { contentId, contentType };

    // If reaction type is specified, filter by it
    if (type && type !== 'all') {
      query.type = type;
    }

    // Find reactions and populate user details
    const reactions = await Reaction.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    // Format the response
    const users = reactions.map(reaction => ({
      _id: reaction.user._id,
      name: reaction.user.name,
      avatar: reaction.user.avatar,
      reactionType: reaction.type,
      reactionTime: reaction.createdAt
    }));

    res.status(StatusCodes.OK).json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error("Error in getUsersWhoReacted:", error);
    throw error;
  }
};

// Helper function to get reaction counts
async function getReactionCounts(contentId, contentType) {
  const reactions = await Reaction.find({ contentId, contentType });

  const counts = {
    like: 0,
    heart: 0,
    haha: 0,
    wow: 0,
    support: 0,
    relate: 0,
    agree: 0,
    sad: 0,
    angry: 0,
    insightful: 0,
    total: reactions.length
  };

  reactions.forEach(reaction => {
    counts[reaction.type]++;
  });

  // Ensure total is always set correctly
  counts.total = reactions.length;

  return counts;
}

// Helper function to create a notification for a reaction
async function createReactionNotification(contentType, contentId, userId, reactionType, username) {
  try {
    // Get the content owner based on content type
    let contentOwnerId;
    let notificationType = 'reaction'; // Default generic type
    let contentField = {};
    let message = `${username} reacted to your content with ${reactionType}`;

    // Determine content owner and notification type based on content type
    switch (contentType) {
      case 'post':
        const Post = mongoose.model('Post');
        const post = await Post.findById(contentId);
        if (!post || post.createdBy.toString() === userId) return; // Don't notify self
        contentOwnerId = post.createdBy;
        notificationType = 'reaction';
        contentField = { postId: contentId };
        message = `${username} reacted with ${reactionType} to your post`;
        break;

      case 'comment':
        const Comment = mongoose.model('Comment');
        const comment = await Comment.findById(contentId);
        if (!comment || comment.createdBy.toString() === userId) return;
        contentOwnerId = comment.createdBy;
        notificationType = 'commentReaction';
        contentField = { postCommentId: contentId, postId: comment.postId };
        message = `${username} reacted with ${reactionType} to your comment`;
        break;

      case 'reply':
        const Reply = mongoose.model('Reply');
        const reply = await Reply.findById(contentId);
        if (!reply || reply.createdBy.toString() === userId) return;
        contentOwnerId = reply.createdBy;
        notificationType = 'replyReaction';
        contentField = { postReplyId: contentId, postId: reply.postId };
        message = `${username} reacted with ${reactionType} to your reply`;
        break;

      case 'article':
        const Article = mongoose.model('Article');
        const article = await Article.findById(contentId);
        if (!article || article.createdBy.toString() === userId) return;
        contentOwnerId = article.createdBy;
        notificationType = 'articleReaction';
        contentField = { articleId: contentId };
        message = `${username} reacted with ${reactionType} to your article`;
        break;

      case 'articleComment':
        const ArticleComment = mongoose.model('ArticleComment');
        const articleComment = await ArticleComment.findById(contentId);
        if (!articleComment || articleComment.createdBy.toString() === userId) return;
        contentOwnerId = articleComment.createdBy;
        notificationType = 'commentReaction';
        contentField = { articleCommentId: contentId, articleId: articleComment.articleId };
        message = `${username} reacted with ${reactionType} to your comment`;
        break;

      case 'articleReply':
        const ArticleReply = mongoose.model('ArticleReply');
        const articleReply = await ArticleReply.findById(contentId);
        if (!articleReply || articleReply.createdBy.toString() === userId) return;
        contentOwnerId = articleReply.createdBy;
        notificationType = 'replyReaction';
        contentField = { articleReplyId: contentId, articleId: articleReply.articleId };
        message = `${username} reacted with ${reactionType} to your reply`;
        break;

      case 'video':
        const Video = mongoose.model('Video');
        const video = await Video.findById(contentId);
        if (!video || video.author.toString() === userId) return;
        contentOwnerId = video.author;
        notificationType = 'videoReaction';
        contentField = { videoId: contentId };
        message = `${username} reacted with ${reactionType} to your video`;
        break;

      case 'answer':
        const Answer = mongoose.model('Answer');
        const answer = await Answer.findById(contentId);
        if (!answer || answer.createdBy.toString() === userId) return;
        contentOwnerId = answer.createdBy;
        notificationType = 'answerReaction';
        contentField = { answerId: contentId, questionId: answer.questionId };
        message = `${username} reacted with ${reactionType} to your answer`;
        break;

      case 'personalStory':
        const PersonalStory = mongoose.model('PersonalStory');
        const story = await PersonalStory.findById(contentId);
        if (!story || story.createdBy.toString() === userId) return;
        contentOwnerId = story.createdBy;
        notificationType = 'personalStoryReaction';
        contentField = { personalStoryId: contentId };
        message = `${username} reacted with ${reactionType} to your story`;
        break;

      default:
        return; // Unknown content type, don't create notification
    }

    // Check if a similar notification already exists (to prevent duplicates)
    const notificationExists = await Notification.findOne({
      userId: contentOwnerId,
      createdBy: userId,
      type: notificationType,
      ...contentField
    });

    if (notificationExists) {
      // Update existing notification instead of creating a new one
      notificationExists.message = message;
      await notificationExists.save();
      io.to(contentOwnerId.toString()).emit('newNotification', notificationExists);
      return;
    }

    // Create new notification
    const notification = new Notification({
      userId: contentOwnerId,
      createdBy: userId,
      type: notificationType,
      message,
      ...contentField
    });

    await notification.save();
    io.to(contentOwnerId.toString()).emit('newNotification', notification);
  } catch (error) {
    console.error('Error creating reaction notification:', error);
    // Don't throw the error - we don't want to fail the reaction if notification fails
  }
}
