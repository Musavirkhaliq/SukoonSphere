import { Outlet, redirect } from "react-router-dom";
import { Wrapper } from "../assets/styles/HomeLayout";
import { ScrollRestoration } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { Chat } from "@/pages";

// Lazy load components
const Header = lazy(() => import("../components/shared/Header"));

const ChatLayout = () => {
  return (
    <Wrapper>
      <ScrollRestoration />
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </Wrapper>
  );
};

export default ChatLayout;
