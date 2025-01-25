import mongoose from "mongoose";

const articleCommentSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    editedAt: {
      type: Date,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticleReply",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ArticleComment", articleCommentSchema);
