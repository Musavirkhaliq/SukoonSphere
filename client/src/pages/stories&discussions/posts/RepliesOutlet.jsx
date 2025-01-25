import RepliesSection from "@/components/shared/replies/RepliesSection";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { deleteRange } from "quill/modules/keyboard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const RepliesOutlet = () => {
  const { commentId } = useParams();
  const [replies, setReplies] = useState([]);
  const { user } = useUser()
  const fetchReplies = async () => {
    try {
      const { data } = await customFetch.get(
        `/posts/comments/${commentId}/replies`
      );
      setReplies(data.replies);
    } catch (error) {
      console.log(error);
    }
  };
  const addReply = async (commentId, content) => {
    if (!user) {
      toast.error("Please login to add a reply!");
      return;
    }
    try {
      const { data } = await customFetch.post(
        `/posts/comments/${commentId}/replies`,
        { content }
      );
      fetchReplies();
    } catch (error) {
      console.log({ replyError: error });
    }
  };
  const deleteReply = async (replyId) => {

    try {
      await customFetch.delete(`/posts/comments/replies/${replyId}`);
      fetchReplies();
      toast.success("Reply deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  const likeReply = async (replyId) => {
    if (!user) {
      toast.error("Please login to like this reply!");
      return;
    }
    try {
      await customFetch.patch(`/posts/comments/replies/${replyId}/like`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchReplies();
  }, [commentId]);
  return (
    <div>
      <RepliesSection
        addReply={addReply}
        replies={replies}
        fetchReplies={fetchReplies}
        deleteReply={deleteReply}
        likeReply={likeReply}
      />
    </div>
  );
};
export default RepliesOutlet;
