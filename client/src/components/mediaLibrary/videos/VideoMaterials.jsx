import React, { useState, useEffect } from 'react';
import { FaLink, FaFileAlt, FaDownload, FaTrash, FaPencilAlt, FaPlus, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import customFetch from '@/utils/customFetch';
import { useUser } from '@/context/UserContext';
import AddMaterialModal from './AddMaterialModal';
import EditMaterialModal from './EditMaterialModal';

const VideoMaterials = ({ videoId, videoAuthorId }) => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMaterials, setShowMaterials] = useState(false);

  // Auto-expand when materials are loaded and available
  useEffect(() => {
    if (!isLoading && materials.length > 0) {
      setShowMaterials(true);
    }
  }, [isLoading, materials]);
  const { user } = useUser();

  // Check if user is the actual creator of the video (or admin)
  const [isCreator, setIsCreator] = useState(false);

  // Determine if user is creator or admin
  useEffect(() => {
    if (user && videoAuthorId) {
      const isUserCreator =
        (typeof videoAuthorId === 'string' && videoAuthorId === user._id) ||
        (typeof videoAuthorId === 'object' && videoAuthorId?._id === user._id);

      const isUserAdmin = user.role === 'admin';

      setIsCreator(isUserCreator || isUserAdmin);
    }
  }, [user, videoAuthorId]);

  // For backward compatibility
  const isAuthor = isCreator;

  // Debug permission check
  useEffect(() => {
    if (user && videoAuthorId) {
      console.log('VideoMaterials permission check:');
      console.log('User ID:', user._id);
      console.log('User role:', user.role);
      console.log('Video author ID:', videoAuthorId);
      console.log('Is creator check result:', isCreator);

      // Auto-expand for creators
      if (isCreator) {
        console.log('User is the creator - auto-expanding materials section');
        setShowMaterials(true);
      }
    }
  }, [user, videoAuthorId, isCreator]);

  // This effect is now redundant with the debug effect above
  // Keeping it for clarity
  useEffect(() => {
    if (user && videoAuthorId && isCreator) {
      setShowMaterials(true);
    }
  }, [user, videoAuthorId, isCreator]);

  // Fetch materials for this video
  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const { data } = await customFetch.get(`/video-materials/video/${videoId}`);
      setMaterials(data.materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load video materials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchMaterials();
    }
  }, [videoId]);

  const handleDelete = async (materialId) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await customFetch.delete(`/video-materials/delete/${materialId}`);
      toast.success('Material deleted successfully');
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setShowEditModal(true);
  };

  const renderMaterialIcon = (type) => {
    switch (type) {
      case 'link':
        return <FaLink className="text-blue-500" />;
      case 'note':
        return <FaFileAlt className="text-green-500" />;
      case 'file':
        return <FaDownload className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <div className="flex items-center justify-between bg-gray-50 border-b">
        <button
          onClick={() => setShowMaterials(!showMaterials)}
          className="flex-grow p-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <FaBook className="mr-2 text-[var(--primary)]" />
            <span className="font-medium">Learning Materials</span>
            {materials.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {materials.length}
              </span>
            )}
            {isAuthor && materials.length === 0 && (
              <span className="ml-2 text-xs text-gray-500">(Add resources for viewers)</span>
            )}
          </div>
          {showMaterials ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Add Material Button in Header */}
        {isCreator && (
          <button
            onClick={() => {
              setShowMaterials(true);
              setShowAddModal(true);
            }}
            className="flex items-center text-sm bg-[var(--secondary)] text-[var(--primary)] px-3 py-2 m-2 rounded-md hover:bg-[var(--secondary-hover)] transition-colors font-medium"
          >
            <FaPlus className="mr-1" /> Add
          </button>
        )}
      </div>

      {/* Materials Content */}
      {showMaterials && (
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Video Materials</h3>
                {isCreator && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center text-sm bg-[var(--secondary)] text-[var(--primary)] px-3 py-2 rounded-md hover:bg-[var(--secondary-hover)] transition-colors font-medium shadow-sm"
                  >
                    <FaPlus className="mr-1" /> Add Material
                  </button>
                )}
              </div>

              {materials.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FaBook className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-500 mb-3">No learning materials available for this video.</p>
                  {isCreator ? (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center bg-[var(--secondary)] text-[var(--primary)] px-4 py-2 rounded-md hover:bg-[var(--secondary-hover)] transition-colors font-medium shadow-sm"
                    >
                      <FaPlus className="mr-2" /> Add Your First Material
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400">
                      The creator hasn't added any materials yet.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((material) => (
            <div key={material._id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{renderMaterialIcon(material.type)}</div>
                  <div>
                    <h4 className="font-medium text-gray-800">{material.title}</h4>

                    {material.type === 'link' ? (
                      <a
                        href={material.content.startsWith('http') ? material.content : `https://${material.content}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {material.content}
                      </a>
                    ) : material.type === 'note' ? (
                      <p className="text-gray-600 whitespace-pre-wrap">{material.content}</p>
                    ) : (
                      <a
                        href={material.fileUrl}
                        download={material.fileName}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FaDownload className="mr-1" /> {material.fileName}
                        {material.fileSize && (
                          <span className="text-gray-500 text-xs ml-2">
                            ({(material.fileSize / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </a>
                    )}
                  </div>
                </div>

                {isCreator && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-gray-500 hover:text-blue-500"
                      title="Edit"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
                </div>
              )}
            </>
          )}

          {showAddModal && (
            <AddMaterialModal
              videoId={videoId}
              onClose={() => setShowAddModal(false)}
              onSuccess={fetchMaterials}
            />
          )}

          {showEditModal && selectedMaterial && (
            <EditMaterialModal
              material={selectedMaterial}
              onClose={() => {
                setShowEditModal(false);
                setSelectedMaterial(null);
              }}
              onSuccess={fetchMaterials}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VideoMaterials;
