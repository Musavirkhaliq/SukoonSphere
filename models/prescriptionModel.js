// models/Prescription.js

import mongoose from "mongoose";

const prescriptionSchema = mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  demographicInfo: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    raceEthnicity: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    educationLevel: { type: String },
    socioeconomicStatus: { type: String },
    name: { type: String, required: true },
  },
  presentingSymptoms: [
    {
      description: { type: String },
      severity: { type: String, enum: ["Mild", "Moderate", "Severe"] },
      duration: { type: String },
      impactOnFunctioning: { type: String },
    },
  ],
  psychiatricHistory: {
    pastDiagnoses: [
      {
        diagnosis: { type: String },
        dateDiagnosed: { type: Date },
        diagnosedBy: { type: String },
        symptoms: [{ type: String }],
      },
    ],
    previousTreatments: [{ type: String }],
    treatmentAdherence: { type: String },
    hospitalizations: [{ type: String }],
  },
  familyHistory: {
    mentalHealthDiagnoses: [{ type: String }],
    significantEvents: { type: String },
  },
  socialHistory: {
    livingSituation: { type: String },
    socialSupport: { type: String },
    relationshipDynamics: { type: String },
    employmentStatus: { type: String },
    substanceUse: { type: String },
  },
  stressors: {
    currentStressors: [{ type: String }],
    majorLifeEvents: [{ type: String }],
  },
  copingMechanisms: {
    healthy: [{ type: String }],
    maladaptive: [{ type: String }],
  },
  mentalStatusExam: {
    appearance: { type: String },
    behavior: { type: String },
    speech: { type: String },
    mood: { type: String },
    affect: { type: String },
    thoughtProcess: { type: String },
    thoughtContent: { type: String },
    perceptions: { type: String },
    cognition: { type: String },
    insightJudgment: { type: String },
  },
  culturalConsiderations: { type: String },
  comorbidities: [{ type: String }],
  medications: [
    {
      name: { type: String },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String },
    },
  ],
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Prescription", prescriptionSchema);
