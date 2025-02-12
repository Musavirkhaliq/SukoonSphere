import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthorizedError } from "../errors/customErors.js";
import User from "../models/userModel.js";
import { io } from "../server.js";
import Chat from "../models/chats/chatModel.js";


export const startChat = async (req, res) => {
  const { _userId } = req.body; // The user to chat with
  const { userId } = req.user;  // The current/active user

    let chat = await Chat.findOne({
      participants: { $all: [userId, _userId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [userId, _userId] });
      await chat.save();
    }

    res.status(StatusCodes.OK).json(chat);
};


export const getUserChats = async (req, res) => {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "name avatar") // Get user details
      .sort({ updatedAt: -1 });

    res.status(StatusCodes.OK).json(chats);
};

