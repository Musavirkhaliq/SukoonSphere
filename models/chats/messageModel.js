import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true }, 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

// Text index for search optimization
messageSchema.index({ content: "text" });

export default mongoose.model("Message", messageSchema);
