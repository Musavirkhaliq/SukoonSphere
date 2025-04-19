import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

/**
 * Downloads an image from a URL and saves it to the uploads directory
 * @param {string} url - The URL of the image to download
 * @returns {Promise<string>} - The filename of the downloaded image
 */
export const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    // Determine if we need http or https
    const client = url.startsWith('https') ? https : http;
    
    // Generate a unique filename
    const filename = `${uuidv4()}.jpg`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Create a write stream
    const fileStream = fs.createWriteStream(filepath);
    
    // Download the image
    client.get(url, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      // Pipe the image data to the file
      response.pipe(fileStream);
      
      // Handle errors during download
      response.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there's an error
        reject(err);
      });
      
      // Resolve when the download is complete
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filename);
      });
      
      // Handle errors during file writing
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
};
