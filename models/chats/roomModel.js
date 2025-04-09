import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member"
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    pendingMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        invitedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    joinRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        requestedAt: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending"
        }
      }
    ],
    lastMessage: {
      type: String
    },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    lastMessageTime: {
      type: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

// Create indexes for better performance
roomSchema.index({ name: "text", description: "text" });
roomSchema.index({ isPublic: 1 });
roomSchema.index({ "members.user": 1 });
roomSchema.index({ createdBy: 1 });
roomSchema.index({ updatedAt: -1 });

export default mongoose.model("Room", roomSchema);
