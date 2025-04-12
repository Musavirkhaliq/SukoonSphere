import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaShare, FaUserSecret } from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import JoditEditor from "jodit-react";

const CreateStoryModal = ({ onClose, onStoryCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const editorRef = useRef(null);

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

  const removeImage = () => {
    if (selectedImage?.url) {
      URL.revokeObjectURL(selectedImage.url);
    }
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for your story");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter content for your story");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("isAnonymous", isAnonymous);

      if (selectedImage?.file) {
        formData.append("image", selectedImage.file);
      }

      const response = await customFetch.post("/personal-stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Personal story created successfully!");
        if (onStoryCreated) {
          onStoryCreated();
        }
        onClose();
      }
    } catch (error) {
      console.error("Error creating personal story:", error);
      toast.error(
        error?.response?.data?.msg || "An error occurred during story creation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-10 px-4 py-6 overflow-y-auto">
      <div className="bg-[var(--body)] rounded-2xl p-4 md:p-6 w-full max-w-3xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
            <FaShare className="text-[var(--primary)]" />
            Share Your Personal Story
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your story..."
              className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-[var(--grey--700)] mb-2">
              Content
            </label>
            <div className="h-auto">
              <JoditEditor
                ref={editorRef}
                value={content}
                config={{
                  readonly: false,
                  placeholder: "Share your personal experience or story...",
                  height: "auto",
                  minHeight: "300px",
                  maxHeight: "auto",
                  toolbarButtonSize: "medium",
                  showXPathInStatusbar: false,
                  showCharsCounter: false,
                  showWordsCounter: false,
                  showTooltip: true,
                  showStatusbar: true,
                  buttons: [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'ul',
                    'ol',
                    'outdent',
                    'indent',
                    'align',
                    'image',
                    'link',
                    'video',
                    'table',
                    'hr',
                    'eraser',
                    'undo',
                    'redo'
                  ],
                  imageUploadURL: '/api/upload/image',
                  imageUploadMethod: 'POST',
                  imageUploadFieldName: 'image',
                  imageUploadUseFormData: true,
                  imageUploadHeaders: {
                    'X-CSRF-TOKEN': 'your-csrf-token-here'
                  },
                  imageUpload: true,
                  imageDefaultWidth: 100,
                  imageDefaultHeight: 100,
                  imageEditor: true,
                  imageEditorInsertToEditor: true,
                  removeButtons: ['brush', 'eraser', 'about', 'print', 'fullsize', 'fontsize', 'fontfamily', 'fontcolor', 'backgroundcolor', 'superscript', 'subscript', 'underline', 'strikethrough', 'outdent', 'indent', 'align', 'image', 'link', 'video', 'table', 'hr', 'eraser', 'undo', 'redo']
                }}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {selectedImage.name} ({selectedImage.size})
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
                    name="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm flex items-center gap-1">
                  <FaUserSecret className={isAnonymous ? "text-blue-600" : "text-gray-500"} />
                  Share anonymously
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-red">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-2 flex gap-2"
              >
                <FaShare />
                {isSubmitting ? "Sharing..." : "Share Story"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal;
