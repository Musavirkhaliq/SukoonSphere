import PersonalStory from "../models/personalStoryModel.js";
import PersonalStoryComment from "../models/personalStoryCommentModel.js";
import PersonalStoryReply from "../models/personalStoryReplyModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js";
import { getAnonymousUserId } from "../utils/anonymousUser.js";
import { updateUserPoints, awardBadges } from "../utils/userProgress.js";

// Create comment
export const createPersonalStoryComment = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { content, isAnonymous } = req.body;
    const userId = req.user.userId;

    // Convert isAnonymous from string to boolean if needed
    const isAnonymousValue = typeof isAnonymous === 'string'
      ? isAnonymous === 'true'
      : Boolean(isAnonymous);

    const story = await PersonalStory.findById(storyId);
    if (!story) {
      throw new BadRequestError("Personal story not found");
    }

    // Create comment data
    const commentData = {
      storyUserId: story.isAnonymous ? story.realCreator : story.author,
      storyId,
      content,
      isAnonymous: isAnonymousValue
    };

    // If comment is anonymous, use the Anonymous user ID as the creator
    if (isAnonymousValue) {
      const anonymousUserId = await getAnonymousUserId();
      if (!anonymousUserId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: 'Failed to create anonymous comment'
        });
      }
      commentData.createdBy = anonymousUserId;
      // Store the real user ID in a separate field for tracking purposes
      commentData.realCreator = userId;
    } else {
      // For non-anonymous comments, use the actual user ID
      commentData.createdBy = userId;
    }

    const comment = await PersonalStoryComment.create(commentData);

    // Add comment to story's comments array
    story.comments.push(comment._id);
    await story.save();

    // Create notification if the comment is not by the story author
    if (!isAnonymousValue && userId !== story.author.toString() && !story.isAnonymous) {
      const notification = new Notification({
        userId: story.author,
        createdBy: userId,
        storyId: storyId,
        type: 'storyComment',
        message: `${req.user.username} commented on your personal story`,
      });
      await notification.save();

      io.to(story.author.toString()).emit('newNotification', notification);
    }

    // Update user points and badges
    await updateUserPoints(userId, "comment");
    const earnedBadges = await awardBadges(userId, "comment");

    res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    console.error("Error in createPersonalStoryComment:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create comment",
    });
  }
};

// Get all comments for a story
export const getAllCommentsByStoryId = async (req, res) => {
  try {
    const { storyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total comments
    const totalComments = await PersonalStoryComment.countDocuments({
      storyId,
      deleted: { $ne: true },
    });

    // Fetch comments with pagination
    const comments = await PersonalStoryComment.aggregate([
      { $match: { storyId: new mongoose.Types.ObjectId(storyId), deleted: { $ne: true } } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          username: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$userDetails.name", 0] }
            ]
          },
          userAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$userDetails.avatar", 0] }
            ]
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalReplies: { $size: { $ifNull: ["$replies", []] } },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "personalstoryreplies",
          localField: "replies",
          foreignField: "_id",
          as: "repliesData",
          pipeline: [
            { $match: { deleted: { $ne: true } } },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "replyTo",
                foreignField: "_id",
                as: "replyToDetails",
              },
            },
            {
              $addFields: {
                username: {
                  $cond: [
                    "$isAnonymous",
                    "Anonymous",
                    { $arrayElemAt: ["$userDetails.name", 0] }
                  ]
                },
                userAvatar: {
                  $cond: [
                    "$isAnonymous",
                    null,
                    { $arrayElemAt: ["$userDetails.avatar", 0] }
                  ]
                },
                replyToUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
                totalLikes: { $size: { $ifNull: ["$likes", []] } },
              },
            },
            { $sort: { createdAt: 1 } },
            {
              $project: {
                userDetails: 0,
                replyToDetails: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          replies: "$repliesData",
        },
      },
      {
        $project: {
          userDetails: 0,
          repliesData: 0,
        },
      },
    ]);

    const totalPages = Math.ceil(totalComments / limit);

    res.status(StatusCodes.OK).json({
      comments,
      currentPage: page,
      totalPages,
      totalComments,
    });
  } catch (error) {
    console.error("Error in getAllCommentsByStoryId:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch comments",
    });
  }
};

// Create reply to a comment
export const createPersonalStoryReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, replyToUserId, isAnonymous } = req.body;
    const userId = req.user.userId;

    // Convert isAnonymous from string to boolean if needed
    const isAnonymousValue = typeof isAnonymous === 'string'
      ? isAnonymous === 'true'
      : Boolean(isAnonymous);

    const comment = await PersonalStoryComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    // Create reply data
    const replyData = {
      commentId,
      content,
      replyTo: replyToUserId || comment.createdBy,
      isAnonymous: isAnonymousValue
    };

    // If reply is anonymous, use the Anonymous user ID as the creator
    if (isAnonymousValue) {
      const anonymousUserId = await getAnonymousUserId();
      if (!anonymousUserId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          msg: 'Failed to create anonymous reply'
        });
      }
      replyData.createdBy = anonymousUserId;
      // Store the real user ID in a separate field for tracking purposes
      replyData.realCreator = userId;
    } else {
      // For non-anonymous replies, use the actual user ID
      replyData.createdBy = userId;
    }

    const reply = await PersonalStoryReply.create(replyData);

    // Add reply to comment's replies array
    comment.replies.push(reply._id);
    await comment.save();

    // Create notification if the reply is not by the comment author
    if (!isAnonymousValue && userId !== comment.createdBy.toString() && !comment.isAnonymous) {
      const notification = new Notification({
        userId: comment.createdBy,
        createdBy: userId,
        storyId: comment.storyId,
        commentId: commentId,
        type: 'storyCommentReply',
        message: `${req.user.username} replied to your comment`,
      });
      await notification.save();

      io.to(comment.createdBy.toString()).emit('newNotification', notification);
    }

    // Update user points and badges
    await updateUserPoints(userId, "reply");
    const earnedBadges = await awardBadges(userId, "reply");

    res.status(StatusCodes.CREATED).json({ reply });
  } catch (error) {
    console.error("Error in createPersonalStoryReply:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create reply",
    });
  }
};

// Get all replies for a comment
export const getAllRepliesByCommentId = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total replies
    const totalReplies = await PersonalStoryReply.countDocuments({
      commentId,
      deleted: { $ne: true },
    });

    // Fetch replies with pagination
    const replies = await PersonalStoryReply.aggregate([
      { $match: { commentId: new mongoose.Types.ObjectId(commentId), deleted: { $ne: true } } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "replyTo",
          foreignField: "_id",
          as: "replyToDetails",
        },
      },
      {
        $addFields: {
          username: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$userDetails.name", 0] }
            ]
          },
          userAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$userDetails.avatar", 0] }
            ]
          },
          replyToUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          userDetails: 0,
          replyToDetails: 0,
        },
      },
    ]);

    const totalPages = Math.ceil(totalReplies / limit);

    res.status(StatusCodes.OK).json({
      replies,
      currentPage: page,
      totalPages,
      totalReplies,
    });
  } catch (error) {
    console.error("Error in getAllRepliesByCommentId:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch replies",
    });
  }
};

// Delete comment
export const deletePersonalStoryComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await PersonalStoryComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    // Check if user is authorized to delete this comment
    const isAuthorized =
      (comment.createdBy.toString() === userId) ||
      (comment.isAnonymous && comment.realCreator && comment.realCreator.toString() === userId);

    if (!isAuthorized) {
      throw new UnauthorizedError("Not authorized to delete this comment");
    }

    // Soft delete the comment
    comment.deleted = true;
    await comment.save();

    // Delete notification if exists
    const notification = await Notification.findOne({
      userId: comment.storyUserId,
      createdBy: userId,
      storyId: comment.storyId,
      type: 'storyComment',
    });

    if (notification) {
      await notification.deleteOne();
    }

    res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deletePersonalStoryComment:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete comment",
    });
  }
};

// Delete reply
export const deletePersonalStoryReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.userId;

    const reply = await PersonalStoryReply.findById(replyId);
    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    // Check if user is authorized to delete this reply
    const isAuthorized =
      (reply.createdBy.toString() === userId) ||
      (reply.isAnonymous && reply.realCreator && reply.realCreator.toString() === userId);

    if (!isAuthorized) {
      throw new UnauthorizedError("Not authorized to delete this reply");
    }

    // Soft delete the reply
    reply.deleted = true;
    await reply.save();

    // Delete notification if exists
    const comment = await PersonalStoryComment.findById(reply.commentId);
    if (comment) {
      const notification = await Notification.findOne({
        userId: comment.createdBy,
        createdBy: userId,
        commentId: reply.commentId,
        type: 'storyCommentReply',
      });

      if (notification) {
        await notification.deleteOne();
      }
    }

    res.status(StatusCodes.OK).json({ msg: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error in deletePersonalStoryReply:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete reply",
    });
  }
};

// Like comment
export const likePersonalStoryComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await PersonalStoryComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    // Check if user has already liked the comment
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the comment
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the comment
      comment.likes.push(userId);

      // Create notification if the comment is not by the current user
      if (!comment.isAnonymous && userId !== comment.createdBy.toString()) {
        const notification = new Notification({
          userId: comment.createdBy,
          createdBy: userId,
          storyId: comment.storyId,
          commentId: commentId,
          type: 'storyCommentLike',
          message: `${req.user.username} liked your comment`,
        });
        await notification.save();

        io.to(comment.createdBy.toString()).emit('newNotification', notification);
      }

      // Update user points and badges
      await updateUserPoints(userId, "like");
      const earnedBadges = await awardBadges(userId, "like");
    }

    await comment.save();

    res.status(StatusCodes.OK).json({
      msg: alreadyLiked ? "Comment unliked" : "Comment liked",
      likes: comment.likes,
    });
  } catch (error) {
    console.error("Error in likePersonalStoryComment:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to like/unlike comment",
    });
  }
};

// Like reply
export const likePersonalStoryReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.userId;

    const reply = await PersonalStoryReply.findById(replyId);
    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    // Check if user has already liked the reply
    const alreadyLiked = reply.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the reply
      reply.likes = reply.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the reply
      reply.likes.push(userId);

      // Create notification if the reply is not by the current user
      if (!reply.isAnonymous && userId !== reply.createdBy.toString()) {
        const notification = new Notification({
          userId: reply.createdBy,
          createdBy: userId,
          commentId: reply.commentId,
          type: 'storyReplyLike',
          message: `${req.user.username} liked your reply`,
        });
        await notification.save();

        io.to(reply.createdBy.toString()).emit('newNotification', notification);
      }

      // Update user points and badges
      await updateUserPoints(userId, "like");
      const earnedBadges = await awardBadges(userId, "like");
    }

    await reply.save();

    res.status(StatusCodes.OK).json({
      msg: alreadyLiked ? "Reply unliked" : "Reply liked",
      likes: reply.likes,
    });
  } catch (error) {
    console.error("Error in likePersonalStoryReply:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to like/unlike reply",
    });
  }
};

// Update comment
export const updatePersonalStoryComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const comment = await PersonalStoryComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    // Check if user is authorized to update this comment
    const isAuthorized =
      (comment.createdBy.toString() === userId) ||
      (comment.isAnonymous && comment.realCreator && comment.realCreator.toString() === userId);

    if (!isAuthorized) {
      throw new UnauthorizedError("Not authorized to update this comment");
    }

    comment.content = content;
    comment.editedAt = new Date();
    await comment.save();

    res.status(StatusCodes.OK).json({ comment });
  } catch (error) {
    console.error("Error in updatePersonalStoryComment:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update comment",
    });
  }
};

// Update reply
export const updatePersonalStoryReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const reply = await PersonalStoryReply.findById(replyId);
    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    // Check if user is authorized to update this reply
    const isAuthorized =
      (reply.createdBy.toString() === userId) ||
      (reply.isAnonymous && reply.realCreator && reply.realCreator.toString() === userId);

    if (!isAuthorized) {
      throw new UnauthorizedError("Not authorized to update this reply");
    }

    reply.content = content;
    reply.editedAt = new Date();
    await reply.save();

    res.status(StatusCodes.OK).json({ reply });
  } catch (error) {
    console.error("Error in updatePersonalStoryReply:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update reply",
    });
  }
};
