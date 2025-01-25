import RepliesSection from "@/components/shared/replies/RepliesSection";
import customFetch from "@/utils/customFetch";
import { deleteRange } from "quill/modules/keyboard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QaRepliesOutlet = () => {
  const { commentId } = useParams();
  const [replies, setReplies] = useState([]);
  const fetchReplies = async () => {
    try {
      const { data } = await customFetch.get(
        `/qa-section/answer/comments/${commentId}/replies`
      );
      setReplies(data.replies);
    } catch (error) {
      console.log(error);
    }
  };
  const addReply = async (commentId, content) => {
    try {
      const { data } = await customFetch.post(
        `/qa-section/answer/comments/${commentId}/replies`,
        { content }
      );
      fetchReplies();
    } catch (error) {
      console.log({ replyError: error });
    }
  };
  const deleteReply = async (replyId) => {
    try {
      await customFetch.delete(
        `/qa-section/question/answer/comments/reply/${replyId}`
      );
      fetchReplies();
    } catch (error) {
      console.log(error);
    }
  };
  const likeReply = async (replyId) => {
    try {
      await customFetch.patch(
        `/qa-section/question/answer/comments/reply/${replyId}/like`
      );
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
export default QaRepliesOutlet;
