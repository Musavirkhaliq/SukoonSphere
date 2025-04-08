import { StatusCodes } from "http-status-codes";
import Post from "../models/postModel.js";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import PostComments from "../models/postCommentsModel.js";
import PostReplies from "../models/postReplyModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { deleteFile } from "../utils/fileUtils.js";
import { updateUserPoints, awardBadges } from "../utils/gamification.js";
import { io } from "../server.js";

import { getAnonymousUserId } from '../utils/anonymousUser.js';

export const createPost = async (req, res) => {
  const newPost = {
    ...req.body,
  };

  // Convert isAnonymous from string to boolean if needed
  if (typeof newPost.isAnonymous === 'string') {
    newPost.isAnonymous = newPost.isAnonymous === 'true';
  }

  // If post is anonymous, use the Anonymous user ID as the creator
  if (newPost.isAnonymous) {
    const anonymousUserId = await getAnonymousUserId();
    if (!anonymousUserId) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Failed to create anonymous post' });
    }
    newPost.createdBy = anonymousUserId;
    // Store the real user ID in a separate field for tracking purposes
    newPost.realCreator = req.user.userId;
  } else {
    // For non-anonymous posts, use the actual user ID
    newPost.createdBy = req.user.userId;
  }

  if (req.file) {
    const filepaath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
    newPost.imageUrl = filepaath;
  }

  const post = await Post.create(newPost);
  await User.findByIdAndUpdate(
    req.user.userId,
    { $push: { posts: post._id } },
    { new: true }
  );
  await updateUserPoints(req.user.userId, "post");
  const earnedBadges = await awardBadges(req.user.userId, "post");
  res.status(StatusCodes.CREATED).json({ msg: "Post uploaded successfully" });
};

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "newest";

    // Base pipeline stages
    const pipeline = [
      // Match non-deleted posts
      {
        $match: {
          deleted: { $ne: true },
        },
      },
      // Lookup user details
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      // Add computed fields
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
              null, // Will use default avatar for anonymous posts
              { $arrayElemAt: ["$userDetails.avatar", 0] }
            ]
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      // Project out unnecessary fields
      {
        $project: {
          userDetails: 0,
          deleted: 0,
          __v: 0,
        },
      },
    ];

    // Add sort stage based on sortBy
    switch (sortBy) {
      case "oldest":
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case "mostLiked":
        pipeline.push({ $sort: { totalLikes: -1, createdAt: -1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count for pagination
    const totalCount = await Post.aggregate([
      pipeline[0], // Only use the match stage for count
      { $count: "total" },
    ]);

    // Add pagination stages
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Execute the main query
    const posts = await Post.aggregate(pipeline);

    // Calculate pagination metadata
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch posts",
    });
  }
};

export const getAllPostsByUserId = async (req, res) => {
  const { id: userId } = req.params;

  // Check if this is the Anonymous user profile
  const anonymousUserId = await getAnonymousUserId();
  const isAnonymousProfile = String(userId) === String(anonymousUserId);

  // Get pagination parameters from query with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build the query based on whether this is the anonymous profile or a regular user profile
  let query;
  if (isAnonymousProfile) {
    // For the anonymous profile, show only anonymous posts
    query = {
      createdBy: new mongoose.Types.ObjectId(userId),
      deleted: { $ne: true },
      isAnonymous: true,
    };
  } else {
    // For regular user profiles, exclude anonymous posts
    // But include posts where the user is the realCreator (for edit/delete access)
    const isLoggedInUser = req.user && String(req.user.userId) === String(userId);

    if (isLoggedInUser) {
      // If viewing own profile, show non-anonymous posts and allow access to anonymous posts via realCreator
      query = {
        $or: [
          // Regular posts created by this user
          {
            createdBy: new mongoose.Types.ObjectId(userId),
            deleted: { $ne: true },
            isAnonymous: { $ne: true },
          },
          // Anonymous posts where this user is the real creator (for edit/delete access)
          {
            realCreator: new mongoose.Types.ObjectId(userId),
            deleted: { $ne: true },
            isAnonymous: true,
          }
        ]
      };
    } else {
      // If viewing someone else's profile, only show their non-anonymous posts
      query = {
        createdBy: new mongoose.Types.ObjectId(userId),
        deleted: { $ne: true },
        isAnonymous: { $ne: true },
      };
    }
  }

  // Get total count for pagination info
  const totalCount = await Post.countDocuments(query);

  const posts = await Post.aggregate([
    {
      $match: query,
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
            null, // Will use default avatar for anonymous posts
            { $arrayElemAt: ["$userDetails.avatar", 0] }
          ]
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
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

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(StatusCodes.OK).json({
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts: totalCount,
      hasNextPage,
      hasPrevPage,
      limit,
    },
  });
};

export const getPostById = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(postId) },
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
            null, // Will use default avatar for anonymous posts
            { $arrayElemAt: ["$userDetails.avatar", 0] }
          ]
        },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
        totalComments: { $size: { $ifNull: ["$comments", []] } },
      },
    },
    {
      $project: {
        userDetails: 0,
      },
    },
  ]);
  res.status(StatusCodes.OK).json({ post: post[0] });
};

export const likePosts = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.userId; // Get the user ID from the authenticated user

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new BadRequestError("Post not found");
    }

    // Toggle like
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      // User is unliking the post
      post.likes = post.likes.filter((user) => user.toString() !== userId);
      await post.save();
      await updateUserPoints(userId, "unlike");
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Post unliked successfully", likes: post.likes });
    } else {
      // User is liking the post
      post.likes.push(userId);

      // Create a notification only if the user is not liking their own post and notification doesn't already exist
      if (post.createdBy.toString() !== userId) {
        const notificationAlreadyExists = await Notification.findOne({
          userId: post.createdBy,
          postId: postId,
          type: "like",
        });
        if (!notificationAlreadyExists) {
          const notification = new Notification({
            userId: post.createdBy, // The user who created the post
            createdBy: userId,
            postId: postId,
            type: "like",
            message: `${req.user.username} liked your post`, // Assuming you have the username available
          });
          await notification.save();
          io.to(post.createdBy.toString()).emit(
            "newNotification",
            notification
          ); // Emit to the specific user's room
        }
      }
      await updateUserPoints(userId, "like");
      const earnedBadges = await awardBadges(userId, "like");
    }

    await post.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Post liked successfully", likes: post.likes });
  } catch (error) {
    console.error("Error in likePosts:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to like the post" });
  }
};
export const createPostComment = async (req, res) => {
  const { content, isAnonymous } = req.body;
  const { id: postId } = req.params;

  try {
    // Convert isAnonymous from string to boolean if needed
    const isAnonymousValue = typeof isAnonymous === 'string'
      ? isAnonymous === 'true'
      : Boolean(isAnonymous);

    // Create comment object
    const commentData = {
      postId,
      content,
      isAnonymous: isAnonymousValue,
    };

    // If comment is anonymous, use the Anonymous user ID as the creator
    if (isAnonymousValue) {
      const anonymousUserId = await getAnonymousUserId();
      if (!anonymousUserId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Failed to create anonymous comment' });
      }
      commentData.createdBy = anonymousUserId;
      // Store the real user ID in a separate field for tracking purposes
      commentData.realCreator = req.user.userId;
    } else {
      // For non-anonymous comments, use the actual user ID
      commentData.createdBy = req.user.userId;
    }

    const comment = await PostComments.create(commentData);

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();
    await updateUserPoints(req.user.userId, "comment");
    const earnedBadges = await awardBadges(req.user.userId, "comment");

    // Fetch comment with current user details for response
    const commentWithUser = await PostComments.aggregate([
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
          username: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$userDetails.username", 0] }
            ]
          },
          userAvatar: {
            $cond: [
              "$isAnonymous",
              null, // Will use default avatar for anonymous comments
              { $arrayElemAt: ["$userDetails.avatar", 0] }
            ]
          },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    // Create a notification only if the user is not commenting on their own post
    if (post.createdBy.toString() !== req.user.userId) {
      const notification = new Notification({
        userId: post.createdBy, // The user who created the post
        createdBy: req.user.userId,
        postId: postId,
        type: "comment",
        message: `${req.user.username} commented on your post`, // Assuming you have the username available
      });

      await notification.save();

      io.to(post.createdBy.toString()).emit("newNotification", notification); // Emit to the specific user's room
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

export const getAllCommentsByPostId = async (req, res) => {
  const { id: postId } = req.params;
  const postComments = await PostComments.aggregate([
    {
      $match: { postId: new mongoose.Types.ObjectId(postId) },
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
            null, // Will use default avatar for anonymous comments
            { $arrayElemAt: ["$userDetails.avatar", 0] }
          ]
        },
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
  ]);

  res.status(StatusCodes.OK).json({ comments: postComments });
};

export const createReply = async (req, res) => {
  const { content, postId, isAnonymous } = req.body;
  const { id: parentId } = req.params;

  try {
    const comment = await PostComments.findById(parentId);
    const parentReply = await PostReplies.findById(parentId);

    if (!comment && !parentReply) {
      throw new BadRequestError("Comment or reply not found");
    }

    // Convert isAnonymous from string to boolean if needed
    const isAnonymousValue = typeof isAnonymous === 'string'
      ? isAnonymous === 'true'
      : Boolean(isAnonymous);

    // Create reply object
    const replyData = {
      content,
      parentId,
      commentId: comment
        ? comment._id
        : parentReply
        ? parentReply.commentId
        : null, // Ensure commentId is set correctly
      replyTo: comment
        ? comment.createdBy
        : parentReply
        ? parentReply.createdBy
        : null,
      isAnonymous: isAnonymousValue,
    };

    // If reply is anonymous, use the Anonymous user ID as the creator
    if (isAnonymousValue) {
      const anonymousUserId = await getAnonymousUserId();
      if (!anonymousUserId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Failed to create anonymous reply' });
      }
      replyData.createdBy = anonymousUserId;
      // Store the real user ID in a separate field for tracking purposes
      replyData.realCreator = req.user.userId;
    } else {
      // For non-anonymous replies, use the actual user ID
      replyData.createdBy = req.user.userId;
    }

    const reply = await PostReplies.create(replyData);

    if (comment) {
      comment.replies.push(reply._id);
      await comment.save();
    } else if (parentReply) {
      parentReply.replies.push(reply._id);
      await parentReply.save();
    }

    // Fetch reply with current user details for response
    const replyWithUser = await PostReplies.aggregate([
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
          commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
          commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
          commentUserId: "$replyTo",
          totalReplies: { $size: { $ifNull: ["$replies", []] } },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
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
        userId: reply.replyTo.toString(), // The user who was replied to
        createdBy: req.user.userId,
        postId: postId,
        commentId: comment
          ? comment._id
          : parentReply
          ? parentReply.commentId
          : null,
        type: "reply",
        message: `${req.user.username} replied to your comment`, // Assuming you have the username available
      });

      await notification.save();

      io.to(reply.replyTo.toString()).emit("newNotification", notification); // Emit to the specific user's room
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
export const getAllRepliesByCommentId = async (req, res) => {
  const { id: commentId } = req.params;

  // Convert string ID to ObjectId
  const objectId = new mongoose.Types.ObjectId(commentId);

  const replies = await PostReplies.aggregate([
    {
      $match: {
        $or: [{ commentId: objectId }, { parentId: objectId }],
      },
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
        commentUsername: { $arrayElemAt: ["$replyToDetails.name", 0] },
        commentUserAvatar: { $arrayElemAt: ["$replyToDetails.avatar", 0] },
        commentUserId: "$replyTo",
        totalReplies: { $size: { $ifNull: ["$replies", []] } },
        totalLikes: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    {
      $project: {
        authorDetails: 0,
        replyToDetails: 0,
        __v: 0,
      },
    },
    {
      $sort: { createdAt: 1 },
    },
  ]);

  res.status(StatusCodes.OK).json({ replies });
};

export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    console.log('Delete request for post ID:', postId);

    const post = await Post.findById(postId);
    if (!post) {
      console.log('Post not found with ID:', postId);
      throw new BadRequestError("Post not found");
    }

    console.log('Found post:', {
      id: post._id,
      createdBy: post.createdBy,
      isAnonymous: post.isAnonymous,
      description: post.description?.substring(0, 30) + '...'
    });

    console.log('Delete authorization check:', {
      postCreatedBy: post.createdBy.toString(),
      userId: req.user.userId,
      isMatch: post.createdBy.toString() === req.user.userId,
      isAnonymous: post.isAnonymous,
      realCreator: post.realCreator?.toString(),
      isRealCreator: post.realCreator?.toString() === req.user.userId
    });

    // Check if user is authorized to delete this post
    // User can delete if they are the creator OR if they are the real creator of an anonymous post
    const isCreator = post.createdBy.toString() === req.user.userId;
    const isRealCreator = post.isAnonymous && post.realCreator && post.realCreator.toString() === req.user.userId;

    if (!isCreator && !isRealCreator) {
      throw new UnauthorizedError("Not authorized to delete this post");
    }

    if (post.imageUrl) {
      try {
        await deleteFile(post.imageUrl);
      } catch (fileError) {
        console.error('Error deleting image file:', fileError);
        // Continue with post deletion even if image deletion fails
      }
    }

    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(req.user.userId, { $pull: { posts: postId } });
    res.status(StatusCodes.OK).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error('Error in deletePost:', error);
    if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
      throw error;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to delete post" });
  }
}


export const deletePostComment = async (req, res) => {
  const { id: commentId } = req.params;

  // Find the comment first to check ownership
  const comment = await PostComments.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  // Check if user is authorized to delete the comment
  // User can delete if they are the creator OR if they are the real creator of an anonymous comment
  const isCreator = comment.createdBy.toString() === req.user.userId;
  const isRealCreator = comment.isAnonymous && comment.realCreator && comment.realCreator.toString() === req.user.userId;

  if (!isCreator && !isRealCreator) {
    throw new UnauthorizedError(
      "You are not authorized to delete this comment"
    );
  }

  // Delete the comment itself
  await PostComments.findByIdAndDelete(commentId);

  await Post.findByIdAndUpdate(
    comment.postId,
    { $pull: { comments: commentId } },
  );
  await updateUserPoints(req.user.userId, "deleteComment");
  res
    .status(StatusCodes.OK)
    .json({ message: "Comment and associated replies deleted successfully" });
};

export const deletePostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const reply = await PostReplies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }
  // Check if user is authorized to delete the reply
  // User can delete if they are the creator OR if they are the real creator of an anonymous reply
  const isCreator = reply.createdBy.toString() === req.user.userId;
  const isRealCreator = reply.isAnonymous && reply.realCreator && reply.realCreator.toString() === req.user.userId;

  if (!isCreator && !isRealCreator) {
    throw new UnauthorizedError("You are not authorized to delete this reply");
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  await PostReplies.findByIdAndDelete(replyId).session(session);

  // Remove reply from comment's replies array
  await PostComments.findByIdAndUpdate(
    reply.parentId,
    { $pull: { replies: replyId } },
    { session }
  );

  await session.commitTransaction();
  res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  session.endSession();
};

export const likePostComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user.userId;

  const comment = await PostComments.findById(commentId);

  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const isLiked = comment.likes.includes(userId);
  const update = isLiked
    ? { $pull: { likes: userId } }
    : { $push: { likes: userId } };
  if (!isLiked && comment.createdBy.toString() !== userId) {
    const notificationAlreadyExists = await Notification.findOne({
      userId: comment.createdBy,
      postId: comment.postId,
      createdBy: userId,
      postCommentId: commentId,
      type: "commentLiked",
    });
    if (!notificationAlreadyExists) {
      const notification = new Notification({
        userId: comment.createdBy, // The user who created the post
        createdBy: userId,
        postId: comment.postId,
        postCommentId: commentId,
        message: `${req.user.username} liked your comment`,
        type: "commentLiked",
      });
      await notification.save();

      io.to(comment.createdBy.toString()).emit("newNotification", notification);
    }
  }

  const updatedComment = await PostComments.findByIdAndUpdate(
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
};

export const likePostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const userId = req.user.userId;
  const { postId } = req.body;
  const reply = await PostReplies.findById(replyId);
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
      postId: reply.postId,
      createdBy: userId,
      postReplyId: reply._id,
      type: "replyLiked",
    });
    if (!notificationAlreadyExists) {
      const notification = new Notification({
        userId: reply.createdBy, // The user who created the post
        createdBy: userId,
        postId,
        postReplyId: replyId,
        message: `${req.user.username} liked your reply`,
        type: "replyLiked",
      });
      await notification.save();

      io.to(reply.createdBy.toString()).emit("newNotification", notification);
    }
  }

  const updatedReply = await PostReplies.findByIdAndUpdate(replyId, update, {
    new: true,
  });
  const message = isLiked
    ? "Reply unliked successfully"
    : "Reply liked successfully";

  res.status(StatusCodes.OK).json({
    message,
    reply: updatedReply,
  });
};

export const updatePost = async (req, res) => {
  const { id: postId } = req.params;
  const { userId } = req.user;

  const post = await Post.findById(postId);
  if (!post) {
    throw new BadRequestError("Post not found");
  }

  // Check if user is authorized to edit this post
  // User can edit if they are the creator OR if they are the real creator of an anonymous post
  const isCreator = post.createdBy.toString() === userId;
  const isRealCreator = post.isAnonymous && post.realCreator && post.realCreator.toString() === userId;

  if (!isCreator && !isRealCreator) {
    throw new UnauthorizedError("Not authorized to edit this post");
  }

  // Parse tags if they exist
  if (req.body.tags) {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (error) {
      throw new BadRequestError("Invalid tags format");
    }
  }

  // Convert isAnonymous from string to boolean if needed
  if (typeof req.body.isAnonymous === 'string') {
    req.body.isAnonymous = req.body.isAnonymous === 'true';
  }

  // Handle image removal
  if (req.body.removeImage === "true" && post.imageUrl) {
    const oldImagePath = post.imageUrl.replace(
      `${process.env.BACKEND_URL}/public/uploads/`,
      ""
    );
    await deleteFile(oldImagePath);
    req.body.imageUrl = null; // Clear the imageUrl in database
  }
  // Handle new image upload
  else if (req.file) {
    if (post.imageUrl) {
      const oldImagePath = post.imageUrl.replace(
        `${process.env.BACKEND_URL}/public/uploads/`,
        ""
      );
      await deleteFile(oldImagePath);
    }
    const filepaath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
    req.body.imageUrl = filepaath;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        ...req.body,
        editedAt: new Date(),
      },
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    msg: "Post updated successfully",
    post: updatedPost,
  });
};

export const updatePostComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { content, isAnonymous } = req.body;
  const { userId } = req.user;

  // Convert isAnonymous from string to boolean if needed
  const isAnonymousValue = typeof isAnonymous === 'string'
    ? isAnonymous === 'true'
    : Boolean(isAnonymous);

  if (!content) {
    throw new BadRequestError("Comment content is required");
  }

  const comment = await PostComments.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  // Check if user is authorized to edit this comment
  // User can edit if they are the creator OR if they are the real creator of an anonymous comment
  const isCreator = comment.createdBy.toString() === userId;
  const isRealCreator = comment.isAnonymous && comment.realCreator && comment.realCreator.toString() === userId;

  if (!isCreator && !isRealCreator) {
    throw new UnauthorizedError("Not authorized to edit this comment");
  }

  const updatedComment = await PostComments.findByIdAndUpdate(
    commentId,
    {
      content,
      isAnonymous: isAnonymousValue,
      editedAt: new Date(),
    },
    { new: true }
  ).populate("createdBy", "name avatar");

  res.status(StatusCodes.OK).json({
    message: "Comment updated successfully",
    comment: {
      ...updatedComment.toObject(),
      username: updatedComment.createdBy.name,
      userAvatar: updatedComment.createdBy.avatar,
      totalReplies: updatedComment.replies?.length || 0,
      totalLikes: updatedComment.likes?.length || 0,
    },
  });
};

export const updatePostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  if (!content) {
    throw new BadRequestError("Reply content is required");
  }

  const reply = await PostReplies.findOne({ _id: replyId, deleted: false })
    .populate("createdBy", "name avatar")
    .populate("replyTo", "name avatar")
    .populate("parentId");

  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  // Check if user is authorized to edit this reply
  // User can edit if they are the creator OR if they are the real creator of an anonymous reply
  const isCreator = reply.createdBy._id.toString() === userId;
  const isRealCreator = reply.isAnonymous && reply.realCreator && reply.realCreator.toString() === userId;

  if (!isCreator && !isRealCreator) {
    throw new UnauthorizedError("Not authorized to edit this reply");
  }

  reply.content = content;
  reply.editedAt = new Date();
  await reply.save();

  res.status(StatusCodes.OK).json({
    message: "Reply updated successfully",
    reply: {
      _id: reply._id,
      content: reply.content,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
      createdBy: reply.createdBy._id,
      // parentId: reply.parentId._id,
      username: reply.createdBy.name,
      userAvatar: reply.createdBy.avatar,
      commentUsername: reply.replyTo.name,
      commentUserAvatar: reply.replyTo.avatar,
      commentUserId: reply.replyTo._id,
      likes: reply.likes || [],
      totalLikes: reply.likes?.length || 0,
    },
  });
};

export const mostLikedPosts = async (req, res) => {
  const posts = await Post.find({ deleted: false })
    .populate("createdBy", "name avatar")
    .populate("comments", "content likes createdAt updatedAt")
    .sort({ likes: -1 })
    .limit(7);

  res.status(StatusCodes.OK).json({
    message: "Most liked posts",
    posts,
  });
};
