import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
  getRoomMessages,
  sendRoomMessage,
  deleteRoomMessage,
  markMessagesAsSeen
} from '../controllers/roomMessageController.js';
import multer from 'multer';

// Set up storage for message attachments
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: function (req, file, cb) {
    // Allow images, documents, and common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Unsupported file type"));
  }
});

const router = express.Router();

// Room message routes
router.get('/:roomId', authenticateUser, getRoomMessages);
router.post('/:roomId', authenticateUser, upload.array('files', 5), sendRoomMessage);
router.delete('/:roomId/messages/:messageId', authenticateUser, deleteRoomMessage);
router.patch('/:roomId/seen', authenticateUser, markMessagesAsSeen);

export default router;
