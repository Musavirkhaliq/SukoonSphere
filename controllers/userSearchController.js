import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";

// Search for users by name or email
export const searchUsers = async (req, res) => {
  try {
    console.log('Search query received:', req.query);
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Search query must be at least 2 characters long"
      });
    }

    console.log('Searching for users with query:', query);

    // Find users matching the search query
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })
    .select("_id name email avatar role followers following")
    .limit(10);

    console.log(`Found ${users.length} users matching query`);

    return res.status(StatusCodes.OK).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to search users"
    });
  }
};

// Check if the current user is following another user
export const checkFollowing = async (req, res) => {
  try {
    console.log('Check following request received:', req.params);
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User ID is required"
      });
    }

    console.log(`Checking if user ${currentUserId} is following user ${userId}`);

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Current user not found"
      });
    }

    const isFollowing = currentUser.following.some(id => id.toString() === userId.toString());

    console.log(`User ${currentUserId} is ${isFollowing ? '' : 'not '}following user ${userId}`);

    return res.status(StatusCodes.OK).json({
      success: true,
      isFollowing
    });
  } catch (error) {
    console.error("Error checking following status:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to check following status"
    });
  }
};
