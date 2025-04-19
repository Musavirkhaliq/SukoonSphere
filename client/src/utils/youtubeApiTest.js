import { getYoutubeId, getYoutubeMetadata, getCompleteYoutubeMetadata } from './youtubeApi.js';

// Test function to verify YouTube API utilities
async function testYoutubeApi() {
  // Test URL
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  
  console.log('Testing YouTube API utilities...');
  
  // Test getYoutubeId
  const videoId = getYoutubeId(testUrl);
  console.log('Video ID:', videoId);
  
  // Test getYoutubeMetadata
  try {
    const metadata = await getYoutubeMetadata(testUrl);
    console.log('Basic Metadata:', metadata);
  } catch (error) {
    console.error('Error getting basic metadata:', error);
  }
  
  // Test getCompleteYoutubeMetadata
  try {
    const completeMetadata = await getCompleteYoutubeMetadata(testUrl);
    console.log('Complete Metadata:', completeMetadata);
  } catch (error) {
    console.error('Error getting complete metadata:', error);
  }
}

// Run the test
testYoutubeApi();
