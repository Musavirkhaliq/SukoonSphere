import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customErors.js";
import VideoReaction from "../models/videos/videoReactionModel.js";
import Video from "../models/videos/videoModel.js";

// React to a video
export const reactToVideo = async (req, res) => {
  const { userId } = req.user;
  const { videoId } = req.params;
  const { type } = req.body;

  // Validate reaction type
  if (!["like", "love", "helpful", "insightful"].includes(type)) {
    throw new BadRequestError("Invalid reaction type");
  }

  // Check if video exists
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new NotFoundError("Video not found");
  }

  try {
    // Check if user already reacted to this video
    const existingReaction = await VideoReaction.findOne({ video: videoId, user: userId });

    if (existingReaction) {
      // If same reaction type, remove it (toggle off)
      if (existingReaction.type === type) {
        await VideoReaction.findByIdAndDelete(existingReaction._id);
        
        // Get updated reaction counts
        const reactionCounts = await getReactionCounts(videoId);
        
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
      const reactionCounts = await getReactionCounts(videoId);
      
      return res.status(StatusCodes.OK).json({ 
        message: "Reaction updated",
        reactionCounts,
        userReaction: existingReaction.type
      });
    }

    // Create new reaction
    const reaction = await VideoReaction.create({
      video: videoId,
      user: userId,
      type,
    });

    // Get updated reaction counts
    const reactionCounts = await getReactionCounts(videoId);

    res.status(StatusCodes.CREATED).json({ 
      message: "Reaction added",
      reactionCounts,
      userReaction: reaction.type
    });
  } catch (error) {
    console.error("Error in reactToVideo:", error);
    throw error;
  }
};

// Get reactions for a video
export const getVideoReactions = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.user || {};
  
  // Check if video exists
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new NotFoundError("Video not found");
  }

  // Get reaction counts
  const reactionCounts = await getReactionCounts(videoId);
  
  // Get user's reaction if logged in
  let userReaction = null;
  if (userId) {
    const reaction = await VideoReaction.findOne({ video: videoId, user: userId });
    if (reaction) {
      userReaction = reaction.type;
    }
  }

  res.status(StatusCodes.OK).json({ 
    reactionCounts,
    userReaction
  });
};

// Helper function to get reaction counts
async function getReactionCounts(videoId) {
  const reactions = await VideoReaction.find({ video: videoId });
  
  const counts = {
    like: 0,
    love: 0,
    helpful: 0,
    insightful: 0,
    total: reactions.length
  };
  
  reactions.forEach(reaction => {
    counts[reaction.type]++;
  });
  
  return counts;
}
