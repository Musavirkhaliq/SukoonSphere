import { StatusCodes } from "http-status-codes";
import Chat from "../models/chats/chatModel.js";
import Message from "../models/chats/messageModel.js";
import mongoose from "mongoose";



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
    try {
      const { userId } = req.user;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user ID" });
      }
  
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
  
      const chats = await Chat.aggregate([
        { $match: { participants: objectIdUserId } }, // Find chats where user is a participant
        {
          $lookup: {
            from: "messages",
            let: { chatId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$chatId", "$$chatId"] },
                  seen: false,
                  sender: { $ne: objectIdUserId }
                }
              },
              { $count: "unreadCount" }
            ],
            as: "unreadMessages"
          }
        },
        {
          $addFields: {
            totalUnreadMessages: {
              $ifNull: [{ $arrayElemAt: ["$unreadMessages.unreadCount", 0] }, 0]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, avatar: 1 } } // Fetch only required fields
            ],
            as: "participants"
          }
        },
        { $sort: { updatedAt: -1 } }, // Sort chats by last update
        { $project: { unreadMessages: 0 } } // Remove unnecessary field
      ]);
  
      res.status(StatusCodes.OK).json({ chats });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to fetch user chats",
        error: error.message,
      });
    }
  };
  

// export const getUserChats = async (req, res) => {
//     try {
//       const { userId } = req.user;
  
//       const chats = await Chat.find({ participants: userId })
//         .populate("participants", "name avatar") // Get user details
//         .sort({ updatedAt: -1 });
  
//       // Fetch total unread messages for each chat
//       const chatsWithTotalUnreadMessages = await Promise.all(
//         chats.map(async (chat) => {
//           const totalUnreadMessages = await Message.countDocuments({
//             chatId: chat._id,
//             seen: false,
//             sender: { $ne: userId },
//           });
  
//           return {
//             ...chat.toObject(),
//             totalUnreadMessages,
//           };
//         })
//       );
  
//       res.status(200).json({ chats: chatsWithTotalUnreadMessages });
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch user chats", error });
//     }
//   };
  