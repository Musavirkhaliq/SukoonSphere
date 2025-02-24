import { StatusCodes } from "http-status-codes";
import Chat from "../models/chats/chatModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import mongoose from "mongoose";
import { io } from "../server.js";

export const startChat = async (req, res) => {
  const { _userId } = req.body;
  const { userId } = req.user;

  let chat = await Chat.findOne({
    participants: { $all: [userId, _userId] },
  });

  if (!chat) {
    chat = new Chat({ participants: [userId, _userId] ,createdBy:userId });
    await chat.save();
    const notification = new Notification({
      message: `You have a new chat request`,
      createdBy: userId,
      userId: _userId,
      chatDisabled: true,
      type: "requestChat",
      chatId: chat._id,
    });
    await notification.save();
    io.to(_userId).emit("notification", notification);
  }

  res.status(StatusCodes.OK).json(chat);
};
export const acceptChatRequest = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.user;

  const chat = await Chat.findOne({
    _id: chatId,
  });
  if (!chat) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Chat not found" });
  }
  if (chat.createdBy.toString() === userId.toString()) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: chatId,
    },
    {
      $set: { disabled: false },
    },
    { new: true }
  );
  if (!updatedChat) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Chat not found" });
  }
  const notification = await Notification.findOneAndUpdate(
    {
      chatId: chatId,
    },
    {
      $set: { chatDisabled: false },
    },
    { new: true }
  );
  if (!notification) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Notification not found" });
  }

  res.status(StatusCodes.OK).json(updatedChat);
};


export const getUserChats = async (req, res) => {
    try {
      const { userId } = req.user;
      const { search } = req.query; // Get the search query from request
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)  
          .json({ message: "Invalid user ID" });
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
                  sender: { $ne: objectIdUserId },
                },
              },
              { $count: "unreadCount" },
            ],
            as: "unreadMessages",
          },
        },
        {
          $addFields: {
            totalUnreadMessages: {
              $ifNull: [{ $arrayElemAt: ["$unreadMessages.unreadCount", 0] }, 0],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, name: 1, avatar: 1 } }, // Fetch only required fields
            ],
            as: "participants",
          },
        },
        {
          $addFields: {
            participantsNames: {
              $map: {
                input: "$participants",
                as: "participant",
                in: "$$participant.name",
              },
            },
          },
        },
        ...(search
          ? [
              { 
                $match: {
                  participantsNames: {
                    $regex: search,
                    $options: "i",
                  },
                },
              },
            ]
          : []),
        { $sort: { updatedAt: -1 } }, // Sort chats by last update
        { $project: { unreadMessages: 0, participantsNames: 0 } }, // Remove unnecessary fields
      ]);
      const currentUser = await User.findById(userId).select("followers following");
      const followedUserIds = [...new Set([...currentUser.followers, ...currentUser.following])];
      let users = [];
    if (search) {
      users = await User.find({
        _id: { $in: followedUserIds }, // Only users who are followers or following
        name: { $regex: search, $options: "i" }, // Apply search filter
      }).select("_id name avatar");
    }
      res.status(StatusCodes.OK).json({ chats, users });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to fetch user chats",
        error: error.message,
      });
    }
  };
  

//   delete chat

export const deleteAllChats = async (req, res) => {
    await Chat.deleteMany({});
    res.status(200).json({ message: "All chats deleted successfully" });
  };
  