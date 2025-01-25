import mongoose from "mongoose";

const QaCommentSchema = new mongoose.Schema(
  {
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
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
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnswerReply",
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QaComment", QaCommentSchema);
