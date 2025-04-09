import { StatusCodes } from "http-status-codes";
import RoomMessage from "../models/chats/roomMessageModel.js";
import Room from "../models/chats/roomModel.js";
import { io, openRooms } from "../server.js";
import path from "path";
import fs from "fs";
import multer from "multer";

// Get messages for a room
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    const { page = 1, limit = 50 } = req.query;
    
    // Check if room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }
    
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (!isMember && !room.isPublic) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a member of this room" });
    }
    
    // Get messages with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await RoomMessage.find({ roomId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("sender", "name avatar")
      .populate("seenBy.user", "name avatar");
    
    // Mark messages as seen
    const unseenMessages = messages.filter(
      message => 
        message.sender.toString() !== userId && 
        !message.seenBy.some(seen => seen.user.toString() === userId)
    );
    
    if (unseenMessages.length > 0) {
      await Promise.all(
        unseenMessages.map(message => 
          RoomMessage.findByIdAndUpdate(
            message._id,
            { $addToSet: { seenBy: { user: userId } } }
          )
        )
      );
    }
    
    // Return messages in chronological order
    res.status(StatusCodes.OK).json({
      messages: messages.reverse(),
      totalPages: Math.ceil(await RoomMessage.countDocuments({ roomId, isDeleted: false }) / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("Error getting room messages:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get messages" });
  }
};

// Send a message to a room
export const sendRoomMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;
    
    // Check if room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }
    
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (!isMember) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a member of this room" });
    }
    
    // Handle file uploads if any
    const attachments = [];
    if (req.files && req.files.length > 0) {
      // Create directory if it doesn't exist
      const dir = './public/room-messages';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Process each file
      for (const file of req.files) {
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const filePath = path.join(dir, fileName);
        
        // Move file to destination
        fs.writeFileSync(filePath, file.buffer);
        
        // Determine file type
        const isImage = file.mimetype.startsWith('image/');
        
        // Add to attachments
        attachments.push({
          type: isImage ? 'image' : 'file',
          url: `/public/room-messages/${fileName}`,
          name: file.originalname,
          size: file.size
        });
      }
    }
    
    // Create message
    const message = new RoomMessage({
      roomId,
      sender: userId,
      content: content || "",
      attachments,
      seenBy: [{ user: userId }]
    });
    
    await message.save();
    
    // Update room with last message info
    room.lastMessage = content || (attachments.length > 0 ? "Sent an attachment" : "");
    room.lastMessageSender = userId;
    room.lastMessageTime = new Date();
    await room.save();
    
    // Populate sender info
    const populatedMessage = await RoomMessage.findById(message._id)
      .populate("sender", "name avatar")
      .populate("seenBy.user", "name avatar");
    
    // Notify all room members
    for (const member of room.members) {
      const memberId = member.user.toString();
      
      // Check if user has the room open
      const isRoomOpen = openRooms.has(memberId) && openRooms.get(memberId).has(roomId);
      
      io.to(memberId).emit("newRoomMessage", {
        roomId,
        message: populatedMessage,
        isRoomOpen
      });
    }
    
    res.status(StatusCodes.CREATED).json(populatedMessage);
  } catch (error) {
    console.error("Error sending room message:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to send message" });
  }
};

// Delete a message
export const deleteRoomMessage = async (req, res) => {
  try {
    const { roomId, messageId } = req.params;
    const { userId } = req.user;
    
    // Find the message
    const message = await RoomMessage.findById(messageId);
    if (!message || message.roomId.toString() !== roomId) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });
    }
    
    // Check if user is the sender or an admin
    const room = await Room.findById(roomId);
    const isAdmin = room.members.some(
      member => member.user.toString() === userId && member.role === "admin"
    );
    
    if (message.sender.toString() !== userId && !isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You cannot delete this message" });
    }
    
    // Soft delete the message
    message.isDeleted = true;
    message.content = "This message was deleted";
    message.attachments = [];
    await message.save();
    
    // Notify all room members
    for (const member of room.members) {
      const memberId = member.user.toString();
      io.to(memberId).emit("roomMessageDeleted", {
        roomId,
        messageId
      });
    }
    
    res.status(StatusCodes.OK).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting room message:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete message" });
  }
};

// Mark messages as seen
export const markMessagesAsSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    
    // Check if room exists and user is a member
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }
    
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (!isMember && !room.isPublic) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a member of this room" });
    }
    
    // Mark all unseen messages as seen
    await RoomMessage.updateMany(
      { 
        roomId,
        sender: { $ne: userId },
        "seenBy.user": { $ne: userId },
        isDeleted: false
      },
      { $addToSet: { seenBy: { user: userId, seenAt: new Date() } } }
    );
    
    res.status(StatusCodes.OK).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to mark messages as seen" });
  }
};

export default {
  getRoomMessages,
  sendRoomMessage,
  deleteRoomMessage,
  markMessagesAsSeen
};
