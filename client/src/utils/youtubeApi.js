/**
 * Utility functions for working with YouTube videos
 */

/**
 * Extract YouTube video ID from a URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if invalid
 */
export const getYoutubeId = (url) => {
  if (!url) return null;

  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // If the input is already a video ID (11 characters)
  if (url.length === 11) {
    return url;
  }

  // If it's already an embed URL, extract the ID
  if (url.includes('youtube.com/embed/')) {
    const embedMatch = url.match(/youtube\.com\/embed\/([^\/\?&]+)/);
    if (embedMatch && embedMatch[1]) {
      return embedMatch[1];
    }
  }

  return null;
};

/**
 * Get YouTube video metadata using oEmbed API (no API key required)
 * @param {string} url - YouTube URL or video ID
 * @returns {Promise<Object>} - Video metadata (title, author_name, thumbnail_url, etc.)
 */
export const getYoutubeMetadata = async (url) => {
  try {
    const videoId = getYoutubeId(url);

    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Use YouTube oEmbed API to get basic metadata (no API key required)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube metadata');
    }

    const data = await response.json();

    // Get high-resolution thumbnail
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      title: data.title,
      author: data.author_name,
      thumbnailUrl,
      // oEmbed doesn't provide description, so we'll need to handle that separately
      description: '',
      videoId
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
};

/**
 * Get YouTube video description
 * Note: This is a placeholder function since we can't easily get the description
 * without using the YouTube Data API (which requires an API key)
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Empty string (description not available)
 */
export const getYoutubeDescription = async (videoId) => {
  // We're not able to reliably get the description without an API key
  // Return an empty string to indicate that description is not available
  return '';
};

/**
 * Get complete YouTube video metadata including description
 * @param {string} url - YouTube URL or video ID
 * @returns {Promise<Object>} - Complete video metadata
 */
export const getCompleteYoutubeMetadata = async (url) => {
  try {
    const basicMetadata = await getYoutubeMetadata(url);

    if (!basicMetadata) {
      return null;
    }

    // Try to get description
    const description = await getYoutubeDescription(basicMetadata.videoId);

    return {
      ...basicMetadata,
      description
    };
  } catch (error) {
    console.error('Error fetching complete YouTube metadata:', error);
    return null;
  }
};
