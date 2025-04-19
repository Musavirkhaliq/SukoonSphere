import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/customErors.js";
import Video from "../models/videos/videoModel.js";
import { deleteFile } from '../utils/fileUtils.js';
import { downloadImage } from '../utils/imageUtils.js';
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js";

export const getAllVideos = async (req, res) => {
    const videos = await Video.find();
    res.status(StatusCodes.OK).json({ videos });
};

export const createVideo = async (req, res) => {
    const { userId } = req.user;
    if (req.user.role !== "contributor") {
      throw new UnauthenticatedError("You are not authorized to create a video");
    }

    try {
      let coverImagePath;
      let downloadedFilename;

      // Handle cover image - either from file upload or YouTube thumbnail URL
      if (req.file) {
        // Use uploaded file
        coverImagePath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      } else if (req.body.thumbnailUrl) {
        // Download image from URL
        try {
          downloadedFilename = await downloadImage(req.body.thumbnailUrl);
          coverImagePath = `${process.env.BACKEND_URL}/public/uploads/${downloadedFilename}`;
        } catch (downloadError) {
          console.error('Error downloading thumbnail:', downloadError);
          throw new BadRequestError("Failed to download thumbnail. Please upload a cover image.");
        }
      } else {
        throw new BadRequestError("Please provide a cover image or YouTube URL with thumbnail");
      }

      const videoData = { ...req.body };

      const video = await Video.create({
        ...videoData,
        author: userId,
        coverImage: coverImagePath
      });

      res.status(StatusCodes.CREATED).json({ video });
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      throw error;
    }
};

export const updateVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const { userId, role } = req.user;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }

    if (role !== "contributor" && video.author.toString() !== userId) {
      throw new UnauthenticatedError("You are not authorized to update this video");
    }

    try {
      const updateData = { ...req.body };

      // Handle tags from FormData for updates
      if (Array.isArray(req.body.tags)) {
        updateData.tags = req.body.tags.map(tag => tag.trim()).filter(Boolean);
      } else if (req.body['tags[]']) {
        // Handle tags sent as tags[]
        updateData.tags = Array.isArray(req.body['tags[]'])
          ? req.body['tags[]'].map(tag => tag.trim()).filter(Boolean)
          : [req.body['tags[]']].map(tag => tag.trim()).filter(Boolean);
      } else if (typeof req.body.tags === 'string') {
        // Fallback for string format
        updateData.tags = req.body.tags
          .replace(/[\[\]"]/g, '') // Remove brackets and quotes
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);
      } else if (updateData.tags) {
        updateData.tags = [];
      }

      // Handle cover image - either from file upload or YouTube thumbnail URL
      if (req.file) {
        // Delete old cover image if it exists
        if (video.coverImage) {
          const oldImagePath = video.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
          await deleteFile(oldImagePath);
        }
        updateData.coverImage = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      } else if (req.body.thumbnailUrl) {
        // Download image from URL
        try {
          // Delete old cover image if it exists
          if (video.coverImage) {
            const oldImagePath = video.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
            await deleteFile(oldImagePath);
          }

          const downloadedFilename = await downloadImage(req.body.thumbnailUrl);
          updateData.coverImage = `${process.env.BACKEND_URL}/public/uploads/${downloadedFilename}`;
        } catch (downloadError) {
          console.error('Error downloading thumbnail:', downloadError);
          throw new BadRequestError("Failed to download thumbnail.");
        }
      }

      const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId },
        updateData,
        { new: true }
      );
      res.status(StatusCodes.OK).json({ video: updatedVideo });
    } catch (error) {
      // Clean up uploaded file if there's an error
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      throw error;
    }
};

export const deleteVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const { userId, role } = req.user;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }

    if (role !== "contributor" && video.author.toString() !== userId) {
      throw new UnauthenticatedError("You are not authorized to delete this video");
    }

    try {
      // Delete cover image if it exists
      if (video.coverImage) {
        const imagePath = video.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
        await deleteFile(imagePath);
      }

      await Video.findOneAndDelete({ _id: videoId });
      res.status(StatusCodes.OK).json({ msg: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
};

export const getSingleVideo = async (req, res) => {
    const { id: videoId } = req.params;
    const video = await Video.findOne({ _id: videoId });
    if (!video) {
      throw new BadRequestError("Video not found");
    }
    res.status(StatusCodes.OK).json({ video });
};

export const getUserVideos = async (req, res) => {
    const { userId } = req.user;
    const videos = await Video.find({ author: userId });
    res.status(StatusCodes.OK).json({ videos });
};

export const getSingleVideos = async (req, res) => {
  const video = await Video.find({ type: "single" });
  if (!video) {
    throw new BadRequestError("Video not found");
  }
  res.status(StatusCodes.OK).json({ video });
};

export const getPlaylistVideos = async (req, res) => {
  const video = await Video.find({ type: "playlist" });
  if (!video) {
    throw new BadRequestError("Video not found");
  }
  res.status(StatusCodes.OK).json({ video });
};

export const likeVideo = async (req, res) => {
  const { id: videoId } = req.params;
  const userId = req.user.userId;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new BadRequestError("Video not found");
    }

    // Toggle like
    const alreadyLiked = video.likes.includes(userId);
    if (alreadyLiked) {
      // User is unliking the video
      video.likes = video.likes.filter((id) => id.toString() !== userId);
      await video.save();

      // Remove notification if exists
      const notification = await Notification.findOne({
        userId: video.author,
        createdBy: userId,
        videoId: videoId,
        type: "videoLiked",
      });

      if (notification) {
        await notification.deleteOne();
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "Video unliked successfully", likes: video.likes });
    } else {
      // User is liking the video
      video.likes.push(userId);
      await video.save();

      // Create notification if author is not the same as liker
      if (video.author && video.author.toString() !== userId) {
        const notificationAlreadyExists = await Notification.findOne({
          userId: video.author,
          createdBy: userId,
          videoId: videoId,
          type: "videoLiked",
        });

        if (!notificationAlreadyExists) {
          const notification = new Notification({
            userId: video.author,
            createdBy: userId,
            videoId: videoId,
            type: "videoLiked",
            message: `${req.user.username || 'Someone'} liked your video`,
          });

          await notification.save();
          io.to(video.author.toString()).emit("newNotification", notification);
        }
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "Video liked successfully", likes: video.likes });
    }
  } catch (error) {
    console.error("Error in likeVideo:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to like the video" });
  }
};

// Track content view
export const trackContentView = async (req, res, next) => {
  try {
    const { id: videoId } = req.params;
    const video = await Video.findById(videoId);

    if (video) {
      // Increment view count
      video.viewCount = (video.viewCount || 0) + 1;
      await video.save();
    }

    next();
  } catch (error) {
    console.error("Error tracking view:", error);
    // Continue to the next middleware even if tracking fails
    next();
  }
};