import React, { useState } from "react";
import { Form } from "react-router-dom";

import Comment from "./Comment";

const CommentSection = ({
  addComment,
  comments,
  handleDeleteComment,
  handleLikeComment,
  toggleReply,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200  my-2">
      <Form
        onSubmit={addComment}
        className="relative px-4 py-2 border-b-2 border-gray-100"
      >
        <textarea
          name="content"
          placeholder="Add a comment..."
          className="w-full p-3 pr-14 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none text-gray-700"
          rows="2"
        />
        <button
          type="submit"
          className="absolute bottom-8 right-8 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </Form>

      <div className="px-2">
        <span className="text-sm font-medium text-gray-500 p-2 inline-block">
          Comments
        </span>
        <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
          {comments &&
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-2 border-b  border-gray-100 last:border-b-0"
              >
                <Comment
                  {...{
                    comment,
                    handleDeleteComment,
                    handleLikeComment,
                    toggleReply,
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
