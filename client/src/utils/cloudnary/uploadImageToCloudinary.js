import cloudinary from "./cloudinary";

export const uploadImageToCloudinary = async (file) => {
  try {
    const response = await cloudinary.uploader.upload(file, {
      folder: "posts", // You can specify a folder in your Cloudinary account
      resource_type: "image", // The resource type can be image, video, etc.
    });
    return response.secure_url; // The URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};
