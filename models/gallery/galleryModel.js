import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);

// Create indexes for better search performance
gallerySchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Gallery", gallerySchema);
