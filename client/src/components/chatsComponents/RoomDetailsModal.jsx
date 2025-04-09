import React, { useState } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const RoomDetailsModal = ({ room, isAdmin, onClose }) => {
  const [name, setName] = useState(room?.name || "");
  const [description, setDescription] = useState(room?.description || "");
  const [isPublic, setIsPublic] = useState(room?.isPublic || false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(room?.image || "");
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Room name is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isPublic", isPublic);
      
      if (image) {
        formData.append("image", image);
      }
      
      await customFetch.patch(`/rooms/${room._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Room updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Room Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Room Image */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Room preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">
                      {name ? name[0].toUpperCase() : "R"}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="room-image"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer"
                >
                  <FaCamera />
                  <input
                    type="file"
                    id="room-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={!isAdmin}
                  />
                </label>
              </div>
            </div>

            {/* Room Name */}
            <div>
              <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
                Room Name *
              </label>
              <input
                type="text"
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!isAdmin}
              />
            </div>

            {/* Room Description */}
            <div>
              <label htmlFor="room-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="room-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter room description"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                disabled={!isAdmin}
              />
            </div>

            {/* Room Visibility */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="room-public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={!isAdmin}
              />
              <label htmlFor="room-public" className="ml-2 block text-sm text-gray-700">
                Make this room public (anyone can join)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              {isAdmin ? "Cancel" : "Close"}
            </button>
            {isAdmin && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
