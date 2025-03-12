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
    age: Number,
    gender: String,
    contactNumber: String,
    specialties: [String], // e.g., ["CBT", "Trauma"]
    credentials: String, // e.g., "PhD, LMFT"
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
      enum: ["anxious", "calm"],
      required: true,
    },
    energyLevels: {
      type: String,
      enum: ["low", "high"],
      required: true,
    },
    sleepPatterns: {
      type: String,
      required: true,
    },
    appetiteChanges: {
      type: String,
      required: true,
    },
    recentEvents: [String], // e.g., ["Job loss", "Family conflict"]
    selfReportedConcerns: String, // e.g., "Struggling with work stress"
    medication: [
      {
        name: String, // e.g., "Sertraline"
        dosage: String, // e.g., "50mg"
        adherence: String, // e.g., "Consistent", "Missed doses"
      },
    ],
    physicalHealth: String, // e.g., "Chronic back pain"
    substanceUse: String, // Optional, e.g., "Occasional alcohol"
  },
  sessionSummary: {
    topicsDiscussed: [String], // e.g., ["Work stress", "Relationships"]
    insightsBreakthroughs: String, // e.g., "Realized avoidance pattern"
    emotionalResponses: [String], // e.g., ["Frustration", "Relief"]
    techniquesUsed: [String], // e.g., ["CBT", "Mindfulness"]
    engagementLevel: String, // e.g., "Highly engaged"
    notableQuotes: [String], // e.g., ["I can’t keep going like this"]
  },
  therapistObservations: {
    behavior: String, // e.g., "Poor eye contact"
    cognitivePatterns: String, // e.g., "Distorted thinking"
    emotionalReactions: String, // e.g., "Avoidance"
    progress: String, // e.g., "Improved since last session"
    concerns: String, // e.g., "Mild suicidal ideation"
  },
  actionPlan: {
    goals: [String], // e.g., ["Reduce anxiety"]
    homework: [String], // e.g., ["Journal daily"]
    copingStrategies: [String], // e.g., ["Deep breathing"]
    lifestyleAdjustments: [String], // e.g., ["Improve sleep hygiene"]
    resourcesShared: [String], // e.g., ["Mindfulness app"]
  },
  therapistNotes: {
    keyTakeaways: String, // e.g., "Patient needs family support"
    risksConcerns: String, // e.g., "Monitor for self-harm"
    additionalSupport: String, // e.g., "Refer to psychiatrist"
    readiness: String, // e.g., "Stable"
    ethicalConsiderations: String, // e.g., "Confidentiality discussed"
  },
  prescriptions: [
    {
      medication: String, // e.g., "Zoloft"
      dosage: String, // e.g., "50mg daily"
      sideEffects: [String], // e.g., ["Nausea"]
      changes: String, // e.g., "Increased from 25mg"
      monitoring: String, // e.g., "Check in 2 weeks"
    },
  ],
  referrals: [
    {
      specialist: String, // e.g., "Psychiatrist"
      reason: String, // e.g., "Medication review"
    },
  ],
  labTests: [String], // e.g., ["Bloodwork for thyroid"]
  followUp: {
    nextSession: Date, // Next session date & time
    preparations: String, // e.g., "Bring journal"
    emergencyPlan: String, // e.g., "Call crisis line if needed"
    crisisManagement: String, // e.g., "Safety plan created"
    availability: String, // e.g., "Prefers mornings"
  },
  patientFeedback: {
    selfReflection: String, // e.g., "Felt lighter after talking"
    rating: Number, // e.g., 4 (out of 5)
    progressPerception: String, // e.g., "Slow but steady"
    openFeedback: String, // e.g., "Liked the homework"
    emotionalStatePost: String, // e.g., "Calmer"
    suggestions: String, // e.g., "Focus on work stress next"
  },
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("Prescription", prescriptionSchema);
