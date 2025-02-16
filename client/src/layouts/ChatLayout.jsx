import { Outlet } from "react-router-dom";
import { Wrapper } from "../assets/styles/HomeLayout";
import { ScrollRestoration } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";


// Lazy load components
const NavMenu = lazy(() => import("../components/homeComponents/HeaderComponents/NavMenu"));

const ChatLayout = () => {
  return (
    <Wrapper>
      <ScrollRestoration />
      <Suspense fallback={<LoadingSpinner />}>
        <NavMenu showMobile={false} />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </Wrapper>
  );
};

export default ChatLayout;
