import UserAvatar from "../UserAvatar";
import PostActions from "../PostActions";
import DeleteModal from "../DeleteModal";
import { Form, Link, useNavigate } from "react-router-dom";
import { FaRegHeart, FaReply } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import EditReply from "../EditReply";
import { formatDistanceToNow } from "date-fns";

const Reply = ({
  reply: initialReply,
  handleDeleteReply,
  handleLikeReply,
  handleSubmit,
}) => {
  const { user } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reply, setReply] = useState(initialReply);
  const [isLiked, setIsLiked] = useState(reply.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(reply.totalLikes || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const navigate = useNavigate();

  const deleteReply = async () => {
    try {
      await handleDeleteReply(reply._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const likeReply = async () => {
    if (!user) {
      toast.error("Please login to like this reply!");
      navigate("/auth/sign-up");
      return;
    }
    try {
      await handleLikeReply(reply._id);
      setIsLiked(!isLiked);
      setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
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

  const handleUpdateReply = (updatedReply) => {
    setReply(updatedReply);
    setIsEditing(false);
  };

  const handleReplySubmit = (e) => {
    handleSubmit(e);
    setShowReplyForm(false);
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <div key={reply._id} className="flex flex-col gap-3 reply-container">
      <div className="flex justify-between items-start">
        <UserAvatar
          createdBy={reply.createdBy}
          username={reply.username}
          userAvatar={reply.userAvatar}
          createdAt={reply.createdAt}
          size="verySmall"
        />
        {user?._id === reply.createdBy && (
          <PostActions
            handleEdit={handleEdit}
            handleDelete={() => setShowDeleteModal(true)}
          />
        )}
      </div>
      <div className="ml-13">
        <div className="bg-gray-50 px-3 py-1 md:py-2 rounded-xl border border-gray-100">
          {isEditing ? (
            <EditReply
              reply={reply}
              onClose={handleCloseEdit}
              onUpdate={handleUpdateReply}
            />
          ) : (
            <div>
              <p className="text-gray-600 text-xs md:text-sm mb-0 ">
                <Link
                  to={`/about/user/${reply.commentUserId}`}
                  className=" hover:underline text-[var(--ternery)]"
                >
                  @{reply.commentUsername}
                </Link>{" "}
                {reply.content}
              </p>
              {reply.editedAt && (
                <span className=" text-[10px] text-gray-400 italic flex flex-row-reverse">
                  Edited{" "}
                  {formatDistanceToNow(new Date(reply.editedAt), {
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
              onClick={likeReply}
            >
              <FaRegHeart className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">
                {likesCount}
              </span>
            </button>
            <button
              onClick={handleReplyClick}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <FaReply className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">Reply</span>
            </button>
          </div>
        )}
      </div>
      {showReplyForm && (
        <div className="reply-form ml-13">
          <Form onSubmit={handleReplySubmit} className="space-y-4">
            <div>
              <textarea
                name="content"
                placeholder={`Reply to ${reply.username}...`}
                className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="btn-red"
              >
                Cancel
              </button>
              <button type="submit" className="btn-2">
                Reply
              </button>
            </div>
          </Form>
        </div>
      )}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteReply}
        title="Delete Reply"
        message="Are you sure you want to delete this reply?"
        itemType="reply"
      />
    </div>
  );
};

export default Reply;
