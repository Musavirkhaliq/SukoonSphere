import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const EditReply = ({ reply, onClose, onUpdate }) => {
  const [editedContent, setEditedContent] = useState(reply.content);

  const handleSave = async () => {
    if (!editedContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      // Determine the correct endpoint based on the URL
      const currentPath = window.location.pathname;
      const isQAReply =
        currentPath.includes("/QA-section/") ||
        currentPath.includes("/qa-section/");

      const endpoint = isQAReply
        ? `/qa-section/answer/comments/replies/${reply._id}`
        : `/posts/comments/replies/${reply._id}`;

      const response = await customFetch.patch(endpoint, {
        content: editedContent,
      });

      // Preserve all original reply properties while updating with new data
      const updatedReply = {
        ...reply,
        ...response.data.reply,
        content: editedContent,
        editedAt: new Date(),
        createdBy: reply.createdBy,
        likes: response.data.reply.likes || reply.likes,
        totalLikes: response.data.reply.totalLikes || reply.likes?.length || 0,
        username: response.data.reply.username || reply.username,
        userAvatar: response.data.reply.userAvatar || reply.userAvatar,
        commentUsername:
          response.data.reply.commentUsername || reply.commentUsername,
        commentUserAvatar:
          response.data.reply.commentUserAvatar || reply.commentUserAvatar,
        commentUserId: response.data.reply.commentUserId || reply.commentUserId,
      };

      onUpdate(updatedReply);
      onClose();
      toast.success("Reply updated successfully");
    } catch (error) {
      console.error("Error updating reply:", error);
      toast.error(error.response?.data?.msg || "Failed to update reply");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Edit your reply..."
        className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
      />
      <div className="flex justify-end gap-3 pt-3 border-t">
        <button onClick={onClose} className="btn-red">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!editedContent.trim()}
          className="btn-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditReply;
