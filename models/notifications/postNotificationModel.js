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
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
    answerCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnswerComment',
    },
    answerReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnswerReply',
    },
    postCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    postReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
    articleCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    articleReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'reply', 'commentLiked', 'replyLiked',
       "answered", "answerLiked","answerCommentLiked","answerCommentReplyLiked","answerComment" ,"answerReply",
       "articleLiked", "articleCommentLiked", "articleCommentReplyLiked","articleComment","articleReply",
      ],
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