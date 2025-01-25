import mongoose from "mongoose";

const AnswerReplySchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QaComment",
      required: true
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnswerReply"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    editedAt: {
      type: Date,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AnswerReply", AnswerReplySchema);
