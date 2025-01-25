import React, { useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import PostCard from "@/components/posts/PostCard";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const SinglePost = () => {
  const [showComments, setShowComments] = useState(true);
  const { post } = useLoaderData();
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(post?.totalComments);
  const { user } = useUser();
  const fetchComments = async () => {
    try {
      const { data } = await customFetch.get(`/posts/${post._id}/comments`);
      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post?._id, showComments, post?.totalComments]);


  const addComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add a comment!");
      return;
    }
    const formData = new FormData(e.target);
    const content = formData.get("content");
    try {
      const { data } = await customFetch.post(`/posts/${post._id}/comments`, {
        content,
      });
      e.target.reset();
      await fetchComments();
      setTotalComments(totalComments + 1);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await customFetch.delete(`/posts/comments/${commentId}`);
      await fetchComments();
      setTotalComments(totalComments - 1);
    } catch (error) {
      console.log({ error });
    }
  };
  const handleLikeComment = async (commentId) => {
    try {
      const { data } = await customFetch.patch(
        `/posts/comments/${commentId}/like`
      );
    } catch (error) {
      console.log({ likeError: error });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PostCard
        post={post}
        totalComments={totalComments}
        comment="type"
        onCommentClick={() => setShowComments((prev) => !prev)}
        user={user}
      />
      <Outlet
        context={{
          addComment,
          handleDeleteComment,
          comments,
          handleLikeComment,
        }}
      />
    </div>
  );
};

export default SinglePost;
