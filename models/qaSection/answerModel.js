import mongoose from "mongoose";

const Answer = new mongoose.Schema(
  {
    context: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    realCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QaComment",
      },
    ],
    answeredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", 
      required: true,
    },
    editedAt: {
      type: Date,
      default: null
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Answer", Answer);
