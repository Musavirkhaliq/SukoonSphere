// controllers/messageController.js
import Message from "../models/chats/messageModel.js";
import Chat from "../models/chats/chatModel.js";
import { io, openChats } from "../server.js";
import userModel from "../models/userModel.js";
import PostNotification from "../models/notifications/postNotificationModel.js";
import { checkFileType } from "../utils/chats.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user.userId;
    const files = req.files || [];

    const attachments = files.map((file) => {
      // Check if this is a voice message
      const isVoiceMessage = file.originalname.includes('voice-message') ||
                           file.originalname.endsWith('.webm') ||
                           file.mimetype.includes('webm');

      // Set appropriate content for voice messages
      let messageContent = content;
      if (isVoiceMessage && content === 'Voice message') {
        messageContent = '🎤 Voice message';
      }

      return {
        fileType: checkFileType(file),
        filePath: `/public/chats/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        isVoiceMessage: isVoiceMessage
      };
    });

    // Set appropriate content for voice messages
    let messageContent = content;
    if (attachments.some(att => att.isVoiceMessage) && content === 'Voice message') {
      messageContent = '🎤 Voice message';
    }

    const message = new Message({
      chatId,
      sender,
      content: messageContent,
      seen: false,
      hasAttachment: files.length > 0,
      attachments: attachments,
    });

    await message.save();

    // Populate sender information before emitting
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name avatar"
    );

    // Update chat's lastMessage, lastMessageSender, and updatedAt
    const chat = await Chat.findById(chatId);

    // Check if the chat exists
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Get receiver ID
    const receiverId = chat.participants.find(
      (id) => id.toString() !== sender.toString()
    );

    // Check if the receiver has the chat open
    const isChatOpen = openChats.has(receiverId.toString()) &&
                      openChats.get(receiverId.toString()).has(chatId.toString());

    // Update chat with new message info
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: messageContent,
      lastMessageSender: sender,
      updatedAt: Date.now(),
      // Set hasUnreadMessages to true only if the chat is not open for the receiver
      hasUnreadMessages: !isChatOpen,
      // Increment totalUnreadMessages only if the chat is not open for the receiver
      $inc: { totalUnreadMessages: isChatOpen ? 0 : 1 }
    });

    // Emit to both sender and receiver, but only create notification for receiver
    io.to(receiverId.toString()).emit("newMessage", populatedMessage);
    io.to(sender.toString()).emit("messageSent", populatedMessage); // Different event for sender

    // Only create a notification if the chat is not open
    if (!isChatOpen) {
      await createChatNotification(sender, receiverId, chatId, messageContent);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// Other controller methods remain the same...
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;//logged user
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  const messages = await Message.find({
    chatId,
    deletedBy: { $ne: userId },
  }).populate("sender", "name avatar");
  const receiverId = chat.participants.find(
    (id) => id.toString() !== userId.toString()
  );
  const receiver = await userModel
    .findById(receiverId)
    .select("name avatar _id");

  res.status(200).json({ messages, receiver, chat });
};
export const totalUnseenMessages = async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ count: 0 });
  }
  const { userId } = req.user;

  const unseenMessages = await Message.aggregate([
    {
      $lookup: {
        from: "chat", // Joining with the Chat collection
        localField: "chatId",
        foreignField: "_id",
        as: "chatDetails",
      },
    },
    { $unwind: "$chatDetails" },
    {
      $match: {
        "chatDetails.participants": userId, // Ensuring user is a participant
        seen: false, // Only unseen messages
        sender: { $ne: userId }, // Excluding user's own messages
      },
    },
    {
      $count: "total",
    },
  ]);

  res.status(200).json({ count: unseenMessages[0]?.total || 0 });
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    // Find the chat to verify it exists and the user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user is a participant in the chat
    if (!chat.participants.some(id => id.toString() === userId)) {
      return res.status(403).json({ message: "You are not a participant in this chat" });
    }

    // Mark messages as seen
    const updatedMessages = await Message.updateMany(
      { chatId, seen: false, sender: { $ne: userId } },
      { $set: { seen: true } }
    );

    // Also mark chat notifications as seen
    await PostNotification.updateMany(
      {
        userId: userId,
        chatId: chatId,
        type: 'requestChat',
        seen: false
      },
      { $set: { seen: true } }
    );

    // Reset unread message counters in the chat
    await Chat.findByIdAndUpdate(chatId, {
      hasUnreadMessages: false,
      totalUnreadMessages: 0
    });

    // Get the other participant's ID
    const otherParticipantId = chat.participants.find(
      (id) => id.toString() !== userId.toString()
    );

    // Emit messagesSeen event even if no messages were updated
    // This ensures the UI is updated correctly
    if (otherParticipantId) {
      io.to(otherParticipantId.toString()).emit("messagesSeen", { chatId });
    }

    // Update notification count for the user
    const unreadCount = await PostNotification.countDocuments({
      userId: userId,
      seen: false
    });

    // Emit the updated count
    io.to(userId.toString()).emit('notificationCount', unreadCount);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ message: "Failed to mark messages as seen", error });
  }
};

export const deleteAllMessages = async (req, res) => {
  const messages = await Message.find({});

  // Delete associated files
  for (const message of messages) {
    if (message.hasAttachment) {
      for (const attachment of message.attachments) {
        const filePath = path.join("public", attachment.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  }

  await Message.deleteMany({});
  res.status(200).json({ message: "All messages deleted successfully" });
};
export const deleteMessageById = async (req, res) => {
  const { messageId, chatId } = req.params;
  const { userId } = req.user;
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  if (!chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  message.deletedBy.push(userId);
  await message.save();
  res.status(200).json({ message: "Message deleted successfully" });
};

// Helper function to create a chat notification
const createChatNotification = async (senderId, receiverId, chatId, messageContent) => {
  try {
    // Don't create notifications if sender and receiver are the same
    if (senderId.toString() === receiverId.toString()) {
      return null;
    }

    // Create notification message - without sender's name
    let notificationMessage = `New message`;

    // Check if it's a voice message
    if (messageContent.includes('🎤 Voice message')) {
      notificationMessage = `New voice message`;
    }
    // Check if it's an attachment
    else if (messageContent === 'Attachment') {
      notificationMessage = `New attachment`;
    }

    // Create the notification - but don't save it to the database
    // We'll only use it for real-time notification, not for the notification center
    const notification = {
      userId: receiverId,
      chatId: chatId,
      type: 'chatMessage', // Changed type to differentiate from regular notifications
      message: notificationMessage,
      createdBy: senderId,
      seen: false,
      temporary: true // Mark as temporary so it's not shown in the notification center
    };

    // Emit a special chat notification event to the receiver only
    // This will be handled differently from regular notifications
    io.to(receiverId.toString()).emit('chatNotification', {
      notification,
      chatId
    });

    // We don't need to update the notification count since this won't appear in the notification center

    return notification;
  } catch (error) {
    console.error('Error creating chat notification:', error);
    return null;
  }
};

export const deleteAllMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;

  // Check if chat exists and user has access
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Verify user is a participant
  if (!chat.participants.includes(userId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Update all messages in a single operation
  const result = await Message.updateMany(
    {
      chatId,
      deletedBy: { $ne: userId }, // Only update messages not already deleted by this user
    },
    {
      $addToSet: { deletedBy: userId },
    }
  );
  res.status(200).json({
    message: "All messages deleted successfully",
    modifiedCount: result.modifiedCount,
  });
};
export const getTotalUnseenMessages = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(200).json({ count: 0 });
    }

    // Aggregate to count all unseen messages across all chats for this user
    const unseenCount = await Message.aggregate([
      {
        $lookup: {
          from: "chats", // Your Chat collection name
          localField: "chatId",
          foreignField: "_id",
          as: "chat"
        }
      },
      { $unwind: "$chat" },
      {
        $match: {
          "chat.participants": { $in: [new mongoose.Types.ObjectId(userId)] },
          "sender": { $ne: new mongoose.Types.ObjectId(userId) },
          "seen": false,
          "deletedBy": { $ne: new mongoose.Types.ObjectId(userId) }
        }
      },
      {
        $count: "total"
      }
    ]);

    const total = unseenCount.length > 0 ? unseenCount[0].total : 0;

    res.status(200).json({ count: total });
  } catch (error) {
    console.error("Error getting total unseen messages:", error);
    res.status(500).json({
      message: "Failed to get total unseen messages",
      error: error.message
    });
  }
};