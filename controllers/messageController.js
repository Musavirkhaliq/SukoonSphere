// controllers/messageController.js
import Message from "../models/chats/messageModel.js";
import Chat from "../models/chats/chatModel.js";
import { io } from "../server.js";
import userModel from "../models/userModel.js";
import { checkFileType } from "../utils/chats.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user.userId;
    const files = req.files || [];

    const attachments = files.map((file) => ({
      fileType: checkFileType(file),
      filePath: `/public/chats/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    }));

    const message = new Message({
      chatId,
      sender,
      content,
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

    // Update chat's lastMessage and updatedAt
    const chat = await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    // Get receiver ID
    const receiverId = chat.participants.find(
      (id) => id.toString() !== sender.toString()
    );

    // Emit to both sender and receiver
    io.to(receiverId.toString()).emit("newMessage", populatedMessage);
    io.to(sender.toString()).emit("newMessage", populatedMessage);

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

    const updatedMessages = await Message.updateMany(
      { chatId, seen: false, sender: { $ne: userId } },
      { $set: { seen: true } }
    );

    if (updatedMessages.modifiedCount > 0) {
      const chat = await Chat.findById(chatId);
      const senderId = chat.participants.find(
        (id) => id.toString() !== userId.toString()
      );
      io.to(senderId.toString()).emit("messagesSeen", { chatId });
    }

    res.status(200).json({ success: true });
  } catch (error) {
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