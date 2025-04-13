import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    contentType: {
      type: String,
      enum: [
        "post",
        "comment",
        "reply",
        "video",
        "article",
        "question",
        "answer",
        "answerComment",
        "answerReply",
        "articleComment",
        "articleReply",
        "videoComment",
        "videoReply",
        "personalStory",
        "personalStoryComment",
        "personalStoryReply"
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "heart",
        "haha",
        "wow",
        "support",
        "relate",
        "agree",
        "sad",
        "angry",
        "insightful"
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only have one reaction type per content
reactionSchema.index({ contentId: 1, contentType: 1, user: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
