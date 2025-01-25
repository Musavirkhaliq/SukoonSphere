import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaShare, FaPlus } from "react-icons/fa";
import customFetch from "@/utils/customFetch";

const EditPostModal = ({ post, onClose, onPostUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    post.imageUrl ? { url: post.imageUrl } : null
  );
  const [tags, setTags] = useState(post.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState(post.description || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage?.url) {
      URL.revokeObjectURL(selectedImage.url);
      setSelectedImage(null);
    }
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("description", description);

      // Handle tags as JSON string
      formData.append("tags", JSON.stringify(tags));

      if (selectedImage?.file) {
        formData.append("imageUrl", selectedImage.file);
      }

      // Add a flag to indicate image removal
      if (!selectedImage) {
        formData.append("removeImage", "true");
      }

      const { data } = await customFetch.patch(`/posts/${post._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post updated successfully!");
      if (onPostUpdated) {
        onPostUpdated(data.post);
      }
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10 px-2">
      <div className="bg-[var(--body)] rounded-2xl p-4 md:p-6 w-[500px] shadow-2xl transform transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
            <FaShare className="text-[var(--primary)]" />
            Edit Your Story
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's on your mind? Share your thoughts, experiences or questions..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px]"
              required
            />
          </div>

          <div className="relative">
            {selectedImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <div className="p-3 bg-[var(--pure)] border border-[var(--primary)] rounded-lg shadow-sm flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-[var(--primary)]">
                      {selectedImage.name ? (
                        <>
                          <strong>File:</strong> {selectedImage.name}
                        </>
                      ) : (
                        <>Current image</>
                      )}
                    </p>
                    {selectedImage.size && (
                      <p className="text-sm text-[var(--ternary)]">
                        <strong>Size:</strong> {selectedImage.size}
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
                    Upload image
                  </span>
                  <input
                    type="file"
                    name="imageUrl"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-1.5 bg-[var(--pure)] rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                <FaPlus />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-red"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-2 gap-2"
            >
              <FaShare />
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
