import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../errors/customErors.js";
import mongoose from "mongoose";
import VideoComment from "../models/videos/videoCommentModel.js";
import VideoReply from "../models/videos/videoReplyModel.js";
import Video from "../models/videos/videoModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js";

// Create a new comment
export const createComment = async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  try {
    if (!content || content.trim() === "") {
      throw new BadRequestError("Comment content is required");
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      throw new NotFoundError("Video not found");
    }

    const comment = await VideoComment.create({
      videoId,
      createdBy: req.user.userId,
      content,
    });

    // Add comment to video
    video.comments.push(comment._id);
    await video.save();

    // Fetch comment with user details for response
    const commentWithUser = await VideoComment.aggregate([
      {
        $match: { _id: comment._id },
      },
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
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    // Create a notification if the user is not commenting on their own video
    if (video.author && video.author.toString() !== req.user.userId) {
      const notification = new Notification({
        userId: video.author, // The user who created the video
        createdBy: req.user.userId,
        videoId: videoId,
        type: "videoComment",
        message: `${req.user.username || 'Someone'} commented on your video`,
      });

      await notification.save();

      io.to(video.author.toString()).emit("newNotification", notification);
    }

    res.status(StatusCodes.CREATED).json({
      message: "Comment created successfully",
      comment: commentWithUser[0],
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create comment" });
  }
};

// Get comments for a video
export const getVideoComments = async (req, res) => {
  const { videoId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Check if video exists
    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
      throw new NotFoundError("Video not found");
    }

    // Get comments with pagination
    const totalComments = await VideoComment.countDocuments({
      videoId,
      deleted: false,
    });

    const totalPages = Math.ceil(totalComments / limit);

    const videoComments = await VideoComment.aggregate([
      {
        $match: { videoId: new mongoose.Types.ObjectId(videoId), deleted: false },
      },
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
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          totalReplies: { $size: { $ifNull: ["$replies", []] } },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      {
        $project: {
          userDetails: 0,
          __v: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    res.status(StatusCodes.OK).json({
      comments: videoComments,
      currentPage: page,
      totalPages,
      totalComments,
    });
  } catch (error) {
    console.error("Error fetching video comments:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch comments" });
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  const { videoId } = req.body;

  try {
    const comment = await VideoComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    const isLiked = comment.likes.includes(userId);
    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    // Create notification if user is liking someone else's comment
    if (!isLiked && comment.createdBy.toString() !== userId) {
      const notificationAlreadyExists = await Notification.findOne({
        userId: comment.createdBy,
        videoId: comment.videoId,
        createdBy: userId,
        videoCommentId: commentId,
        type: "videoCommentLiked",
      });

      if (!notificationAlreadyExists) {
        const notification = new Notification({
          userId: comment.createdBy,
          createdBy: userId,
          videoId: comment.videoId,
          videoCommentId: commentId,
          message: `${req.user.username || 'Someone'} liked your comment`,
          type: "videoCommentLiked",
        });
        await notification.save();

        io.to(comment.createdBy.toString()).emit("newNotification", notification);
      }
    }

    const updatedComment = await VideoComment.findByIdAndUpdate(
      commentId,
      update,
      { new: true }
    );

    const message = isLiked
      ? "Comment unliked successfully"
      : "Comment liked successfully";

    res.status(StatusCodes.OK).json({
      message,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to like comment" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  try {
    // Find the comment first to check ownership
    const comment = await VideoComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    // Check if user is authorized to delete the comment
    if (comment.createdBy.toString() !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this comment"
      );
    }

    // Update the comment to mark as deleted
    await VideoComment.findByIdAndUpdate(commentId, {
      deleted: true,
      content: "[Comment deleted]",
    });

    // Remove the comment from the video's comments array
    await Video.findByIdAndUpdate(
      comment.videoId,
      { $pull: { comments: commentId } },
    );

    res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete comment" });
  }
};

// Edit a comment
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    if (!content || content.trim() === "") {
      throw new BadRequestError("Comment content is required");
    }

    const comment = await VideoComment.findById(commentId);
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    if (comment.createdBy.toString() !== userId) {
      throw new UnauthorizedError("Not authorized to edit this comment");
    }

    const updatedComment = await VideoComment.findByIdAndUpdate(
      commentId,
      {
        content,
        editedAt: new Date(),
      },
      { new: true }
    ).populate("createdBy", "name avatar");

    res.status(StatusCodes.OK).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update comment" });
  }
};

// For backward compatibility
export const editComment = updateComment;

// Create a reply to a comment
export const createReply = async (req, res) => {
  const { content, videoId } = req.body;
  const { commentId } = req.params;

  try {
    const comment = await VideoComment.findById(commentId);
    const parentReply = await VideoReply.findById(commentId);

    if (!comment && !parentReply) {
      throw new BadRequestError("Comment or reply not found");
    }

    const reply = await VideoReply.create({
      content,
      createdBy: req.user.userId,
      parentId: commentId,
      commentId: comment
        ? comment._id
        : parentReply
        ? parentReply.commentId
        : null,
      replyTo: comment
        ? comment.createdBy
        : parentReply
        ? parentReply.createdBy
        : null,
    });

    if (comment) {
      comment.replies.push(reply._id);
      await comment.save();
    } else if (parentReply) {
      parentReply.replies.push(reply._id);
      await parentReply.save();
    }

    // Fetch reply with user details for response
    const replyWithUser = await VideoReply.aggregate([
      {
        $match: { _id: reply._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "authorDetails",
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
          username: { $arrayElemAt: ["$authorDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          replyToUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        },
      },
      {
        $project: {
          authorDetails: 0,
          replyToDetails: 0,
        },
      },
    ]);

    // Send notification to the user who was replied to
    if (reply.replyTo && reply.replyTo.toString() !== req.user.userId) {
      const notification = new Notification({
        userId: reply.replyTo.toString(),
        createdBy: req.user.userId,
        videoId: videoId,
        commentId: comment
          ? comment._id
          : parentReply
          ? parentReply.commentId
          : null,
        type: "videoReply",
        message: `${req.user.username || 'Someone'} replied to your comment`,
      });

      await notification.save();

      io.to(reply.replyTo.toString()).emit("newNotification", notification);
    }

    res.status(StatusCodes.CREATED).json({
      message: "Reply created successfully",
      reply: replyWithUser[0],
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create reply" });
  }
};

// Get all replies for a comment
export const getAllRepliesByCommentId = async (req, res) => {
  const { commentId } = req.params;

  try {
    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(commentId);

    // Find all replies for this comment
    const replies = await VideoReply.aggregate([
      {
        $match: {
          commentId: objectId,
          deleted: false,
        },
      },
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
          username: { $arrayElemAt: ["$userDetails.name", 0] },
          userAvatar: { $arrayElemAt: ["$userDetails.avatar", 0] },
          replyToUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      {
        $project: {
          userDetails: 0,
          replyToDetails: 0,
        },
      },
      {
        $sort: { createdAt: 1 }, // Sort by creation date ascending
      },
    ]);

    res.status(StatusCodes.OK).json({
      replies,
    });
  } catch (error) {
    console.error("Error fetching replies:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch replies" });
  }
};

// Update a reply
export const updateReply = async (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    if (!content) {
      throw new BadRequestError("Reply content is required");
    }

    const reply = await VideoReply.findOne({ _id: replyId, deleted: false })
      .populate("createdBy", "name avatar")
      .populate("replyTo", "name avatar")
      .populate("parentId");

    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    if (reply.createdBy._id.toString() !== userId) {
      throw new UnauthorizedError("Not authorized to edit this reply");
    }

    const updatedReply = await VideoReply.findByIdAndUpdate(
      replyId,
      {
        content,
        editedAt: new Date(),
      },
      { new: true }
    )
      .populate("createdBy", "name avatar")
      .populate("replyTo", "name avatar");

    res.status(StatusCodes.OK).json({
      message: "Reply updated successfully",
      reply: updatedReply,
    });
  } catch (error) {
    console.error("Error updating reply:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update reply" });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.userId;

  try {
    const reply = await VideoReply.findById(replyId);
    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    if (reply.createdBy.toString() !== userId) {
      throw new UnauthorizedError("Not authorized to delete this reply");
    }

    // Mark as deleted instead of removing completely
    await VideoReply.findByIdAndUpdate(replyId, {
      deleted: true,
      content: "[Reply deleted]",
    });

    // Remove from parent's replies array
    if (reply.parentId) {
      const parentIsComment = await VideoComment.findById(reply.parentId);
      if (parentIsComment) {
        await VideoComment.findByIdAndUpdate(reply.parentId, {
          $pull: { replies: replyId },
        });
      } else {
        await VideoReply.findByIdAndUpdate(reply.parentId, {
          $pull: { replies: replyId },
        });
      }
    }

    res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to delete reply" });
  }
};

// Like a reply
export const likeReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.userId;
  const { videoId } = req.body;

  try {
    const reply = await VideoReply.findById(replyId);
    if (!reply) {
      throw new BadRequestError("Reply not found");
    }

    const isLiked = reply.likes.includes(userId);
    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $push: { likes: userId } };

    if (!isLiked && reply.createdBy.toString() !== userId) {
      const notificationAlreadyExists = await Notification.findOne({
        userId: reply.createdBy,
        videoId: videoId,
        createdBy: userId,
        videoReplyId: reply._id,
        type: "videoReplyLiked",
      });

      if (!notificationAlreadyExists) {
        const notification = new Notification({
          userId: reply.createdBy,
          createdBy: userId,
          videoId: videoId,
          videoReplyId: replyId,
          message: `${req.user.username || 'Someone'} liked your reply`,
          type: "videoReplyLiked",
        });
        await notification.save();

        io.to(reply.createdBy.toString()).emit("newNotification", notification);
      }
    }

    const updatedReply = await VideoReply.findByIdAndUpdate(replyId, update, {
      new: true,
    });

    const message = isLiked
      ? "Reply unliked successfully"
      : "Reply liked successfully";

    res.status(StatusCodes.OK).json({
      message,
      reply: updatedReply,
    });
  } catch (error) {
    console.error("Error liking reply:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to like reply" });
  }
};
