import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import PostComments from "../models/postCommentsModel.js";
import PostReplies from "../models/postReplyModel.js";
import mongoose from "mongoose";

export const editPostComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  if (!content) {
    throw new BadRequestError('Comment content is required');
  }

  const comment = await PostComments.findById(commentId);
  if (!comment) {
    throw new BadRequestError("Comment not found");
  }

  if (comment.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to edit this comment");
  }

  const updatedComment = await PostComments.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  ).populate('createdBy', 'name avatar');

  res.status(StatusCodes.OK).json({
    message: "Comment updated successfully",
    comment: {
      ...updatedComment.toObject(),
      username: updatedComment.createdBy.name,
      userAvatar: updatedComment.createdBy.avatar,
      totalReplies: updatedComment.replies?.length || 0,
      totalLikes: updatedComment.likes?.length || 0
    }
  });
};

export const editPostCommentReply = async (req, res) => {
  const { id: replyId } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  if (!content) {
    throw new BadRequestError('Reply content is required');
  }

  const reply = await PostReplies.findById(replyId);
  if (!reply) {
    throw new BadRequestError("Reply not found");
  }

  if (reply.createdBy.toString() !== userId) {
    throw new UnauthorizedError("Not authorized to edit this reply");
  }

  const updatedReply = await PostReplies.findByIdAndUpdate(
    replyId,
    { content },
    { new: true }
  )
  .populate('createdBy', 'name avatar')
  .populate('replyTo', 'name avatar');

  res.status(StatusCodes.OK).json({
    message: "Reply updated successfully",
    reply: {
      ...updatedReply.toObject(),
      username: updatedReply.createdBy.name,
      userAvatar: updatedReply.createdBy.avatar,
      commentUsername: updatedReply.replyTo.name,
      commentUserAvatar: updatedReply.replyTo.avatar,
      commentUserId: updatedReply.replyTo._id,
      totalLikes: updatedReply.likes?.length || 0
    }
  });
};
