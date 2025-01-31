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
    type: {
      type: String,
      enum: ['like', 'comment', 'reply', 'commentLiked', 'replyLiked'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostNotification = mongoose.model("PostNotification", postNotificationSchema);

export default PostNotification; // Ensure this line is present