import React, { lazy, Suspense } from "react";
import { homeRoutes } from "./homeRoutes";
import { userRoutes } from "./userRoutes";
import { mediaRoutes } from "./mediaRoutes";
import { aboutRoutes } from "./aboutRoutes";
import { authRoutes } from "./authRoutes";
import { contributerRoutes } from "./contributerRoutes";
import { adminRoutes } from "./adminRoutes";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { userManuals } from "./userManuals";
import { dashboardRoutes } from "./dashboardRoutes";
import ChatLayout from "@/layouts/ChatLayout";
import { chatRoutes } from "./chatRoutes";
import { prescriptionRoutes } from "./prescriptionRoutes";
import SukoonAI from "@/pages/therapy/Therapy";
const HomeLayout = lazy(() => import("@/layouts/HomeLayout"));

export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HomeLayout />
      </Suspense>
    ),
    children: [
      ...homeRoutes,
      ...userRoutes,
      ...mediaRoutes,
      ...aboutRoutes,
      ...contributerRoutes,
      ...userManuals,
      ...dashboardRoutes,
      adminRoutes,
      ...prescriptionRoutes,
    ],
  },
  ...authRoutes,
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ChatLayout />
      </Suspense>
    ),
    children: [...chatRoutes],
  },

];
