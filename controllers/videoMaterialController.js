import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/customErors.js";
import VideoMaterial from "../models/videos/videoMaterialModel.js";
import Video from "../models/videos/videoModel.js";
import { deleteFile } from "../utils/fileUtils.js";

// Add material to a video
export const addMaterial = async (req, res) => {
  const { userId } = req.user;
  const { videoId, title, type, content } = req.body;

  // Validate required fields
  if (!videoId || !title || !type || !content) {
    throw new BadRequestError("Please provide all required fields");
  }

  // Check if video exists and user is authorized
  const video = await Video.findById(videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  // Only the video author or admin can add materials
  console.log('Authorization check for adding materials:');
  console.log('Video author ID:', video.author.toString());
  console.log('Current user ID (userId):', userId);
  console.log('Current user ID (user._id):', req.user._id);
  console.log('User role:', req.user.role);

  // Check using both userId and user._id for compatibility
  const isAuthor = video.author.toString() === userId || video.author.toString() === req.user._id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    console.log('Authorization failed: User is not the author or admin');
    throw new UnauthenticatedError("You are not authorized to add materials to this video");
  }
  console.log('Authorization passed: User is the author or admin');

  try {
    // Handle file upload if present
    let fileData = {};
    if (type === "file" && req.file) {
      const fileUrl = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      fileData = {
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };
    }

    // Get the highest order number for this video's materials
    const highestOrder = await VideoMaterial.findOne({ videoId })
      .sort({ order: -1 })
      .select('order');

    const order = highestOrder ? highestOrder.order + 1 : 0;

    // Create the material
    const material = await VideoMaterial.create({
      videoId,
      title,
      type,
      content,
      order,
      ...fileData
    });

    res.status(StatusCodes.CREATED).json({ material });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

// Get all materials for a video
export const getVideoMaterials = async (req, res) => {
  const { videoId } = req.params;

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  const materials = await VideoMaterial.find({ videoId })
    .sort({ order: 1 });

  res.status(StatusCodes.OK).json({ materials });
};

// Update a material
export const updateMaterial = async (req, res) => {
  const { userId } = req.user;
  const { id: materialId } = req.params;

  // Find the material
  const material = await VideoMaterial.findById(materialId);
  if (!material) {
    throw new NotFoundError("Material not found");
  }

  // Check if user is authorized
  const video = await Video.findById(material.videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  // Only the video author or admin can update materials
  const isAuthor = video.author.toString() === userId || video.author.toString() === req.user._id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new UnauthenticatedError("You are not authorized to update materials for this video");
  }

  try {
    const updateData = { ...req.body };

    // Handle file upload if present
    if (material.type === "file" && req.file) {
      // Delete old file if it exists
      if (material.fileUrl) {
        const oldFilePath = material.fileUrl.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
        await deleteFile(oldFilePath);
      }

      updateData.fileUrl = `${process.env.BACKEND_URL}/public/uploads/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
      updateData.fileType = req.file.mimetype;
    }

    const updatedMaterial = await VideoMaterial.findByIdAndUpdate(
      materialId,
      updateData,
      { new: true }
    );

    res.status(StatusCodes.OK).json({ material: updatedMaterial });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    throw error;
  }
};

// Delete a material
export const deleteMaterial = async (req, res) => {
  const { userId } = req.user;
  const { id: materialId } = req.params;

  // Find the material
  const material = await VideoMaterial.findById(materialId);
  if (!material) {
    throw new NotFoundError("Material not found");
  }

  // Check if user is authorized
  const video = await Video.findById(material.videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  // Only the video author or admin can delete materials
  const isAuthor = video.author.toString() === userId || video.author.toString() === req.user._id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new UnauthenticatedError("You are not authorized to delete materials for this video");
  }

  try {
    // Delete file if it exists
    if (material.type === "file" && material.fileUrl) {
      const filePath = material.fileUrl.replace(`${process.env.BACKEND_URL}/public/uploads/`, '');
      await deleteFile(filePath);
    }

    await VideoMaterial.findByIdAndDelete(materialId);

    res.status(StatusCodes.OK).json({ msg: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
};

// Reorder materials
export const reorderMaterials = async (req, res) => {
  const { userId } = req.user;
  const { videoId } = req.params;
  const { materialIds } = req.body;

  if (!materialIds || !Array.isArray(materialIds)) {
    throw new BadRequestError("Please provide an array of material IDs");
  }

  // Check if video exists and user is authorized
  const video = await Video.findById(videoId);
  if (!video) {
    throw new NotFoundError("Video not found");
  }

  // Only the video author or admin can reorder materials
  const isAuthor = video.author.toString() === userId || video.author.toString() === req.user._id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new UnauthenticatedError("You are not authorized to reorder materials for this video");
  }

  try {
    // Update the order of each material
    const updatePromises = materialIds.map((id, index) => {
      return VideoMaterial.findByIdAndUpdate(id, { order: index });
    });

    await Promise.all(updatePromises);

    // Get the updated materials
    const materials = await VideoMaterial.find({ videoId })
      .sort({ order: 1 });

    res.status(StatusCodes.OK).json({ materials });
  } catch (error) {
    console.error("Error reordering materials:", error);
    throw error;
  }
};
