import { FaRegHeart, FaReply } from "react-icons/fa";
import UserAvatar from "../UserAvatar";
import PostActions from "../PostActions";
import { useUser } from "@/context/UserContext";
import DeleteModal from "../DeleteModal";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditComment from "../EditComment";
import { formatDistanceToNow } from "date-fns";

const Comment = ({
  comment: initialComment,
  handleDeleteComment,
  handleLikeComment,
  toggleReply,
}) => {
  const { user } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(initialComment);
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(comment.totalLikes || 0);
  const navigate = useNavigate();
  const replyLink = toggleReply
    ? `/QA-section/question/answer/${comment.answerId}/comments/${comment._id}/reply`
    : `/posts/${comment.postId}/comment-id/${comment._id}`;

  const likeCommnet = async () => {
    if (!user) {
      toast.error("Please login to like this comment!");
      navigate("/auth/sign-up");
      return;
    }
    try {
      await handleLikeComment(comment._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateComment = (updatedComment) => {
    setComment(updatedComment);
    setIsEditing(false);
  };

  return (
    <div
      key={comment._id}
      className="flex flex-col gap-1 px-2 py-1 md:px-4 bg-white rounded-xl shadow-sm transition-shadow duration-200"
    >
      <div className="flex justify-between items-start">
        <UserAvatar
          createdBy={comment.createdBy}
          username={comment.username}
          userAvatar={comment.userAvatar}
          createdAt={comment.createdAt}
          size="verySmall"
        />
        {user?._id === comment.createdBy && (
          <PostActions
            handleEdit={handleEdit}
            handleDelete={() => setShowDeleteModal(true)}
          />
        )}
      </div>
      <div className="ml-13">
        <div className="bg-gray-50 px-3 py-1 md:py-2 rounded-xl border border-gray-100">
          {isEditing ? (
            <EditComment
              comment={comment}
              onClose={handleCloseEdit}
              onUpdate={handleUpdateComment}
            />
          ) : (
            <div className="">
              <p className="text-gray-600 text-xs md:text-sm mb-0">
                {comment.content}
              </p>
              {comment.editedAt && (
                <span className=" text-[10px] text-gray-400 italic flex flex-row-reverse">
                  Edited{" "}
                  {formatDistanceToNow(new Date(comment.editedAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-3 my-1">
            <button
              className={`flex items-center gap-2 px-2 py-1 rounded-full transition-all duration-200 ${
                isLiked
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              onClick={likeCommnet}
            >
              <FaRegHeart className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">
                {likesCount}
              </span>
            </button>
            <Link
              to={replyLink}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <FaReply className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">
                {comment.totalReplies || 0}
              </span>
            </Link>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await handleDeleteComment(comment._id);
          setShowDeleteModal(false);
        }}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        itemType="comment"
      />
    </div>
  );
};

export default Comment;
