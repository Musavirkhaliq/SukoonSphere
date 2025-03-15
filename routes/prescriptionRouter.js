import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createPrescription,
  getPrescriptionByDoctorId,
  getPrescriptionByPatientId,
  SinglePrescription,
  deleteAllPrescriptions,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/:patientId", authenticateUser, createPrescription);
router.get("/doctor", authenticateUser, getPrescriptionByDoctorId);
router.get("/patient/:patientId", authenticateUser, getPrescriptionByPatientId);
router.get("/:id", authenticateUser, SinglePrescription);
router.delete("/", deleteAllPrescriptions);

export default router;
