import customFetch from './customFetch';

/**
 * Utility for working with video playlists
 */
class VideoPlaylistApi {
  /**
   * Get all playlists
   * @returns {Promise} - Promise that resolves with all playlists
   */
  static async getAllPlaylists() {
    try {
      const { data } = await customFetch.get('/video-playlists/all');
      return data.playlists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  /**
   * Get a single playlist with its videos
   * @param {string} playlistId - ID of the playlist
   * @returns {Promise} - Promise that resolves with the playlist details
   */
  static async getPlaylistDetails(playlistId) {
    try {
      const { data } = await customFetch.get(`/video-playlists/details/${playlistId}`);
      return data.playlist;
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      return null;
    }
  }

  /**
   * Create a new playlist
   * @param {FormData} formData - Form data with playlist details
   * @returns {Promise} - Promise that resolves with the created playlist
   */
  static async createPlaylist(formData) {
    try {
      const { data } = await customFetch.post('/video-playlists/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  /**
   * Add a video to a playlist
   * @param {string} playlistId - ID of the playlist
   * @param {string} videoId - ID of the video to add
   * @returns {Promise} - Promise that resolves with the updated playlist
   */
  static async addVideoToPlaylist(playlistId, videoId) {
    try {
      const { data } = await customFetch.post('/video-playlists/add-video', {
        playlistId,
        videoId,
      });
      return data.playlist;
    } catch (error) {
      console.error('Error adding video to playlist:', error);
      throw error;
    }
  }

  /**
   * Remove a video from a playlist
   * @param {string} playlistId - ID of the playlist
   * @param {string} videoId - ID of the video to remove
   * @returns {Promise} - Promise that resolves with the updated playlist
   */
  static async removeVideoFromPlaylist(playlistId, videoId) {
    try {
      const { data } = await customFetch.delete(`/video-playlists/${playlistId}/remove-video/${videoId}`);
      return data.playlist;
    } catch (error) {
      console.error('Error removing video from playlist:', error);
      throw error;
    }
  }

  /**
   * Delete a playlist
   * @param {string} playlistId - ID of the playlist to delete
   * @returns {Promise} - Promise that resolves when the playlist is deleted
   */
  static async deletePlaylist(playlistId) {
    try {
      const { data } = await customFetch.delete(`/video-playlists/delete/${playlistId}`);
      return data;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  }

  /**
   * Update a playlist
   * @param {string} playlistId - ID of the playlist to update
   * @param {FormData} formData - Form data with updated playlist details
   * @returns {Promise} - Promise that resolves with the updated playlist
   */
  static async updatePlaylist(playlistId, formData) {
    try {
      const { data } = await customFetch.patch(`/video-playlists/update/${playlistId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.playlist;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  }

  /**
   * Reorder videos in a playlist
   * @param {string} playlistId - ID of the playlist
   * @param {Array} videoIds - Array of video IDs in the new order
   * @returns {Promise} - Promise that resolves with the updated playlist
   */
  static async reorderPlaylistVideos(playlistId, videoIds) {
    try {
      const { data } = await customFetch.patch(`/video-playlists/${playlistId}/reorder`, {
        videoIds,
      });
      return data.playlist;
    } catch (error) {
      console.error('Error reordering playlist videos:', error);
      throw error;
    }
  }
}

export default VideoPlaylistApi;
