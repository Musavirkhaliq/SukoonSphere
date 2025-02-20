// models/chats/messageModel.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String },
    seen: { type: Boolean, default: false },
    hasAttachment: { type: Boolean, default: false },
    attachments: [{
      fileType: { type: String, enum: ['image', 'video', 'audio', 'document', 'other'] },
      filePath: { type: String },
      fileName: { type: String },
      fileSize: { type: Number },
      mimeType: { type: String }
    }]
  },
  { timestamps: true }
);

messageSchema.index({ content: "text" });

export default mongoose.model("Message", messageSchema);