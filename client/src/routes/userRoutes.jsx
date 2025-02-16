import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { UserAnswers } from "@/components";
import Articles from "@/pages/contributors/Articles";
const UserProfile = lazy(() => import("../pages/about/UserProfile"));
const UserPosts = lazy(
  () => import("../components/user/userProfile/UserPosts")
);
const UserQuestions = lazy(
  () => import("../components/user/userProfile/UserQuestion")
);
const UserFollowers = lazy(
  () => import("../components/user/userProfile/UserFollowers")
);
const UserFollowing = lazy(
  () => import("../components/user/userProfile/UserFollowing")
);

// Import the loader functions

import { userFollowersLoader } from "@/loaders/userFollowersLoader";
import { userFollowingLoader } from "@/loaders/userFollowingLoader";
import Videos from "@/pages/contributors/videos/Videos";
import { PodcastHome } from "@/pages";
import ContributorPodcasts from "@/pages/contributors/podcasts/ContributorPodcasts";
import Chat from "@/pages/chats/Chat";
import ChatOutlet from "@/pages/chats/ChatOutlet";

export const userRoutes = [
  // Users Routes
  {
    path: "about/user/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <UserProfile />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserPosts />
          </Suspense>
        ),
      },
      {
        path: "questions",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserQuestions />
          </Suspense>
        ),
      },
      {
        path: "answers",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserAnswers />
          </Suspense>
        ),
      },
      {
        path: "followers",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserFollowers />
          </Suspense>
        ),
        loader: userFollowersLoader,
      },
      {
        path: "following",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserFollowing />
          </Suspense>
        ),
        loader: userFollowingLoader,
      },
      {
        path: "articles",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Articles />
          </Suspense>
        ),
      },
      {
        path: "videos",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Videos />
          </Suspense>
        ),
      },
      {
        path: "podcasts",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContributorPodcasts />
          </Suspense>
        ),
      },
    ],
  },
];
