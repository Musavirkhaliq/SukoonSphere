import React, { useState } from 'react';
import { FaTimes, FaLink, FaFileAlt, FaUpload, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const AddMaterialModal = ({ videoId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('link');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (type === 'link' && !content.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (type === 'note' && !content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (type === 'file' && !file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('videoId', videoId);
      formData.append('title', title.trim());
      formData.append('type', type);

      if (type === 'file') {
        formData.append('content', file.name);
        formData.append('file', file);
      } else {
        formData.append('content', content.trim());
      }

      console.log('Sending material data:', {
        videoId,
        title: title.trim(),
        type,
        content: type === 'file' ? file.name : content.trim()
      });

      const response = await customFetch.post('/video-materials/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Material added successfully:', response.data);

      toast.success('Material added successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding material:', error);

      // Log detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);

        // Show more detailed error message
        const errorMessage = error.response.data?.msg ||
                           error.response.data?.message ||
                           'Failed to add material';
        toast.error(errorMessage);
      } else if (error.request) {
        console.error('No response received from server');
        toast.error('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size should be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Material</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="link"
                  checked={type === 'link'}
                  onChange={() => setType('link')}
                  className="text-[var(--primary)]"
                />
                <span className="flex items-center">
                  <FaLink className="mr-1 text-blue-500" /> Link
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="note"
                  checked={type === 'note'}
                  onChange={() => setType('note')}
                  className="text-[var(--primary)]"
                />
                <span className="flex items-center">
                  <FaFileAlt className="mr-1 text-green-500" /> Note
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="file"
                  checked={type === 'file'}
                  onChange={() => setType('file')}
                  className="text-[var(--primary)]"
                />
                <span className="flex items-center">
                  <FaUpload className="mr-1 text-purple-500" /> File
                </span>
              </label>
            </div>
          </div>

          {type === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="https://example.com"
                required
              />
            </div>
          )}

          {type === 'note' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[100px]"
                placeholder="Enter note content..."
                required
              />
            </div>
          )}

          {type === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              {file && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] flex items-center"
              disabled={isSubmitting}
            >
              <FaSave className="mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
