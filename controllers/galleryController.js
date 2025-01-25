import { StatusCodes } from "http-status-codes";
import Gallery from "../models/gallery/galleryModel.js";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customErors.js";
import { deleteFile } from "../utils/fileUtils.js";

// Get user's gallery images with pagination
export const getUserImages = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const pipeline = [
    // Match user's images
    {
      $match: {
        author: new mongoose.Types.ObjectId(userId)
      }
    },
    // Lookup author details
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },
    // Sort by newest first
    { $sort: { createdAt: -1 } }
  ];

  // Get total count for pagination
  const totalImages = await Gallery.countDocuments({ author: userId });
  
  // Add pagination
  pipeline.push({ $skip: skip }, { $limit: limit });

  const images = await Gallery.aggregate(pipeline);

  res.status(StatusCodes.OK).json({
    images,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalImages / limit),
      totalImages,
      hasNextPage: skip + limit < totalImages,
      hasPrevPage: page > 1
    }
  });
};

// Add new image to gallery
export const addImage = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Please provide an image');
  }

  const imageUrl = `${process.env.BACKEND_URL}/articles/${req.file.filename}`;
  
  const image = await Gallery.create({
    imageUrl,
    imagePublicId: req.file.filename,
    author: req.user.userId
  });

  res.status(StatusCodes.CREATED).json({ 
    message: 'Image added successfully',
    image 
  });
};

// Delete image from gallery
export const deleteImage = async (req, res) => {
  const { id: imageId } = req.params;
  const { userId } = req.user;

  const image = await Gallery.findById(imageId);
  
  if (!image) {
    throw new NotFoundError('Image not found');
  }

  if (image.author.toString() !== userId) {
    throw new UnauthorizedError('Not authorized to delete this image');
  }

  // Delete image file from articles directory
  if (image.imagePublicId) {
    await deleteFile(`public/articles/${image.imagePublicId}`);
  }

  // Delete the image document
  await Gallery.findByIdAndDelete(imageId);

  res.status(StatusCodes.OK).json({ message: 'Image deleted successfully' });
};
