import mongoose from "mongoose";

const personalStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
        ref: "PersonalStoryComment",
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
    deleted: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PersonalStory", personalStorySchema);
