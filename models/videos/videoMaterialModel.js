import mongoose from "mongoose";

const videoMaterialSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["link", "note", "file"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    // For file type materials
    fileUrl: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: null
    },
    fileType: {
      type: String,
      default: null
    },
    // For ordering materials
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for efficient querying
videoMaterialSchema.index({ videoId: 1, order: 1 });

export default mongoose.model("VideoMaterial", videoMaterialSchema);
