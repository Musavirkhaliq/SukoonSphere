import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaSearch, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const AddVideoToSectionModal = ({ setShowModal, sectionId, playlistId, onSuccess }) => {
  const [availableVideos, setAvailableVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch videos that are in the playlist but not in this section
  useEffect(() => {
    const fetchAvailableVideos = async () => {
      try {
        setIsLoading(true);
        // Get all videos in the playlist
        const playlistResponse = await customFetch.get(`/video-playlists/details/${playlistId}`);
        const playlistVideos = playlistResponse.data.playlist.videos;
        
        // Get videos already in this section
        const sectionResponse = await customFetch.get(`/playlist-sections/playlist/${playlistId}`);
        const sections = sectionResponse.data.sections;
        const currentSection = sections.find(section => section._id === sectionId);
        const sectionVideoIds = currentSection ? currentSection.videos.map(video => 
          typeof video === 'object' ? video._id : video
        ) : [];
        
        // Filter out videos that are already in this section
        const filteredVideos = playlistVideos.filter(video => {
          const videoId = typeof video === 'object' ? video._id : video;
          return !sectionVideoIds.includes(videoId);
        });
        
        setAvailableVideos(filteredVideos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching available videos:', error);
        toast.error('Failed to load available videos');
        setIsLoading(false);
      }
    };

    if (sectionId && playlistId) {
      fetchAvailableVideos();
    }
  }, [sectionId, playlistId]);

  const toggleVideoSelection = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedVideos.length === 0) {
      toast.error('Please select at least one video');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Add each selected video to the section
      const addPromises = selectedVideos.map(videoId => 
        customFetch.post('/playlist-sections/add-video', {
          sectionId,
          videoId
        })
      );
      
      await Promise.all(addPromises);
      
      toast.success(`${selectedVideos.length} video(s) added to section successfully`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error adding videos to section:', error);
      toast.error(error.response?.data?.msg || 'Failed to add videos to section');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVideos = searchTerm 
    ? availableVideos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableVideos;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Add Videos to Section</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? (
                <p>No videos match your search.</p>
              ) : (
                <p>No videos available to add to this section.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <div 
                  key={video._id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer hover:bg-gray-50 ${
                    selectedVideos.includes(video._id) ? 'border-[var(--primary)] bg-[var(--primary-light)]' : ''
                  }`}
                  onClick={() => toggleVideoSelection(video._id)}
                >
                  <div className="flex-shrink-0 w-16 h-9 bg-gray-200 rounded overflow-hidden mr-4">
                    {video.coverImage && (
                      <img 
                        src={video.coverImage} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate">{video.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{video.description}</p>
                  </div>
                  
                  <div className="ml-4">
                    {selectedVideos.includes(video._id) ? (
                      <div className="w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center">
                        <FaCheck size={12} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <FaPlus size={10} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)]"
            disabled={isSubmitting || selectedVideos.length === 0}
          >
            {isSubmitting ? 'Adding...' : `Add ${selectedVideos.length} Video${selectedVideos.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoToSectionModal;
