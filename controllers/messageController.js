import Message from "../models/chats/messageModel.js";
import Chat from "../models/chats/chatModel.js";
import { io } from "../server.js";
import userModel from "../models/userModel.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user.userId;

    const message = new Message({ chatId, sender, content, seen: false });
    await message.save();

    // Update chat's lastMessage and updatedAt
    const chat = await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    // Get receiver ID
    const receiverId = chat.participants.find(
      (id) => id.toString() !== sender.toString()
    );

    // Emit new message to receiver
    // io.to(receiverId.toString()).emit("newMessage", {message});
    for (const participantId of chat.participants) {
      io.to(participantId.toString()).emit("newMessage", { message });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// Get All Messages by Chat ID
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    // Get messages & populate sender info
    const messages = await Message.find({ chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    // Get receiver details
    const chat = await Chat.findById(chatId);
    const receiverId = chat.participants.find(
      (id) => id.toString() !== userId.toString()
    );
    const receiver = await userModel
      .findById(receiverId)
      .select("name avatar _id");

    // Mark messages as seen
    await Message.updateMany(
      { chatId, seen: false, sender: { $ne: userId } },
      { $set: { seen: true } }
    );

    // Emit event to sender that messages are seen
    io.to(receiverId.toString()).emit("messagesSeen", { chatId });

    res.status(200).json({ messages, receiver });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};

// Mark Messages as Seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { chatId } = req.body;
    const { userId } = req.user;

    await Message.updateMany(
      { chatId, seen: false, sender: { $ne: userId } },
      { $set: { seen: true } }
    );

    // Notify sender that messages were seen
    const chat = await Chat.findById(chatId);
    const senderId = chat.participants.find(
      (id) => id.toString() !== userId.toString()
    );
    io.to(senderId.toString()).emit("messagesSeen", { chatId });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark messages as seen", error });
  }
};

export const deleteAllMessages = async (req, res) => {
  await Message.deleteMany({});
  res.status(200).json({ message: "All messages deleted successfully" });
};
