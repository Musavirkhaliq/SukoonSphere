import React, { useState } from 'react';
import { FaTimes, FaLink, FaFileAlt, FaUpload, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';

const EditMaterialModal = ({ material, onClose, onSuccess }) => {
  const [title, setTitle] = useState(material.title);
  const [content, setContent] = useState(material.content);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (material.type !== 'file' && !content.trim()) {
      toast.error('Please enter content');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', title.trim());
      
      if (material.type === 'file' && file) {
        formData.append('content', file.name);
        formData.append('file', file);
      } else if (material.type !== 'file') {
        formData.append('content', content.trim());
      }
      
      await customFetch.patch(`/video-materials/update/${material._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Material updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error(error.response?.data?.msg || 'Failed to update material');
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Material</h3>
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
            <div className="flex items-center space-x-2">
              {material.type === 'link' && <FaLink className="text-blue-500" />}
              {material.type === 'note' && <FaFileAlt className="text-green-500" />}
              {material.type === 'file' && <FaUpload className="text-purple-500" />}
              <span className="capitalize">{material.type}</span>
            </div>
          </div>
          
          {material.type === 'link' && (
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
          
          {material.type === 'note' && (
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
          
          {material.type === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File
              </label>
              <div className="mb-2">
                <span className="text-sm text-gray-600">Current file: </span>
                <a 
                  href={material.fileUrl} 
                  download={material.fileName}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {material.fileName}
                </a>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              {file && (
                <p className="text-sm text-gray-500 mt-1">
                  New file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialModal;
