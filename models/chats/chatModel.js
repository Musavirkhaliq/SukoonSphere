import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: { type: String },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    hasUnreadMessages: {
      type: Boolean,
      default: false
    },
    totalUnreadMessages: {
      type: Number,
      default: 0
    },
    disabled:{
      type:Boolean,
      default:true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

export default mongoose.model("Chat", chatSchema);
