import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";
import Reaction from "../models/reactionModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

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

  return counts;
}
