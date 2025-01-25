import { Router } from "express";
const router = Router();
import {
  createPodcast,
  getAllPodcasts,
  getSinglePodcast,
  createPodcastPlaylist,
  getAllPlaylistPodcasts,
  getAllSinglePodcasts,
  getUserSinglePodcasts,
  getUserPlaylistPodcasts,
  deletePodcast,
  getPlaylistPodcast,
  editPodcast,
  editPodcastPlaylist,
  deletePodcastPlaylist
} from "../controllers/podcastsController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadPodcastFiles } from "../middleware/podcastUploadMiddleware.js";

// Create a new podcast
router.post(
  "/",
  authenticateUser,
  uploadPodcastFiles,
  createPodcast
);

// Create a new podcast playlist
router.post(
  "/playlist",
  authenticateUser,
  uploadPodcastFiles,
  createPodcastPlaylist
);

// Get all podcasts
router.get("/", getAllPodcasts);

//1 Get all single podcasts   sartaj-shahid   for all podcasts that are singel {list]}
router.get("/singles", getAllSinglePodcasts);

// 3 Get all playlist podcasts  sartaj-shahid   for all podcasts that are playlist {list]}
router.get("/playlists", getAllPlaylistPodcasts);

// Get user's single podcasts for a specific user
router.get("/user/:userId/singles", getUserSinglePodcasts);

// Get user's playlist podcasts for a specific user 
router.get("/user/:userId/playlists", getUserPlaylistPodcasts);

// Get a single playlist by ID
router.get("/playlist/:id", getPlaylistPodcast);

//2,5 Get a single podcast by ID
router.get("/:id", getSinglePodcast);

//4 Get a playlist podcast with episodes by ID(playlistId)
router.get("/playlists/:id", getPlaylistPodcast);

// Delete a podcast by ID
router.delete("/:id", authenticateUser, deletePodcast);

// Delete a podcast playlist and its episodes
router.delete('/playlist/:id', authenticateUser, deletePodcastPlaylist);

// Edit a podcast by ID
router.patch("/:id", authenticateUser, uploadPodcastFiles, editPodcast);

// Edit a podcast playlist by ID
router.patch('/playlist/:id', authenticateUser, uploadPodcastFiles, editPodcastPlaylist);

export default router;  