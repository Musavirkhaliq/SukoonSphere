import mongoose from "mongoose";

const videoReactionSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "love", "helpful", "insightful"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only have one reaction type per video
videoReactionSchema.index({ video: 1, user: 1 }, { unique: true });

export default mongoose.model("VideoReaction", videoReactionSchema);
