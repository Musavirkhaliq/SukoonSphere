import { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const EditComment = ({ comment, onClose, onUpdate }) => {
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleSave = async () => {
    if (!editedContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const endpoint = comment.answerId
        ? `/qa-section/answer/comments/${comment._id}` // QA comment
        : `/posts/comments/${comment._id}`; // Post comment

      const response = await customFetch.patch(endpoint, {
        content: editedContent,
      });

      // Preserve all original comment properties while updating with new data
      const updatedComment = {
        ...comment,
        ...response.data.comment,
        createdBy: comment.createdBy, // Preserve the createdBy field
        likes: response.data.comment.likes || comment.likes,
        replies: response.data.comment.replies || comment.replies,
        totalLikes:
          response.data.comment.totalLikes || comment.likes?.length || 0,
        totalReplies:
          response.data.comment.totalReplies || comment.replies?.length || 0,
        username: response.data.comment.username || comment.username,
        userAvatar: response.data.comment.userAvatar || comment.userAvatar,
      };

      onUpdate(updatedComment);
      onClose();
      toast.success("Comment updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to update comment");
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder="Edit your comment..."
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

export default EditComment;
