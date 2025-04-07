import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import { trackContentView } from "../middleware/activityTrackingMiddleware.js";
import upload from "../middleware/multer.js";

import { getUserVideos,
    getSingleVideo,
    deleteVideo,
    updateVideo,
    createVideo,
    getAllVideos,
    getSingleVideos,
    getPlaylistVideos }
     from "../controllers/videoController.js";

import {
    trackVideoProgress,
    getUserVideoHistory,
    getInProgressVideos,
    getVideoRecommendations
} from "../controllers/videoTrackingController.js";

const router = Router();

// Video CRUD operations
router.post("/create-video", authenticateUser, upload.single('coverImage'), createVideo);
router.get("/user-videos", authenticateUser, getUserVideos);
router.get("/video/:id", optionalAuthenticateUser, trackContentView, getSingleVideo);
router.patch("/update-video/:id", authenticateUser, upload.single('coverImage'), updateVideo);
router.delete("/delete-video/:id", authenticateUser, deleteVideo);
router.get("/all-videos", getAllVideos);
router.get("/single-videos", getSingleVideos);
router.get("/playlist-videos", getPlaylistVideos);

// Video tracking and recommendations
router.post("/track-progress", authenticateUser, trackVideoProgress);
router.get("/watch-history", authenticateUser, getUserVideoHistory);
router.get("/in-progress", authenticateUser, getInProgressVideos);
router.get("/recommendations", authenticateUser, getVideoRecommendations);

export default router;
