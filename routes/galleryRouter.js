import express from "express";
import { 
  getUserImages,
  addImage,
  deleteImage
} from "../controllers/galleryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

// Public routes
router.get("/user/:userId", getUserImages);

// Protected routes
router.post("/", authenticateUser, upload.single("image"), addImage);
router.delete("/:id", authenticateUser, deleteImage);

export default router;
