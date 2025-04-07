import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

import {
  addMaterial,
  getVideoMaterials,
  updateMaterial,
  deleteMaterial,
  reorderMaterials
} from "../controllers/videoMaterialController.js";

const router = Router();

// Material CRUD operations
router.post("/add", authenticateUser, upload.single('file'), addMaterial);
router.get("/video/:videoId", getVideoMaterials);
router.patch("/update/:id", authenticateUser, upload.single('file'), updateMaterial);
router.delete("/delete/:id", authenticateUser, deleteMaterial);
router.patch("/reorder/:videoId", authenticateUser, reorderMaterials);

export default router;
