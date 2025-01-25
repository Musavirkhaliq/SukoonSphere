import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaCopy, FaInfoCircle } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import DeleteModal from "../shared/DeleteModal";

const ArticleGallery = ({ onImageUrlCopy }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?._id) {
      fetchImages();
    }
  }, [page, user?._id]);
  console.log(images);

  const fetchImages = async () => {
    try {
      const response = await customFetch.get(
        `/gallery/user/${user._id}?page=${page}`
      );
      const newImages = response.data.images;

      if (page === 1) {
        setImages(newImages || []);
      } else {
        setImages((prev) => [...prev, ...(newImages || [])]);
      }

      setHasMore(response.data.pagination.hasNextPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
      setImages([]);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await customFetch.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image uploaded successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setPage(1);
      fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    try {
      await customFetch.delete(`/gallery/${selectedImage._id}`);
      toast.success("Image deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setImages(images.filter((img) => img._id !== selectedImage._id));
      setShowDeleteModal(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCopyUrl = async (imageUrl) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("Image URL copied to clipboard", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error copying URL:", error);
      toast.error("Failed to copy URL", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Gallery</h3>
        <div class="flex">
          <div class=" text-center">
            <div
              class="tooltip tooltip-bottom"
              data-tip="Once the image is uploaded, hover on the image to copy the URL. Please delete the image if you no longer need it."
            >
              <button class="size-10 inline-flex justify-center items-center gap-2 rounded-full ">
                <FaInfoCircle className="w-5 h-5 mr-2 text-[var(--ternery)]" />
              </button>
            </div>
          </div>
          <label className="btn-2 cursor-pointer">
            Upload
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center mb-2">No images yet</p>
            <p className="text-sm text-center">
              Upload images to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <div
                key={image._id}
                className="relative group w-[140px] h-[140px]"
              >
                <img
                  src={image.imageUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(image.imageUrl);
                          toast.success("URL copied to clipboard!", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        } catch (error) {
                          toast.error("Failed to copy URL", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        }
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Copy image URL"
                    >
                      <FaCopy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedImage(image);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Delete image"
                    >
                      <FaTrash className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !isLoading && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full mt-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            Load more
          </button>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedImage(null);
        }}
        onDelete={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
      />
    </div>
  );
};

export default ArticleGallery;
