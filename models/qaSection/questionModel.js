import mongoose from "mongoose";

// Define the schema for Questions
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
    },
    context: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tags: {
      type: [String],
      default: [],
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Create the model and the text index
questionSchema.index({ questionText: "text" }); // Create a text index for efficient search

export default mongoose.model("Question", questionSchema);
