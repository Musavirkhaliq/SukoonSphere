import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import { trackContentView } from "../middleware/activityTrackingMiddleware.js";
import upload from "../middleware/multer.js";

import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistDetails,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  reorderPlaylistVideos,
  getUserPlaylists
} from "../controllers/videoPlaylistController.js";

const router = Router();

// Playlist CRUD operations
router.post("/create", authenticateUser, upload.single('coverImage'), createPlaylist);
router.get("/all", getAllPlaylists);
router.get("/details/:id", optionalAuthenticateUser, trackContentView, getPlaylistDetails);
router.patch("/update/:id", authenticateUser, upload.single('coverImage'), updatePlaylist);
router.delete("/delete/:id", authenticateUser, deletePlaylist);
router.get("/user", authenticateUser, getUserPlaylists);

// Playlist video management
router.post("/add-video", authenticateUser, addVideoToPlaylist);
router.delete("/:playlistId/remove-video/:videoId", authenticateUser, removeVideoFromPlaylist);
router.patch("/:playlistId/reorder", authenticateUser, reorderPlaylistVideos);

export default router;
