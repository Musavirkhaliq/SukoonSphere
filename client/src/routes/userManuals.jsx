import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import HowToCreateAVideo from "@/pages/userManuals/HowToCreateAVideo";
import HowToCreateAnArticle from "@/pages/userManuals/HowToCreateAnArticle";
import HowToCreateAPodcast from "@/pages/userManuals/HowToCreateAPodcast";
import UserManual from "@/pages/userManuals/UserManual";

export const userManuals = [
  {
    path: "/user-manual",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <UserManual />
      </Suspense>
    ),
  },
  {
    path: "/user-manual/create-video",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HowToCreateAVideo />
      </Suspense>
    ),
  },
  {
    path: "/user-manual/create-article",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HowToCreateAnArticle />
      </Suspense>
    ),
  },
  {
    path: "/user-manual/create-podcast",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HowToCreateAPodcast />
      </Suspense>
    ),
  },
];
