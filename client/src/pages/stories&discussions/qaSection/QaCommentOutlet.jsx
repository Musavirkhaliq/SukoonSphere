import { CommentSection } from "@/components/shared/Comments";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const QaCommentOutlet = () => {
  const { user } = useUser();
  const { answer, setTotalComments } = useOutletContext();
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
    const { data } = await customFetch.get(
      `/qa-section/answer/${answer._id}/all-comments`
    );
    setComments(data.comments);
  };
  const addComment = async (e) => {
    if (!user) {
      toast.error("Please login to add a comment");
      return;
    }
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    try {
      await customFetch.post(`/qa-section/answer/${answer._id}/add-comment`, {
        content,
      });
      e.target.reset();
      await fetchComments();
      setTotalComments((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await customFetch.delete(
        `/qa-section/question/answer/comments/${commentId}`
      );
      await fetchComments();
      setTotalComments((prev) => prev - 1);
    } catch (error) {
      console.log({ error });
    }
  };
  const handleLikeComment = async (commentId) => {
    try {
      await customFetch.patch(
        `/qa-section/question/answer/comments/${commentId}/like`
      );
    } catch (error) {
      console.log({ likeError: error });
    }
  };
  useEffect(() => {
    fetchComments();
  }, [answer._id]);
  return (
    <CommentSection
      addComment={addComment}
      comments={comments}
      handleDeleteComment={handleDeleteComment}
      handleLikeComment={handleLikeComment}
      toggleReply={true}
    />
  );
};
export default QaCommentOutlet;
