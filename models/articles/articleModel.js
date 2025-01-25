import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // views: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "User",
    //   default: [],
    // },
    deleted: {
      default: false,
      type: Boolean,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticleComment",
      },
    ],
    // status: {
    //   type: String,
    //   default: "pending",
    //   enum: ["pending", "published"],
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", ArticleSchema);
