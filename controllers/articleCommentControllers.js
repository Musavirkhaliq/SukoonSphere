import { StatusCodes } from "http-status-codes";
import Article from "../models/articles/articleModel.js";
import ArticleComment from "../models/articles/articleCommentsModel.js";
import ArticleReply from "../models/articles/articleReplyModel.js";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";

// Create comment
export const createArticleComment = async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }

  const comment = await ArticleComment.create({
    articleId,
    content,
    createdBy: userId,
  });

  // Add comment to article's comments array
  article.comments.push(comment._id);
  await article.save();

  res.status(StatusCodes.CREATED).json({ comment });
};

// Get all comments for an article
export const getAllCommentsByArticleId = async (req, res) => {
  const { articleId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const article = await Article.findById(articleId);
  if (!article) {
    throw new BadRequestError("Article not found");
  }

  const totalComments = await ArticleComment.countDocuments({
    articleId,
    deleted: { $ne: true },
  });

  const comments = await ArticleComment.find({ articleId, deleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name avatar")
    .populate({
      path: "replies",
      match: { deleted: { $ne: true } },
      populate: [
        { path: "createdBy", select: "name avatar" },
        { path: "replyTo", select: "name" },
      ],
    });

  const totalPages = Math.ceil(totalComments / limit);

  res.status(StatusCodes.OK).json({
    comments,
    currentPage: page,
    totalPages,
    totalComments,
  });
};

// Create reply
export const createArticleReply = async (req, res) => {
  const { commentId } = req.params;
  const { content, parentId = null, replyToUserId } = req.body;
  const userId = req.user.userId;

  if (!replyToUserId) {
    throw new BadRequestError("replyToUserId is required");
  }

  const comment = await ArticleComment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const replyData = {
    commentId,
    parentId: parentId || commentId,
    content,
    createdBy: userId,
    replyTo: replyToUserId,
  };

  const reply = await ArticleReply.create(replyData);

  // Add reply to comment's replies array
  comment.replies.push(reply._id);
  await comment.save();

  // If this is a reply to another reply, add it to that reply's replies array
  if (parentId && parentId !== commentId) {
    const parentReply = await ArticleReply.findById(parentId);
    if (parentReply) {
      parentReply.replies.push(reply._id);
      await parentReply.save();
    }
  }

  // Populate the reply with user details before sending response
  const populatedReply = await ArticleReply.findById(reply._id)
    .populate("createdBy", "name avatar")
    .populate("replyTo", "name");

  res.status(StatusCodes.CREATED).json({ reply: populatedReply });
};

// Get all replies for a comment
export const getAllRepliesByCommentId = async (req, res) => {
  const { commentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const comment = await ArticleComment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  const totalReplies = await ArticleReply.countDocuments({
    commentId,
    deleted: { $ne: true },
  });

  const replies = await ArticleReply.find({ commentId, deleted: { $ne: true } })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name avatar")
    .populate("replyTo", "name");

  const totalPages = Math.ceil(totalReplies / limit);

  res.status(StatusCodes.OK).json({
    replies,
    currentPage: page,
    totalPages,
    totalReplies,
  });
};

// Delete comment
export const deleteArticleComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  const comment = await ArticleComment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to delete this comment");
  }

  comment.deleted = true;
  await comment.save();

  res.status(StatusCodes.OK).json({ message: "Comment deleted successfully" });
};

// Delete reply
export const deleteArticleReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.userId;

  const reply = await ArticleReply.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to delete this reply");
  }

  reply.deleted = true;
  await reply.save();

  res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
};

// Like comment
export const likeArticleComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  const comment = await ArticleComment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.likes.includes(userId)) {
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    comment.likes.push(userId);
  }

  await comment.save();
  res.status(StatusCodes.OK).json({ comment });
};

// Like reply
export const likeArticleReply = async (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.userId;

  const reply = await ArticleReply.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.likes.includes(userId)) {
    reply.likes = reply.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    reply.likes.push(userId);
  }

  await reply.save();
  res.status(StatusCodes.OK).json({ reply });
};

// Update comment
export const updateArticleComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  const comment = await ArticleComment.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to update this comment");
  }

  comment.content = content;
  comment.editedAt = new Date();
  await comment.save();

  res.status(StatusCodes.OK).json({ comment });
};

// Update reply
export const updateArticleReply = async (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  const reply = await ArticleReply.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to update this reply");
  }

  reply.content = content;
  reply.editedAt = new Date();
  await reply.save();

  res.status(StatusCodes.OK).json({ reply });
};
