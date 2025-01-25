import cloudinary from "cloudinary";

// Function to process base64 images and upload to Cloudinary
export const processBase64Images = async (content) => {
  const regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"/g;
  let match;

  // To store all image upload promises
  const uploadPromises = [];

  // Process the base64 images in parallel
  while ((match = regex.exec(content)) !== null) {
    const imageType = match[1]; // Image type (e.g., png, jpeg)
    const base64Data = match[2]; // Base64-encoded image data

    // Create a promise for each image upload
    const uploadPromise = uploadBase64ToCloudinary(base64Data, imageType)
      .then((imageUrl) => {
        // Replace the base64 image with the Cloudinary URL in the content
        content = content.replace(
          match[0],
          `<img src="${imageUrl}" alt="image"/>`
        );
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        // Handle the error appropriately - e.g., continue with other images or log it
      });

    uploadPromises.push(uploadPromise);
  }

  // Wait for all image uploads to finish and content to be updated
  await Promise.all(uploadPromises);

  return content;
};

// Function to upload a base64 image to Cloudinary
const uploadBase64ToCloudinary = (base64Data, imageType) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(base64Data, "base64");

    cloudinary.uploader
      .upload_stream(
        {
          folder: "blogs", // Store in a 'blogs' folder
          resource_type: "image",
          public_id: `blog_image_${Date.now()}`, // Unique ID for each image upload
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Error uploading image: ${error.message}`));
          } else {
            resolve(result.secure_url); // Return Cloudinary image URL
          }
        }
      )
      .end(buffer); // Start the upload stream with the buffer
  });
};
