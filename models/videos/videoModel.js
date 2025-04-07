import mongoose from "mongoose";
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["single", "playlist"],
      default: "single",
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    category: {
      type: String,
      trim: true
    },
    // For playlist videos
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null
    },
    // For tracking popularity
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VideoComment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
