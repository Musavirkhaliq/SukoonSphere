import fs from 'fs/promises';
import path from 'path';

export const deleteFile = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract filename from the full URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Get the absolute path to the uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create full path to the file
    const filePath = path.join(uploadsDir, filename);

    console.log('Attempting to delete file:', filePath);

    // Check if file exists before attempting to delete
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log('Successfully deleted image:', filename);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('File does not exist:', filename);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
};
