import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { Chat } from "@/pages";
import ChatOutlet from "@/pages/chats/ChatOutlet";

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
        element: <h1>ChatOutletDatanewJIbrish</h1>,
      },
      {
        path: ":id",
        element: <ChatOutlet />,
      },
    ],
  },
];
