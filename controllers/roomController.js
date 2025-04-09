import { StatusCodes } from "http-status-codes";
import Room from "../models/chats/roomModel.js";
import RoomMessage from "../models/chats/roomMessageModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notifications/postNotificationModel.js";
import { io } from "../server.js";
import path from "path";
import fs from "fs";

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const createdBy = req.user.userId;

    if (!name.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Room name is required" });
    }

    // Handle image upload if provided
    let imagePath = null;
    if (req.file) {
      imagePath = `/public/rooms/${req.file.filename}`;
    }

    // Create the room
    const room = new Room({
      name,
      description,
      image: imagePath,
      isPublic: isPublic === "true" || isPublic === true,
      members: [{ user: createdBy, role: "admin" }],
      createdBy
    });

    await room.save();

    // Populate creator info
    const populatedRoom = await Room.findById(room._id)
      .populate("members.user", "name avatar")
      .populate("createdBy", "name avatar");

    res.status(StatusCodes.CREATED).json(populatedRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to create room" });
  }
};

// Get all rooms for a user
export const getUserRooms = async (req, res) => {
  try {
    const { userId } = req.user;
    const { search } = req.query;

    // Create base query
    let query = { "members.user": userId };

    // Add search filter if provided
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Find all rooms where user is a member
    const rooms = await Room.find(query)
      .populate("members.user", "name avatar")
      .populate("createdBy", "name avatar")
      .populate("lastMessageSender", "name avatar")
      .sort({ updatedAt: -1 });

    res.status(StatusCodes.OK).json(rooms);
  } catch (error) {
    console.error("Error getting user rooms:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get rooms" });
  }
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId)
      .populate("members.user", "name avatar")
      .populate("pendingMembers.user", "name avatar")
      .populate("pendingMembers.invitedBy", "name avatar")
      .populate("joinRequests.user", "name avatar")
      .populate("createdBy", "name avatar");

    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(member => member.user._id.toString() === userId);
    if (!isMember && !room.isPublic) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a member of this room" });
    }

    res.status(StatusCodes.OK).json(room);
  } catch (error) {
    console.error("Error getting room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get room" });
  }
};

// Update room details
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { name, description, isPublic } = req.body;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is an admin
    const isAdmin = room.members.some(
      member => member.user.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins can update room details" });
    }

    // Update fields
    if (name) room.name = name;
    if (description !== undefined) room.description = description;
    if (isPublic !== undefined) room.isPublic = isPublic === "true" || isPublic === true;

    // Handle image upload if provided
    if (req.file) {
      // Delete old image if exists
      if (room.image) {
        const oldImagePath = path.join(process.cwd(), room.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      room.image = `/public/rooms/${req.file.filename}`;
    }

    await room.save();

    // Populate room data
    const updatedRoom = await Room.findById(roomId)
      .populate("members.user", "name avatar")
      .populate("createdBy", "name avatar");

    res.status(StatusCodes.OK).json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to update room" });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is an admin
    const isAdmin = room.members.some(
      member => member.user.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins can delete rooms" });
    }

    // Delete all messages in the room
    await RoomMessage.deleteMany({ roomId });

    // Delete the room
    await Room.findByIdAndDelete(roomId);

    // Notify all members
    for (const member of room.members) {
      const memberId = member.user.toString();
      if (memberId !== userId) {
        io.to(memberId).emit("roomDeleted", {
          roomId,
          roomName: room.name
        });
      }
    }

    res.status(StatusCodes.OK).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete room" });
  }
};

// Join a room (send join request)
export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is already a member
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (isMember) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "You are already a member of this room" });
    }

    // Check if user already has a pending join request
    const hasJoinRequest = room.joinRequests.some(
      request => request.user.toString() === userId && request.status === "pending"
    );
    if (hasJoinRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "You already have a pending join request for this room" });
    }

    // Check if room is public
    if (!room.isPublic) {
      // Check if user has a pending invitation
      const isPending = room.pendingMembers.some(member => member.user.toString() === userId);
      if (!isPending) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "This room is private. You need an invitation to join." });
      }

      // If user has an invitation, approve them immediately
      // Remove from pending members
      room.pendingMembers = room.pendingMembers.filter(member => member.user.toString() !== userId);

      // Add user to members
      room.members.push({
        user: userId,
        role: "member",
        joinedAt: new Date()
      });

      await room.save();

      // Populate room data
      const updatedRoom = await Room.findById(roomId)
        .populate("members.user", "name avatar")
        .populate("createdBy", "name avatar");

      // Get user info for notification
      const user = await User.findById(userId, "name avatar");

      // Notify all members
      for (const member of room.members) {
        const memberId = member.user.toString();
        if (memberId !== userId) {
          io.to(memberId).emit("roomMemberJoined", {
            roomId,
            roomName: room.name,
            user
          });
        }
      }

      return res.status(StatusCodes.OK).json(updatedRoom);
    }

    // For public rooms, add a join request
    room.joinRequests.push({
      user: userId,
      requestedAt: new Date(),
      status: "pending"
    });

    await room.save();

    // Get user info for notification
    const user = await User.findById(userId, "name avatar");

    // Notify room admins about the join request
    const admins = room.members.filter(member => member.role === "admin");
    for (const admin of admins) {
      const adminId = admin.user.toString();

      // Create notification for admin
      const notification = new Notification({
        userId: adminId,
        type: "roomJoinRequest",
        message: `${user.name} has requested to join the room "${room.name}"`,
        link: `/chats/room/${room._id}`,
        createdBy: userId,
        seen: false
      });

      await notification.save();

      // Emit notification
      io.to(adminId).emit("notification", notification);
      io.to(adminId).emit("roomJoinRequest", {
        roomId,
        roomName: room.name,
        user
      });
    }

    res.status(StatusCodes.OK).json({ message: "Join request sent successfully. Waiting for admin approval." });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to send join request" });
  }
};

// Leave a room
export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (!isMember) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "You are not a member of this room" });
    }

    // Check if user is the only admin
    const isAdmin = room.members.some(member => member.user.toString() === userId && member.role === "admin");
    const adminCount = room.members.filter(member => member.role === "admin").length;

    if (isAdmin && adminCount === 1 && room.members.length > 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You are the only admin. Please promote another member to admin before leaving."
      });
    }

    // Remove user from members
    room.members = room.members.filter(member => member.user.toString() !== userId);

    // If no members left, delete the room
    if (room.members.length === 0) {
      await RoomMessage.deleteMany({ roomId });
      await Room.findByIdAndDelete(roomId);
      return res.status(StatusCodes.OK).json({ message: "Room deleted as you were the last member" });
    }

    await room.save();

    // Get user info for notification
    const user = await User.findById(userId, "name avatar");

    // Notify all members
    for (const member of room.members) {
      const memberId = member.user.toString();
      io.to(memberId).emit("roomMemberLeft", {
        roomId,
        roomName: room.name,
        user
      });
    }

    res.status(StatusCodes.OK).json({ message: "You have left the room" });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to leave room" });
  }
};

// Invite a user to a room
export const inviteToRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    const { invitedUserId } = req.body;

    if (!invitedUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is required" });
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is a member
    const isMember = room.members.some(member => member.user.toString() === userId);
    if (!isMember) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a member of this room" });
    }

    // Check if invited user exists
    const invitedUser = await User.findById(invitedUserId);
    if (!invitedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Invited user not found" });
    }

    // Check if invited user is already a member
    const isAlreadyMember = room.members.some(member => member.user.toString() === invitedUserId);
    if (isAlreadyMember) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User is already a member of this room" });
    }

    // Check if invited user is already invited
    const isAlreadyInvited = room.pendingMembers.some(member => member.user.toString() === invitedUserId);
    if (isAlreadyInvited) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User is already invited to this room" });
    }

    // Add user to pending members
    room.pendingMembers.push({
      user: invitedUserId,
      invitedBy: userId,
      invitedAt: new Date()
    });

    await room.save();

    // Create notification
    const notification = new Notification({
      userId: invitedUserId,
      type: "roomInvitation",
      message: `You have been invited to join the room "${room.name}"`,
      link: `/chats/room/${room._id}`,
      createdBy: userId,
      seen: false
    });

    await notification.save();

    // Emit notification
    io.to(invitedUserId).emit("notification", notification);

    res.status(StatusCodes.OK).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error inviting to room:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to send invitation" });
  }
};

// Get public rooms
export const getPublicRooms = async (req, res) => {
  try {
    const { userId } = req.user;
    const { search } = req.query;

    // Create base query
    let query = {
      isPublic: true,
      "members.user": { $ne: userId }
    };

    // Add search filter if provided
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Find all public rooms where user is not a member
    const publicRooms = await Room.find(query)
      .populate("members.user", "name avatar")
      .populate("createdBy", "name avatar")
      .sort({ updatedAt: -1 });

    res.status(StatusCodes.OK).json(publicRooms);
  } catch (error) {
    console.error("Error getting public rooms:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get public rooms" });
  }
};

// Change member role
export const changeMemberRole = async (req, res) => {
  try {
    const { roomId, memberId } = req.params;
    const { userId } = req.user;
    const { role } = req.body;

    if (!role || !["admin", "member"].includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid role" });
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is an admin
    const isAdmin = room.members.some(
      member => member.user.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins can change member roles" });
    }

    // Find the member
    const memberIndex = room.members.findIndex(member => member.user.toString() === memberId);
    if (memberIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Member not found" });
    }

    // Update member role
    room.members[memberIndex].role = role;
    await room.save();

    // Populate room data
    const updatedRoom = await Room.findById(roomId)
      .populate("members.user", "name avatar")
      .populate("createdBy", "name avatar");

    res.status(StatusCodes.OK).json(updatedRoom);
  } catch (error) {
    console.error("Error changing member role:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to change member role" });
  }
};

// Remove a member from a room
export const removeMember = async (req, res) => {
  try {
    const { roomId, memberId } = req.params;
    const { userId } = req.user;

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if user is an admin
    const isAdmin = room.members.some(
      member => member.user.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins can remove members" });
    }

    // Check if trying to remove an admin
    const memberToRemove = room.members.find(member => member.user.toString() === memberId);
    if (!memberToRemove) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Member not found" });
    }

    if (memberToRemove.role === "admin" && userId !== memberId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Cannot remove another admin" });
    }

    // Remove member
    room.members = room.members.filter(member => member.user.toString() !== memberId);
    await room.save();

    // Notify the removed member
    io.to(memberId).emit("roomMemberRemoved", {
      roomId,
      roomName: room.name
    });

    res.status(StatusCodes.OK).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to remove member" });
  }
};

// Handle join request (approve or reject)
export const handleJoinRequest = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const adminId = req.user.userId;

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid action. Must be 'approve' or 'reject'" });
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Room not found" });
    }

    // Check if admin is a member with admin role
    const isAdmin = room.members.some(
      member => member.user.toString() === adminId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins can handle join requests" });
    }

    // Find the join request
    const requestIndex = room.joinRequests.findIndex(
      request => request.user.toString() === userId && request.status === "pending"
    );

    if (requestIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Join request not found or already processed" });
    }

    // Get user info for notification
    const user = await User.findById(userId, "name avatar");

    if (action === "approve") {
      // Add user to members
      room.members.push({
        user: userId,
        role: "member",
        joinedAt: new Date()
      });

      // Update request status
      room.joinRequests[requestIndex].status = "approved";

      // Create notification for the user
      const notification = new Notification({
        userId: userId,
        type: "roomJoinRequestApproved",
        message: `Your request to join the room "${room.name}" has been approved`,
        link: `/chats/room/${room._id}`,
        createdBy: adminId,
        seen: false
      });

      await notification.save();

      // Emit notification
      io.to(userId).emit("notification", notification);

      // Emit specific event for the user who requested to join
      io.to(userId).emit("roomJoinRequestApproved", {
        roomId,
        roomName: room.name
      });

      // Notify all members about the new member
      for (const member of room.members) {
        const memberId = member.user.toString();
        if (memberId !== userId && memberId !== adminId) {
          io.to(memberId).emit("roomMemberJoined", {
            roomId,
            roomName: room.name,
            user
          });
        }
      }
    } else {
      // Update request status
      room.joinRequests[requestIndex].status = "rejected";

      // Create notification for the user
      const notification = new Notification({
        userId: userId,
        type: "roomJoinRequestRejected",
        message: `Your request to join the room "${room.name}" has been rejected`,
        link: `/chats`,
        createdBy: adminId,
        seen: false
      });

      await notification.save();

      // Emit notification
      io.to(userId).emit("notification", notification);

      // Emit specific event for the user who requested to join
      io.to(userId).emit("roomJoinRequestRejected", {
        roomId,
        roomName: room.name
      });
    }

    await room.save();

    res.status(StatusCodes.OK).json({
      message: `Join request ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error("Error handling join request:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to process join request" });
  }
};

// Get pending join requests for a user
export const getPendingJoinRequests = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find all rooms where the user has a pending join request
    const rooms = await Room.find({
      "joinRequests": {
        $elemMatch: {
          user: userId,
          status: "pending"
        }
      }
    }).select("_id name image isPublic createdBy");

    // Format the response
    const pendingRequests = rooms.map(room => ({
      _id: room._id + '-' + userId, // Create a unique ID for the request
      room: {
        _id: room._id,
        name: room.name,
        image: room.image,
        isPublic: room.isPublic
      },
      status: "pending",
      requestedAt: room.joinRequests.find(req => req.user.toString() === userId)?.requestedAt
    }));

    res.status(StatusCodes.OK).json(pendingRequests);
  } catch (error) {
    console.error("Error getting pending join requests:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get pending join requests" });
  }
};

export default {
  createRoom,
  getUserRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  inviteToRoom,
  getPublicRooms,
  changeMemberRole,
  removeMember,
  handleJoinRequest,
  getPendingJoinRequests
};
