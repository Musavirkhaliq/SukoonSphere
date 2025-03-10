import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { Chat } from "@/pages";
import ChatOutlet from "@/pages/chats/ChatOutlet";
import { DefaultChat } from "@/components";

export const chatRoutes = [
  {
    path: "/chats",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Chat />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <DefaultChat />, 
      },
      {
        path: ":id",
        element: <ChatOutlet />,
      },
    ],
  },
];
