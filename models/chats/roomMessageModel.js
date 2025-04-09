import mongoose from "mongoose";

const roomMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ["image", "file"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],
    seenBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create indexes for better performance
roomMessageSchema.index({ roomId: 1, createdAt: -1 });
roomMessageSchema.index({ sender: 1 });
roomMessageSchema.index({ "seenBy.user": 1 });

export default mongoose.model("RoomMessage", roomMessageSchema);
