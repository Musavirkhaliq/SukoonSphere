import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import ChatbotConversation from "../models/chatbot/chatbotConversationModel.js";
dotenv.config();

// Initialize the Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model (Gemini-1.5-flash is a good balance of speed and quality)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Maximum number of messages to include for context
const MAX_CONTEXT_MESSAGES = 15;

// Function to handle chat messages
export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let conversation;
    let chatHistory = [];

    // If user is authenticated, retrieve or create their conversation
    if (userId) {
      conversation = await ChatbotConversation.findOrCreateConversation(userId);
      chatHistory = conversation.getRecentMessages(MAX_CONTEXT_MESSAGES);
    } else {
      // For non-authenticated users, use the provided chat history from the request
      chatHistory = req.body.chatHistory || [];
    }

    // Format the chat history for Gemini API
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Start a chat with the history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Send the message to the model
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const responseText = response.text();

    // If user is authenticated, save the conversation to the database
    if (userId && conversation) {
      // Add user message
      await conversation.addMessage("user", message);
      // Add bot response
      await conversation.addMessage("bot", responseText);
    }

    // Return the response
    return res.status(200).json({
      response: responseText,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    // Handle specific API errors
    if (error.message?.includes("API key")) {
      return res.status(401).json({ error: "Invalid API key. Please check your configuration." });
    }

    // Handle rate limiting
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }

    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

// Function to get chat history for a user
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the user's active conversation
    const conversation = await ChatbotConversation.findOne({
      userId,
      isActive: true
    }).sort({ lastUpdated: -1 });

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Failed to retrieve chat history" });
  }
};

// Function to start a new conversation
export const startNewConversation = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Create a new conversation
    const newConversation = await ChatbotConversation.startNewConversation(userId);

    return res.status(201).json({
      message: "New conversation started",
      conversationId: newConversation._id,
    });
  } catch (error) {
    console.error("Error starting new conversation:", error);
    return res.status(500).json({ error: "Failed to start new conversation" });
  }
};

// Function to handle streaming chat messages (for future implementation)
export const handleStreamingChatMessage = async (req, res) => {
  // This will be implemented in the future for streaming responses
  res.status(501).json({ error: "Streaming not yet implemented" });
};

// Function to get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find all conversations for the user, sorted by last updated
    const conversations = await ChatbotConversation.find({
      userId
    }).sort({ lastUpdated: -1 }).limit(20); // Limit to 20 most recent conversations

    // Format the conversations for the frontend
    const formattedConversations = conversations.map(conv => {
      // Get the first user message as the title, if available
      const firstUserMessage = conv.messages.find(msg => msg.sender === 'user');
      const lastMessage = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

      return {
        _id: conv._id,
        title: firstUserMessage ?
          (firstUserMessage.text.length > 30 ? firstUserMessage.text.substring(0, 30) + '...' : firstUserMessage.text) :
          'New Conversation',
        lastMessage: lastMessage ?
          (lastMessage.text.length > 50 ? lastMessage.text.substring(0, 50) + '...' : lastMessage.text) :
          '',
        updatedAt: conv.lastUpdated,
        isActive: conv.isActive,
        messageCount: conv.messages.length
      };
    });

    return res.status(200).json({
      conversations: formattedConversations
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ error: "Failed to retrieve conversations" });
  }
};

// Function to get messages for a specific conversation
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Find the specific conversation
    const conversation = await ChatbotConversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    return res.status(200).json({
      messages: conversation.messages,
      conversationId: conversation._id,
      isActive: conversation.isActive
    });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return res.status(500).json({ error: "Failed to retrieve conversation messages" });
  }
};
