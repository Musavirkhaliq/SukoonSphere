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
  patientDetails: {
    name: String,
    age: Number,
    gender: String,
    contactNumber: String,
  },
  therapistDetails: {
    name: String,
    contactNumber: String,
    specialties: [String],
    credentials: String,
  },

  basicDetails: {
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["In-person", "Video", "Phone"],
      required: true,
    },
    sessionNumber: {
      type: String,
      required: true,
    },
  },
  currentStatus: {
    moodAffect: {
      type: String,
    },
    energyLevels: {
      type: String,
    },
    sleepPatterns: {
      type: String,
    },
    appetiteChanges: {
      type: String,
    },
    recentEvents: [String],
    selfReportedConcerns: String,
    medication: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        adherence: String,
      },
    ],
    physicalHealth: String,
    substanceUse: String,
  },
  sessionSummary: {
    topicsDiscussed: [String],
    insightsBreakthroughs: String,
    emotionalResponses: [String],
    techniquesUsed: [String],
    engagementLevel: String,
    notableQuotes: [String],
  },
  therapistObservations: {
    behavior: String,
    cognitivePatterns: String,
    emotionalReactions: String,
    progress: String,
    concerns: String,
  },
  actionPlan: {
    goals: [String],
    homework: [String],
    copingStrategies: [String],
    lifestyleAdjustments: [String],
    resourcesShared: [String],
  },
  therapistNotes: {
    keyTakeaways: String,
    risksConcerns: String,
    additionalSupport: String,
    readiness: String,
    ethicalConsiderations: String,
  },
  prescriptions: [
    {
      medication: String,
      dosage: String,
      frequency: String,
      duration: String,
      changes: String,
    },
  ],
  referrals: [
    {
      specialist: String,
      reason: String,
    },
  ],
  labTests: [String],
  followUp: {
    nextSession: Date,
  },
  patientFeedback: {
    selfReflection: String,
    rating: Number,
    progressPerception: String,
    openFeedback: String,
    emotionalStatePost: String,
    suggestions: String,
  },
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("Prescription", prescriptionSchema);
