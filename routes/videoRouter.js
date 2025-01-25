import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
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

const router = Router();

router.post("/create-video", authenticateUser, upload.single('coverImage'), createVideo);
router.get("/user-videos", authenticateUser, getUserVideos);
router.get("/video/:id", getSingleVideo);
router.patch("/update-video/:id", authenticateUser, upload.single('coverImage'), updateVideo);
router.delete("/delete-video/:id", authenticateUser, deleteVideo);
router.get("/all-videos", getAllVideos);
router.get("/single-videos", getSingleVideos);
router.get("/playlist-videos", getPlaylistVideos);

export default router;
