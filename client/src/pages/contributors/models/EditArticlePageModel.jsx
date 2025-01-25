// import React, { useState, useRef } from "react";
// import { Editor } from "@tinymce/tinymce-react";
// import customFetch from "@/utils/customFetch";
// import { toast } from "react-toastify";
// import { FaPencilAlt } from "react-icons/fa";

// export const EditArticlePageModel = ({
//   onClose,
//   pageId,
//   content: initialContent,
//   title: initialTitle,
//   handleEditPage,
// }) => {
//   const [content, setContent] = useState(initialContent || "");
//   const [imageUrls, setImageUrls] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const editorRef = useRef(null);
//   const [title, setTitle] = useState(initialTitle || "");

//   const handleEditorChange = (newContent) => {
//     setContent(newContent);
//   };

//   const handleImageUpload = async (e) => {
//     try {
//       setIsUploading(true);
//       const files = Array.from(e.target.files);
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("image", file);
//         const { data } = await customFetch.post(
//           "/articles/upload-image",
//           formData
//         );
//         setImageUrls((prev) => [...prev, data.imageUrl]);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to upload images");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const copyToClipboard = (url) => {
//     navigator.clipboard
//       .writeText(url)
//       .then(() => {
//         toast.success("Image URL copied to clipboard!");
//       })
//       .catch((err) => {
//         toast.error("Failed to copy URL: ", err);
//       });
//   };

//   const removeImage = (indexToRemove) => {
//     setImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
//       <div className="h-screen w-screen bg-white transform transition-all duration-300 overflow-hidden">
//         <div className="flex gap-6 h-full">
//           {/* Left Section - Image Upload */}
//           <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
//             <div className="flex flex-col gap-4">
//               <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                 {isUploading ? (
//                   <div className="flex flex-col items-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mb-2"></div>
//                     <p className="text-sm text-gray-500">Uploading...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     <p className="text-sm text-gray-500">Upload Images</p>
//                   </>
//                 )}
//                 <input type="file" className="hidden" multiple onChange={handleImageUpload} accept="image/*" disabled={isUploading} />
//               </label>

//               <div className="flex flex-col gap-2">
//                 {imageUrls.map((url, index) => (
//                   <div key={index} className="relative group bg-white p-2 rounded-lg shadow-sm border border-gray-200">
//                     <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-24 object-cover rounded" />
//                     <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded flex items-center justify-center gap-2">
//                       <button onClick={() => copyToClipboard(url)} className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs">Copy</button>
//                       <button onClick={() => removeImage(index)} className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Remove</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Middle Section - Editor */}
//           <div className="w-2/4 flex flex-col gap-4 p-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Article title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50"
//               />
//               <FaPencilAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>

//             <Editor
//               apiKey="fx1sq8r6rvizuweu7wl50vnk0w3f3ik4g39966vm1n61u8tl"
//               onInit={(evt, editor) => (editorRef.current = editor)}
//               value={content}
//               init={{
//                 plugins: "image",
//                 toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | image",
//                 height: "calc(100vh - 200px)",
//                 content_style: "body { font-family: Arial, sans-serif; } img { display: inline-block; margin: 5px; }",
//               }}
//               onEditorChange={handleEditorChange}
//             />

//             <div className="flex justify-end gap-4">
//               <button onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleEditPage(pageId, content, title)}
//                 className="px-6 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--ternery)] text-white transition-colors"
//               >
//                 Update
//               </button>
//             </div>
//           </div>

//           {/* Right Section - Preview */}
//           <div className="w-1/4 bg-white border-l border-gray-200 p-4 overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Preview</h3>
//             <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
const EditArticlePageModel = () => {
  return (
    <div>EditArticlePageModel</div>
  )
}
export default EditArticlePageModel
