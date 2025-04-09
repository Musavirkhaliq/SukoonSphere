import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
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
} from '../controllers/roomController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up storage for room images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './public/rooms';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `room-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  }
});

const router = express.Router();

// Room CRUD operations
router.post('/', authenticateUser, upload.single('image'), createRoom);
router.get('/', authenticateUser, getUserRooms);
router.get('/public', authenticateUser, getPublicRooms);
router.get('/:roomId', authenticateUser, getRoomById);
router.patch('/:roomId', authenticateUser, upload.single('image'), updateRoom);
router.delete('/:roomId', authenticateUser, deleteRoom);

// Room membership operations
router.post('/:roomId/join', authenticateUser, joinRoom);
router.post('/:roomId/leave', authenticateUser, leaveRoom);
router.post('/:roomId/invite', authenticateUser, inviteToRoom);
router.patch('/:roomId/members/:memberId/role', authenticateUser, changeMemberRole);
router.delete('/:roomId/members/:memberId', authenticateUser, removeMember);
router.post('/:roomId/join-requests/:userId', authenticateUser, handleJoinRequest);
router.get('/join-requests/pending', authenticateUser, getPendingJoinRequests);

export default router;
