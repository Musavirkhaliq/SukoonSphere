import Article from "../models/articles/articleModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { UnauthenticatedError, BadRequestError } from "../errors/customErors.js";

// Get all articles with pagination, search, and filters
export const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'newest';
    const search = req.query.search || '';

    // Base pipeline stages
    const pipeline = [
      // Match non-deleted articles and search
      {
        $match: {
          deleted: { $ne: true },
          ...(search && {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { content: { $regex: search, $options: 'i' } }
            ]
          })
        }
      },
      // Lookup user details
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      // Add computed fields
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
        }
      },
      // Project out unnecessary fields
      {
        $project: {
          authorDetails: 0,
          deleted: 0,
          __v: 0
        }
      }
    ];

    // Add sort stage based on sortBy
    switch (sortBy) {
      case 'oldest':
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case 'title':
        pipeline.push({ $sort: { title: 1, createdAt: -1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count for pagination
    const totalCount = await Article.aggregate([
      pipeline[0], // Only use the match stage for count
      { $count: 'total' }
    ]);

    // Add pagination stages
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // Execute the main query
    const articles = await Article.aggregate(pipeline);

    // Calculate pagination metadata
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Get single article with author details
export const getSingleArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the main article
    const article = await Article.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          deleted: { $ne: true }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $lookup: {
          from: "articlecomments",
          let: { articleId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$articleId", "$$articleId"] },
                deleted: { $ne: true }
              }
            },
            {
              $count: "total"
            }
          ],
          as: "commentCount"
        }
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $ifNull: [{ $arrayElemAt: ["$commentCount.total", 0] }, 0] }
        }
      },
      {
        $project: {
          authorDetails: 0,
          commentCount: 0,
          deleted: 0,
          __v: 0
        }
      }
    ]);

    if (!article.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Article not found" });
    }

    // Get similar articles based on title
    const mainArticle = article[0];
    const similarArticles = await Article.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(id) },
          deleted: { $ne: true }
        }
      },
      {
        $addFields: {
          titleSimilarity: {
            $regexMatch: {
              input: { $toLower: "$title" },
              regex: { $toLower: mainArticle.title.split(' ').filter(word => word.length > 3).join('|') }
            }
          }
        }
      },
      {
        $match: {
          titleSimilarity: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $lookup: {
          from: "articlecomments",
          let: { articleId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$articleId", "$$articleId"] },
                deleted: { $ne: true }
              }
            },
            {
              $count: "total"
            }
          ],
          as: "commentCount"
        }
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
          totalLikes: { $size: { $ifNull: ["$likes", []] } },
          totalComments: { $ifNull: [{ $arrayElemAt: ["$commentCount.total", 0] }, 0] }
        }
      },
      {
        $project: {
          content: 0,
          authorDetails: 0,
          commentCount: 0,
          deleted: 0,
          __v: 0,
          titleSimilarity: 0
        }
      },
      {
        $limit: 3
      }
    ]);
    
    res.status(StatusCodes.OK).json({
      article: mainArticle,
      similarArticles
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Create article
export const createArticle = async (req, res) => {
  const { title, content } = req.body;

  let imageUrl = null;
  let imagePublicId = null;

  // Handle image upload if present
  if (req.file) {
    imageUrl = `${process.env.BACKEND_URL}/articles/${req.file.filename}`;
    imagePublicId = req.file.filename;
  }

  const article = await Article.create({
    title,
    content,
    author: req.user.userId,
    imageUrl,
    imagePublicId
  });

  res.status(StatusCodes.CREATED).json({ article });
};

// Update article
export const updateArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const { title, content } = req.body;
  const { userId } = req.user;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new Error('Article not found');
  }

  if (article.author.toString() !== userId) {
    throw new Error('Not authorized to update this article');
  }

  // Handle image update if present
  let imageUpdate = {};
  if (req.file) {
    // Delete old image if exists
    if (article.imagePublicId) {
      // await deleteFile(`public/articles/${article.imagePublicId}`);
    }
    imageUpdate = {
      imageUrl: `${process.env.BACKEND_URL}/articles/${req.file.filename}`,
      imagePublicId: req.file.filename
    };
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    { title, content, ...imageUpdate },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ article: updatedArticle });
};

// Delete article (soft delete)
export const deleteArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const { userId } = req.user;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new Error('Article not found');
  }

  if (article.author.toString() !== userId) {
    throw new Error('Not authorized to delete this article');
  }

  // Delete image if exists
  if (article.imagePublicId) {
    // await deleteFile(`public/articles/${article.imagePublicId}`);
  }

  article.deleted = true;
  await article.save();

  res.status(StatusCodes.OK).json({ msg: 'Article deleted successfully' });
};

// Get articles by user ID with pagination
export const getArticlesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'newest';

    // Base pipeline stages
    const pipeline = [
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          deleted: { $ne: true }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorAvatar: { $arrayElemAt: ["$authorDetails.avatar", 0] },
          authorId: { $arrayElemAt: ["$authorDetails._id", 0] },
        }
      },
      {
        $project: {
          authorDetails: 0,
          deleted: 0,
          __v: 0
        }
      }
    ];

    // Add sort stage
    switch (sortBy) {
      case 'oldest':
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      default: // 'newest'
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Get total count
    const totalCount = await Article.aggregate([
      pipeline[0],
      { $count: 'total' }
    ]);

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    const articles = await Article.aggregate(pipeline);
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Like/Unlike article
export const likeArticle = async (req, res) => {
  const userId = req.user.userId;
  const articleId = req.params.id;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }

  if (article?.likes?.includes(userId)) {
    article.likes = article.likes.filter((id) => id.toString() !== userId.toString());
    await article.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Article unliked successfully", article });
  } else {
    article.likes.push(userId);
    await article.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Article liked successfully", article });
  }
};