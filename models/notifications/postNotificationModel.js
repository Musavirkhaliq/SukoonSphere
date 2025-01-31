import mongoose from "mongoose";

const postNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    postCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    postReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'reply', 'commentLiked', 'replyLiked'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostNotification = mongoose.model("PostNotification", postNotificationSchema);

export default PostNotification; // Ensure this line is present