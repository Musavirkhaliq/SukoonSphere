import React, { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { FaTimes, FaMicrophone } from "react-icons/fa";

const EditPodcastModel = ({ setShowModal, podcast, fetchData, type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(podcast.title);
  const [description, setDescription] = useState(podcast.description);
  const [episodeNo, setEpisodeNo] = useState(podcast.episodeNo || "");
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(podcast.imageUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.error("Please fill in the title");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append all fields
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (type === "playlist") {
        formData.append("episodeNo", episodeNo.toString());
      }

      // Append files only if new ones are selected
      if (audioFile) {
        formData.append("audio", audioFile);
      }
      if (coverImage) {
        formData.append("image", coverImage);
      }

      const response = await customFetch.patch(
        `/podcasts/${podcast._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Podcast updated successfully!");
        setShowModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error updating podcast:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Error updating podcast. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setCoverImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        toast.error("Audio file size should be less than 50MB");
        return;
      }
      setAudioFile(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="p-4 bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
            <FaMicrophone className="text-[var(--primary)]" />
            {podcast.type === "playlist" ? "Edit Episode" : "Edit Podcast"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter podcast title..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter podcast description..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary min-h-[100px]"
            />
          </div>

          {type === "playlist" && (
            <div>
              <input
                type="number"
                value={episodeNo}
                onChange={(e) => setEpisodeNo(e.target.value)}
                placeholder="Episode number..."
                className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300 placeholder-ternary"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (Max 5MB)
            </label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Cover preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File (Max 50MB)
            </label>
            <div className="flex items-center space-x-4">
              {podcast.audioUrl && !audioFile && (
                <div className="text-sm text-gray-500">Current audio file</div>
              )}
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="flex-1 px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)]transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-red"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-2">
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPodcastModel;
