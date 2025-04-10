import PersonalStory from "../models/personalStoryModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import { getAnonymousUserId } from "../utils/anonymousUser.js";
import { updateUserPoints, awardBadges } from "../utils/userProgress.js";
import { io } from "../server.js";
import { UnauthenticatedError, BadRequestError } from "../errors/customErors.js";

// Get all personal stories with pagination, search, and filters
export const getAllPersonalStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "newest";
    const search = req.query.search || "";

    // Build query
    const query = { deleted: { $ne: true } };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sort order
    let sortOptions = {};
    switch (sortBy) {
      case "popular":
        sortOptions = { "likes.length": -1, createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "title":
        sortOptions = { title: 1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Execute query with aggregation to get author details and counts
    const stories = await PersonalStory.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $addFields: {
          authorName: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$authorDetails.name", 0] }
            ]
          },
          authorAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$authorDetails.avatar", 0] }
            ]
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          authorDetails: 0, // Remove the full author details
        },
      },
    ]);

    // Get total count for pagination
    const totalStories = await PersonalStory.countDocuments(query);
    const totalPages = Math.ceil(totalStories / limit);

    res.status(StatusCodes.OK).json({
      stories,
      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getAllPersonalStories:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch personal stories",
    });
  }
};

// Get personal stories by user ID
export const getPersonalStoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find stories by user ID (either as author or realCreator for anonymous stories)
    const query = {
      deleted: { $ne: true },
      $or: [
        { author: userId },
        { realCreator: userId, isAnonymous: true }
      ]
    };

    const stories = await PersonalStory.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $addFields: {
          authorName: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$authorDetails.name", 0] }
            ]
          },
          authorAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$authorDetails.avatar", 0] }
            ]
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          authorDetails: 0,
        },
      },
    ]);

    const totalStories = await PersonalStory.countDocuments(query);
    const totalPages = Math.ceil(totalStories / limit);

    res.status(StatusCodes.OK).json({
      stories,
      pagination: {
        currentPage: page,
        totalPages,
        totalStories,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getPersonalStoriesByUserId:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch user's personal stories",
    });
  }
};

// Get a single personal story by ID
export const getSinglePersonalStory = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    
    const story = await PersonalStory.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(storyId), deleted: { $ne: true } },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $addFields: {
          authorName: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$authorDetails.name", 0] }
            ]
          },
          authorAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$authorDetails.avatar", 0] }
            ]
          },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $size: { $ifNull: ["$comments", []] } },
          isLiked: {
            $cond: [
              { $in: [req.user?.userId ? new mongoose.Types.ObjectId(req.user.userId) : null, "$likes"] },
              true,
              false
            ]
          }
        },
      },
      {
        $project: {
          authorDetails: 0,
        },
      },
    ]);

    if (!story || story.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Personal story not found" });
    }

    res.status(StatusCodes.OK).json({ story: story[0] });
  } catch (error) {
    console.error("Error in getSinglePersonalStory:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch personal story",
    });
  }
};

// Create a new personal story
export const createPersonalStory = async (req, res) => {
  try {
    const { title, content, isAnonymous } = req.body;
    
    // Convert isAnonymous from string to boolean if needed
    const isAnonymousValue = typeof isAnonymous === 'string'
      ? isAnonymous === 'true'
      : Boolean(isAnonymous);

    let imageUrl = null;
    let imagePublicId = null;

    // Handle image upload if present
    if (req.file) {
      imageUrl = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      imagePublicId = req.file.filename;
    }

    // Create story object
    const storyData = {
      title,
      content,
      imageUrl,
      imagePublicId,
      isAnonymous: isAnonymousValue
    };

    // If story is anonymous, use the Anonymous user ID as the author
    if (isAnonymousValue) {
      const anonymousUserId = await getAnonymousUserId();
      if (!anonymousUserId) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
          msg: 'Failed to create anonymous story' 
        });
      }
      storyData.author = anonymousUserId;
      // Store the real user ID in a separate field for tracking purposes
      storyData.realCreator = req.user.userId;
    } else {
      // For non-anonymous stories, use the actual user ID
      storyData.author = req.user.userId;
    }

    // Create the personal story
    const story = await PersonalStory.create(storyData);

    // Update user points and badges
    await updateUserPoints(req.user.userId, "story");
    const earnedBadges = await awardBadges(req.user.userId, "story");

    res.status(StatusCodes.CREATED).json({ 
      msg: "Personal story created successfully",
      story
    });
  } catch (error) {
    console.error("Error in createPersonalStory:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to create personal story",
    });
  }
};

// Update a personal story
export const updatePersonalStory = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    const { title, content, isAnonymous } = req.body;
    
    // Find the story
    const story = await PersonalStory.findById(storyId);
    
    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Personal story not found" });
    }
    
    // Check if user is authorized to update this story
    const isAuthorized = 
      (story.author.toString() === req.user.userId) || 
      (story.isAnonymous && story.realCreator && story.realCreator.toString() === req.user.userId);
    
    if (!isAuthorized) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not authorized to update this story" });
    }
    
    // Update fields
    if (title) story.title = title;
    if (content) story.content = content;
    
    // Handle image upload if present
    if (req.file) {
      // Delete old image if exists
      if (story.imagePublicId) {
        // Add code to delete old image from storage
      }
      
      story.imageUrl = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      story.imagePublicId = req.file.filename;
    }
    
    // Handle image removal
    if (req.body.removeImage === 'true' && story.imagePublicId) {
      // Add code to delete image from storage
      story.imageUrl = null;
      story.imagePublicId = null;
    }
    
    // Save updated story
    await story.save();
    
    res.status(StatusCodes.OK).json({ 
      msg: "Personal story updated successfully",
      story
    });
  } catch (error) {
    console.error("Error in updatePersonalStory:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to update personal story",
    });
  }
};

// Delete a personal story
export const deletePersonalStory = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    
    // Find the story
    const story = await PersonalStory.findById(storyId);
    
    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Personal story not found" });
    }
    
    // Check if user is authorized to delete this story
    const isAuthorized = 
      (story.author.toString() === req.user.userId) || 
      (story.isAnonymous && story.realCreator && story.realCreator.toString() === req.user.userId);
    
    if (!isAuthorized) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Not authorized to delete this story" });
    }
    
    // Soft delete the story
    story.deleted = true;
    await story.save();
    
    res.status(StatusCodes.OK).json({ msg: "Personal story deleted successfully" });
  } catch (error) {
    console.error("Error in deletePersonalStory:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to delete personal story",
    });
  }
};

// Like a personal story
export const likePersonalStory = async (req, res) => {
  try {
    const { id: storyId } = req.params;
    const userId = req.user.userId;
    
    // Find the story
    const story = await PersonalStory.findById(storyId);
    
    if (!story) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Personal story not found" });
    }
    
    // Check if user has already liked the story
    const alreadyLiked = story.likes.includes(userId);
    
    if (alreadyLiked) {
      // Unlike the story
      story.likes = story.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the story
      story.likes.push(userId);
      
      // Create notification if the story is not by the current user
      if (story.author.toString() !== userId && !story.isAnonymous) {
        const notification = new Notification({
          userId: story.author,
          createdBy: userId,
          storyId: storyId,
          type: 'storyLike',
          message: `${req.user.username} liked your personal story`,
        });
        await notification.save();
        
        // Send real-time notification
        io.to(story.author.toString()).emit('newNotification', notification);
      }
      
      // Update user points and badges for liking
      await updateUserPoints(userId, "like");
      const earnedBadges = await awardBadges(userId, "like");
    }
    
    await story.save();
    
    res.status(StatusCodes.OK).json({ 
      msg: alreadyLiked ? "Personal story unliked" : "Personal story liked",
      likes: story.likes
    });
  } catch (error) {
    console.error("Error in likePersonalStory:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to like/unlike personal story",
    });
  }
};

// Get most liked personal stories
export const getMostLikedPersonalStories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const stories = await PersonalStory.aggregate([
      { $match: { deleted: { $ne: true } } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $addFields: {
          authorName: {
            $cond: [
              "$isAnonymous",
              "Anonymous",
              { $arrayElemAt: ["$authorDetails.name", 0] }
            ]
          },
          authorAvatar: {
            $cond: [
              "$isAnonymous",
              null,
              { $arrayElemAt: ["$authorDetails.avatar", 0] }
            ]
          },
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          commentsCount: { $size: { $ifNull: ["$comments", []] } },
        },
      },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          authorDetails: 0,
        },
      },
    ]);
    
    res.status(StatusCodes.OK).json({ stories });
  } catch (error) {
    console.error("Error in getMostLikedPersonalStories:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch most liked personal stories",
    });
  }
};
