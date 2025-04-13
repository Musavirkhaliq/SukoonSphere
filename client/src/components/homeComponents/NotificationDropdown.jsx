import React, { useEffect, useState } from "react";
import { IoNotifications, IoClose } from "react-icons/io5";
import customFetch from "@/utils/customFetch";
import socket from "@/utils/socket/socket";

import {
  PostLikeNotification,
  PostReplyLikeNotification,
  PostReactionNotification,
  PostCommentReactionNotification,
  PostReplyReactionNotification,
} from "../notifications/PostNotificationCards";
import {
  PostCommentLikeNotification,
  PostCommentNotification,
  PostReplyNotification,
} from "../notifications/PostNotificationCards";
import {
  QuestionAnsweredNotification,
  AnswerLikedNotification,
  AnswerCommentLikedNotification,
  AnswerCommentNotification,
  AnswerReplyLikedNotification,
  AnswerCommentReplyLikedNotification,
  AnswerReplyNotification,
} from "../notifications/QaSectionNotificationCards";
import {
  ArticleCommentLikedNotification,
  ArticleCommentNotification,
  ArticleCommentReplyLikedNotification,
  ArticleLikedNotification,
  ArticleReplyNotification,
} from "../notifications/ArticleNotificationCards";
import { FollowNotification } from "../notifications/UserNotificationCards";
import { RequestChatNotification } from "../notifications/RequestChatNotification";

const Dropdown = ({ user, onClose }) => {
  const [items, setItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const fetchItems = async () => {
    try {
      const { data } = await customFetch.get(`/notifications/${user?._id}`);
      setItems(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    socket.emit("join", user._id);
    requestAnimationFrame(() => setIsVisible(true));
    socket.on("notification", (item) => {
      setItems((prevItems) => [item, ...prevItems]);
    });
    return () => {
      socket.off("notification");
    };
  }, [user]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/40 z-[70] transition-opacity duration-300"
          onClick={handleClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0
                  w-full sm:w-[85%] md:w-[450px] lg:w-[450px] xl:w-[500px] 2xl:w-[550px]
                  h-screen sm:h-screen md:max-h-[20vh] lg:max-h-[60vh] xl:max-h-[50vh] 2xl:max-h-[60vh]
                  xl:top-[70px] 2xl:top-[80px]
                  bg-white z-[80]
                  transform transition-transform duration-300 ease-in-out
                  overflow-hidden
                  shadow-xl rounded-none xl:rounded-lg
                  ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="sticky top-0 flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100 bg-white z-10">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base sm:text-lg">
            <IoNotifications className="w-5 h-5 text-[var(--grey--900)]" />
            Notifications
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notifications"
          >
            <IoClose className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="h-[calc(100%-60px)] w-full overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
              <IoNotifications className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2 sm:mb-3" />
              <p className="text-gray-500 text-sm sm:text-base">No notifications yet</p>
            </div>
          ) : (
            <div className="h-full custom-scrollbar overflow-y-auto pb-4">
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => {
                  switch (item.type) {
                    // Post related Notification cases
                    case "like":
                      return <PostLikeNotification key={index} item={item} />;
                    case "comment":
                      return <PostCommentNotification key={index} item={item} />;
                    case "reply":
                      return <PostReplyNotification key={index} item={item} />;
                    case "commentLiked":
                      return (
                        <PostCommentLikeNotification key={index} item={item} />
                      );
                    case "replyLiked":
                      return (
                        <PostReplyLikeNotification key={index} item={item} />
                      );
                    // New reaction notification cases
                    case "reaction":
                      return <PostReactionNotification key={index} item={item} />;
                    case "commentReaction":
                      return <PostCommentReactionNotification key={index} item={item} />;
                    case "replyReaction":
                      return <PostReplyReactionNotification key={index} item={item} />;

                    // QaSection Notification cases
                    case "answered":
                      return (
                        <QuestionAnsweredNotification key={index} item={item} />
                      );
                    case "answerComment":
                      return (
                        <AnswerCommentNotification key={index} item={item} />
                      );
                    case "answerLiked":
                      return <AnswerLikedNotification key={index} item={item} />;
                    case "answerCommentLiked":
                      return (
                        <AnswerCommentLikedNotification key={index} item={item} />
                      );
                    case "answerCommentReplyLiked":
                      return (
                        <AnswerCommentReplyLikedNotification
                          key={index}
                          item={item}
                        />
                      );
                    case "answerReplyLiked":
                      return (
                        <AnswerReplyLikedNotification key={index} item={item} />
                      );
                    case "answerReply":
                      return <AnswerReplyNotification key={index} item={item} />;

                    // Article Notification cases
                    case "articleLiked":
                      return <ArticleLikedNotification key={index} item={item} />;
                    case "articleComment":
                      return (
                        <ArticleCommentNotification key={index} item={item} />
                      );
                    case "articleReply":
                      return <ArticleReplyNotification key={index} item={item} />;
                    case "articleCommentLiked":
                      return (
                        <ArticleCommentLikedNotification
                          key={index}
                          item={item}
                        />
                      );
                    case "articleCommentReplyLiked":
                      return (
                        <ArticleCommentReplyLikedNotification
                          key={index}
                          item={item}
                        />
                      );
                    // User Notification cases
                    case "follow":
                      return <FollowNotification key={index} item={item} />;
                    case "requestChat":
                      return <RequestChatNotification key={index} item={item} />;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dropdown;