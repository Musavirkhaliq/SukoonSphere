import Message from "../models/chats/messageModel.js";
import Chat from "../models/chats/chatModel.js";
import { io } from "../server.js";
import userModel from "../models/userModel.js";

 
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const sender = req.user.userId;

    const message = new Message({ chatId, sender, content });
    await message.save();

    // Update chat's lastMessage and updatedAt
    const chat = await Chat.findByIdAndUpdate(chatId, { 
      lastMessage: content, 
      updatedAt: Date.now() 
    });
    const receiverId = chat.participants.find(id => id.toString() !== sender.toString());
    io.to(receiverId.toString()).emit('newMessage', message);
    res.status(201).json(message);
  } 

export const getMessages = async (req, res) => {
    const {chatId} = req.params;
    const {userId} = req.user;
  const messages = await Message.find({ chatId: chatId })
    .populate("sender", "name avatar")
    .sort({ createdAt: 1 });

    // here
    const chat = await Chat.findById(chatId);
    const receiverId = chat.participants.find(id => id.toString() !== userId.toString());
    const receiver = await userModel.findById(receiverId).select("name avatar _id");
    res.status(200).json({messages,receiver});
  } 

export const getActiveUser = async (req, res) => {
  const {chatId} = req.params;
  const {userId} = req.user;
  const chat = await Chat.findById(chatId);
const _id = chat.participants.find(id => id !== userId);
  const activeUser = await userModel.find({_id}).select("name avatar _id");
  res.status(200).json(activeUser);
}
