import customFetch from "@/utils/customFetch";
import { Form, useParams } from "react-router-dom";
import { Reply } from "../Comments";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { FaReply } from "react-icons/fa";

const RepliesSection = ({
  addReply,
  replies,
  fetchReplies,
  deleteReply,
  likeReply,
}) => {
  const { user } = useUser();
  const { commentId } = useParams();

  const handleSubmit = (e, replyToId = null) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    if (!user) {
      toast.error("Please login to add a reply!");
      return;
    }
    const parentId = replyToId || commentId;
    addReply(parentId, content);
    fetchReplies();
    e.target.reset();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Form onSubmit={(e) => handleSubmit(e)} className="relative">
        <p className="font-md px-4 text-[var(--grey--700)] ">Replies</p>
        <textarea
          name="content"
          placeholder="Write a reply..."
          className="w-full p-3 pr-14 border  rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
          rows="1"
        />
        <button
          type="submit"
          className="absolute bottom-4 right-3 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
        >
          <FaReply className="w-2 h-2 md:w-3 md:h-3" />
        </button>
      </Form>
      <div className="space-y-4 mt-3 px-4 max-h-[400px] overflow-y-auto no-scrollbar">
        {replies &&
          replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              handleDeleteReply={deleteReply}
              handleLikeReply={likeReply}
              handleSubmit={(e) => handleSubmit(e, reply._id)}
            />
          ))}
      </div>
    </div>
  );
};

export default RepliesSection;
