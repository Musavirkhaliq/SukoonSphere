import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError, BadRequestError,UnauthorizedError } from "../errors/customErors.js";
import Prescription from "../models/prescriptionModel.js";

export const createPrescription = async (req, res) => {
    const { userId: doctorId } = req.user;
    const { patientId } = req.params;
    if (req.user.role !== 'contributor') {
        throw new UnauthenticatedError("Unauthorized");
    }
    const prescription = new Prescription({
        doctorId,
        patientId,
        ...req.body
    });
    await prescription.save();
    res.status(StatusCodes.CREATED).json({ message: 'Prescription created', prescription });
};

export const getPrescriptionByDoctorId = async (req, res) => {
    const { userId: doctorId } = req.user;
    if (req.user.role !== 'contributor') {
        throw new UnauthorizedError("Unauthorized");
    }
    const prescriptions = await Prescription.find({ doctorId });
    res.status(StatusCodes.OK).json({ prescriptions });
};

export const getPrescriptionByPatientId = async (req, res) => {
    const { userId: patientId } = req.user;
    if (req.user.role !== 'user') {
        throw new UnauthorizedError("Unauthorized");
    }
    const prescriptions = await Prescription.find({ patientId });
    res.status(StatusCodes.OK).json({ prescriptions });
};

export const SinglePrescription = async (req, res) => {
    const { id: prescriptionId } = req.params;
    const {userId, role} = req.user;
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
        throw new BadRequestError("Prescription not found");
    }
    if(userId !== prescription.doctorId && role !== 'contributor' && userId !== prescription.patientId && role !== 'user') {
        throw new UnauthorizedError("Unauthorized");
    }
    res.status(StatusCodes.OK).json({ prescription });
};