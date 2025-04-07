import mongoose from "mongoose";

const videoPlaylistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    category: {
      type: String,
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    // For tracking popularity
    viewCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
videoPlaylistSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("VideoPlaylist", videoPlaylistSchema);
