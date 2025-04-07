import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/customErors.js";
import VideoPlaylist from "../models/videos/videoPlaylistModel.js";
import Video from "../models/videos/videoModel.js";
import { deleteFile } from "../utils/fileUtils.js";

// Create a new playlist
export const createPlaylist = async (req, res) => {
  const { userId } = req.user;
  
  if (req.user.role !== "contributor") {
    throw new UnauthenticatedError("You are not authorized to create a playlist");
  }

  try {
    if (!req.file) {
      throw new BadRequestError("Please provide a cover image");
    }

    const coverImagePath = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
    const playlistData = { ...req.body };

    const playlist = await VideoPlaylist.create({
      ...playlistData,
      author: userId,
      coverImage: coverImagePath,
      videos: []
    });

    res.status(StatusCodes.CREATED).json({ playlist });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

// Get all playlists
export const getAllPlaylists = async (req, res) => {
  const playlists = await VideoPlaylist.find({})
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });
  
  res.status(StatusCodes.OK).json({ playlists });
};

// Get a single playlist with its videos
export const getPlaylistDetails = async (req, res) => {
  const { id: playlistId } = req.params;
  
  const playlist = await VideoPlaylist.findById(playlistId)
    .populate('author', 'name avatar')
    .populate({
      path: 'videos',
      select: 'title description coverImage videoUrl duration viewCount createdAt'
    });
  
  if (!playlist) {
    throw new NotFoundError("Playlist not found");
  }
  
  res.status(StatusCodes.OK).json({ playlist });
};

// Add a video to a playlist
export const addVideoToPlaylist = async (req, res) => {
  const { userId } = req.user;
  const { playlistId, videoId } = req.body;
  
  // Check if playlist exists and belongs to the user
  const playlist = await VideoPlaylist.findOne({ _id: playlistId, author: userId });
  if (!playlist) {
    throw new NotFoundError("Playlist not found or you don't have permission to modify it");
  }
  
  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }
  
  // Check if video is already in the playlist
  if (playlist.videos.includes(videoId)) {
    throw new BadRequestError("Video is already in the playlist");
  }
  
  // Add video to playlist
  playlist.videos.push(videoId);
  await playlist.save();
  
  res.status(StatusCodes.OK).json({ 
    message: "Video added to playlist successfully",
    playlist 
  });
};

// Remove a video from a playlist
export const removeVideoFromPlaylist = async (req, res) => {
  const { userId } = req.user;
  const { playlistId, videoId } = req.params;
  
  // Check if playlist exists and belongs to the user
  const playlist = await VideoPlaylist.findOne({ _id: playlistId, author: userId });
  if (!playlist) {
    throw new NotFoundError("Playlist not found or you don't have permission to modify it");
  }
  
  // Remove video from playlist
  playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
  await playlist.save();
  
  res.status(StatusCodes.OK).json({ 
    message: "Video removed from playlist successfully",
    playlist 
  });
};

// Update playlist details
export const updatePlaylist = async (req, res) => {
  const { userId } = req.user;
  const { id: playlistId } = req.params;
  
  // Check if playlist exists and belongs to the user
  const playlist = await VideoPlaylist.findOne({ _id: playlistId, author: userId });
  if (!playlist) {
    throw new NotFoundError("Playlist not found or you don't have permission to modify it");
  }
  
  try {
    const updateData = { ...req.body };
    
    // Handle cover image update if provided
    if (req.file) {
      // Delete old cover image if it exists
      if (playlist.coverImage) {
        const oldImagePath = playlist.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
        await deleteFile(oldImagePath);
      }
      updateData.coverImage = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
    }
    
    const updatedPlaylist = await VideoPlaylist.findByIdAndUpdate(
      playlistId,
      updateData,
      { new: true }
    );
    
    res.status(StatusCodes.OK).json({ playlist: updatedPlaylist });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  const { userId } = req.user;
  const { id: playlistId } = req.params;
  
  // Check if playlist exists and belongs to the user
  const playlist = await VideoPlaylist.findOne({ _id: playlistId, author: userId });
  if (!playlist) {
    throw new NotFoundError("Playlist not found or you don't have permission to delete it");
  }
  
  try {
    // Delete cover image if it exists
    if (playlist.coverImage) {
      const imagePath = playlist.coverImage.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
      await deleteFile(imagePath);
    }
    
    await VideoPlaylist.findByIdAndDelete(playlistId);
    
    res.status(StatusCodes.OK).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
};

// Reorder videos in a playlist
export const reorderPlaylistVideos = async (req, res) => {
  const { userId } = req.user;
  const { playlistId } = req.params;
  const { videoIds } = req.body;
  
  if (!Array.isArray(videoIds)) {
    throw new BadRequestError("videoIds must be an array");
  }
  
  // Check if playlist exists and belongs to the user
  const playlist = await VideoPlaylist.findOne({ _id: playlistId, author: userId });
  if (!playlist) {
    throw new NotFoundError("Playlist not found or you don't have permission to modify it");
  }
  
  // Verify all videos exist in the playlist
  const currentVideoIds = playlist.videos.map(id => id.toString());
  const allVideosExist = videoIds.every(id => currentVideoIds.includes(id));
  
  if (!allVideosExist || videoIds.length !== playlist.videos.length) {
    throw new BadRequestError("The provided video IDs don't match the videos in the playlist");
  }
  
  // Update the order
  playlist.videos = videoIds;
  await playlist.save();
  
  res.status(StatusCodes.OK).json({ 
    message: "Playlist order updated successfully",
    playlist 
  });
};

// Get user's playlists
export const getUserPlaylists = async (req, res) => {
  const { userId } = req.user;
  
  const playlists = await VideoPlaylist.find({ author: userId })
    .sort({ createdAt: -1 });
  
  res.status(StatusCodes.OK).json({ playlists });
};
