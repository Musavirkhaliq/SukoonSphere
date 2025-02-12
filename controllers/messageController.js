import Message from "../models/chats/messageModel.js";
import Chat from "../models/chats/chatModel.js";

 
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const sender = req.user.id;

    const message = new Message({ chatId, sender, content });
    await message.save();

    // Update chat's lastMessage and updatedAt
    await Chat.findByIdAndUpdate(chatId, { 
      lastMessage: content, 
      updatedAt: Date.now() 
    });

    res.status(201).json(message);
  } 

export const getMessages = async (req, res) => {
  const messages = await Message.find({ chatId: req.params.chatId })
 
    .populate("sender", "name avatar") // Get sender details
    .sort({ timestamp: 1 }); // Oldest first

  res.status(200).json(messages);
};

