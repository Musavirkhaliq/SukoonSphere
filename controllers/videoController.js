import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/customErors.js";
import Video from "../models/videos/videoModel.js";
import { deleteFile } from '../utils/fileUtils.js';

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
      if (!req.file) {
        throw new BadRequestError("Please provide a cover image");
      }

      const coverImagePath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      
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

      if (req.file) {
        // Delete old cover image if it exists
        if (video.coverImage) {
          const oldImagePath = video.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
          await deleteFile(oldImagePath);
        }
        updateData.coverImage = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
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