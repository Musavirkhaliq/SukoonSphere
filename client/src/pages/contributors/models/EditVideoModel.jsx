import customFetch from "@/utils/customFetch";
import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaVideo, FaPlus, FaTimesCircle } from "react-icons/fa";

const EditVideoModel = ({ video, setShowModal, refetchVideos }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(video.coverImage);
  const [type, setType] = useState(video.type || "single");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setCoverImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      setCoverImageFile(null);
    }
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);

      // Handle type
      formData.append("type", type);

      // Handle cover image
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      if (!previewImage) {
        formData.append("removeCoverImage", "true");
      }

      await customFetch.patch(`/videos/update-video/${video._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Video updated successfully");
      refetchVideos();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error(error?.response?.data?.msg || "Error updating video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10 px-2">
      <div className="bg-[var(--body)] rounded-2xl p-6 w-[600px] shadow-2xl transform transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
            <FaVideo className="text-[var(--primary)]" />
            Edit Video
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <Form
          method="PATCH"
          className="space-y-4"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="title"
              defaultValue={video.title}
              placeholder="Video title"
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
              required
            />
          </div>

          <div>
            <textarea
              name="description"
              defaultValue={video.description}
              placeholder="Video description..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary min-h-[100px]"
              required
            />
          </div>

          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300"
            >
              <option value="single">Single Video</option>
              <option value="playlist">Playlist</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="videoUrl"
              defaultValue={video.videoUrl}
              placeholder="Video URL"
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
              required
            />
          </div>

          <div className="relative">
            {previewImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <div className="p-3 bg-[var(--pure)] border border-[var(--primary)] rounded-lg shadow-sm flex items-center gap-3">
                  <img
                    src={previewImage}
                    alt="Cover preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--primary)]">
                      <strong>Cover Image</strong>
                    </p>
                    {coverImageFile && (
                      <p className="text-sm text-[var(--ternary)]">
                        <strong>Size:</strong>{" "}
                        {(coverImageFile.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all">
                <label className="flex items-center justify-center cursor-pointer gap-2">
                  <FaImage className="text-gray-400" />
                  <span className="text-sm text-blue-600 hover:text-blue-500">
                    Upload cover image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
        
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-red flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <FaTimesCircle />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Video"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default EditVideoModel;
