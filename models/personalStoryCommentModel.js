import mongoose from "mongoose";

const personalStoryCommentSchema = new mongoose.Schema(
  {
    storyUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalStory",
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
        ref: "PersonalStoryReply",
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    realCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PersonalStoryComment", personalStoryCommentSchema);
