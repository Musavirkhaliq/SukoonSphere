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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
