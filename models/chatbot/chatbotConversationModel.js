import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }
);

const ChatbotConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [MessageSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Index for faster queries
ChatbotConversationSchema.index({ userId: 1, lastUpdated: -1 });

// Pre-save hook to update lastUpdated timestamp
ChatbotConversationSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to find or create a conversation for a user
ChatbotConversationSchema.statics.findOrCreateConversation = async function (userId) {
  // Find the most recent active conversation for this user
  let conversation = await this.findOne({ 
    userId, 
    isActive: true 
  }).sort({ lastUpdated: -1 });
  
  // If no active conversation exists, create a new one
  if (!conversation) {
    conversation = await this.create({
      userId,
      messages: [],
    });
  }
  
  return conversation;
};

// Method to add a message to the conversation
ChatbotConversationSchema.methods.addMessage = async function (sender, text) {
  this.messages.push({ sender, text });
  this.lastUpdated = new Date();
  await this.save();
  return this;
};

// Method to get recent messages (for context)
ChatbotConversationSchema.methods.getRecentMessages = function (limit = 10) {
  return this.messages.slice(-limit);
};

// Method to start a new conversation (mark current as inactive and create new)
ChatbotConversationSchema.statics.startNewConversation = async function (userId) {
  // Mark existing conversations as inactive
  await this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
  
  // Create a new conversation
  return await this.create({
    userId,
    messages: [],
  });
};

const ChatbotConversation = mongoose.model("ChatbotConversation", ChatbotConversationSchema);

export default ChatbotConversation;
