import mongoose from "mongoose";

// Schema for assessment questions
const AssessmentQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["scale", "multiple_choice", "open_ended"],
      default: "scale",
    },
    options: [{
      value: String,
      label: String,
      score: Number
    }],
    category: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    }
  }
);

// Schema for assessment categories
const AssessmentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    }
  }
);

// Main assessment schema
const TherapyAssessmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["initial", "progress", "specific", "followup"],
      default: "initial",
    },
    categories: [AssessmentCategorySchema],
    questions: [AssessmentQuestionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  }
);

// Pre-save hook to update updatedAt timestamp
TherapyAssessmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const TherapyAssessment = mongoose.model("TherapyAssessment", TherapyAssessmentSchema);

export default TherapyAssessment;
