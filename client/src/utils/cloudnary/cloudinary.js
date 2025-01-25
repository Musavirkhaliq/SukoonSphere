// utils/uploadImageToCloudinary.js
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, // Your Cloud Name
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY, // Your API Key
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET, // Your API Secret
});

export const uploadImageToCloudinary = async (file) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file, {
      folder: "posts", // You can specify a folder in your Cloudinary account
      resource_type: "image",
    });
    return response.secure_url; // The URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};
