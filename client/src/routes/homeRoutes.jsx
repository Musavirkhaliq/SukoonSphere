import React, { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const Articles = lazy(() => import("../pages/articles&resources/articles/Articles"));
const Posts = lazy(() => import("../pages/stories&discussions/posts/Posts"));
const Answer = lazy(() => import("../pages/stories&discussions/qaSection/answer/Answer"));
const Article = lazy(() => import("../pages/articles&resources/articles/Article"));
const AllQuestionAnswers = lazy(() => import("../pages/stories&discussions/qaSection/AllQuestionAnswers"));

// Keep the loader as 
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

import { answerAction } from "@/pages/stories&discussions/qaSection/answer/Answer";
import AllPosts from "@/pages/stories&discussions/posts/AllPosts";
import SinglePost from "@/pages/stories&discussions/posts/SinglePost";
import CommentsOutlet from "@/pages/stories&discussions/posts/CommentsOutlet";
import RepliesOutlet from "@/pages/stories&discussions/posts/RepliesOutlet";

import QaSection, { questionsAction } from "@/pages/stories&discussions/qaSection/QaSection";
import QaOutlet from "@/pages/stories&discussions/qaSection/QaOutlet";
import QaCommentOutlet from "@/pages/stories&discussions/qaSection/QaCommentOutlet";
import QaRepliesOutlet from "@/pages/stories&discussions/qaSection/QaRepliesOutlet";
import { SingleAnswerOutlet } from "@/pages";

import { SingleAnswerOutletloader } from "@/loaders/SingleAnswerOutletloader";
import { questionsLoader } from "@/loaders/questionsLoader";
import { answersLoader } from "@/loaders/answersLoader";
import { allPostsLoader } from "@/loaders/allPostsLoader";
import { singlePostLoader } from "@/loaders/singlePostLoader";
import { homeLoader } from "@/loaders/homeLoader";

export const homeRoutes = [
  {
    index: true,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
    loader: homeLoader
  },
  {
    path: "/QA-section",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <QaSection />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <QaOutlet />,
      },
      {
        path: "question/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AllQuestionAnswers />
          </Suspense>
        ),
      },
      {
        path: "question/answer/:id/comments",
        element: <SingleAnswerOutlet />,
        children: [
          {
            index: true,
            element: <QaCommentOutlet />,
          },
          {
            path: ":commentId/reply",
            element: <QaRepliesOutlet />,
          },
        ],
        loader: SingleAnswerOutletloader,
      },
    ],
    action: questionsAction,
    loader: questionsLoader,
  },
  {
    path: "/answer",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Answer />
      </Suspense>
    ),
    loader: answersLoader,
    action: answerAction,
  },
  {
    path: "/articles",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Articles />
      </Suspense>
    ),
  },
  {
    path: "/articles/article/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Article />
      </Suspense>
    ),
  },
  {
    path: "/posts",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Posts />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AllPosts />
          </Suspense>
        ),
        loader: allPostsLoader,
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SinglePost />
          </Suspense>
        ),
        loader: singlePostLoader,
        children: [
          {
            index: true,
            element: <CommentsOutlet />,
          },
          {
            path: "comment-id/:commentId",
            element: (
              <Suspense key={location.key} fallback={<LoadingSpinner />}>
                <RepliesOutlet />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
