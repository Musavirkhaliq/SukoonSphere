import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import RenderProfileLinks from "./RenderProfileLinks";
import { useUser } from "@/context/UserContext";

const ProfileDetails = ({ user }) => {
  const { user: logedInUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to achievements if on the base profile route
  useEffect(() => {
    if (location.pathname === `/profile/${user._id}`) {
      navigate(`achievements`, { replace: true });
    }
  }, [location.pathname, navigate, user._id]);

  return (
    <>
      <div className="flex gap-2 sm:gap-4 items-center justify-start flex-wrap p-1 sm:p-2">
        {user?.role === "contributor" && (
          <>
            <RenderProfileLinks name="Articles" link="articles" />
          </>
        )}
        {user?.role === "contributor" && logedInUser?._id === user._id && (
          <>
            <RenderProfileLinks name="Videos" link="videos" />
            <RenderProfileLinks name="Podcast" link="podcasts" />
          </>
        )}
        <RenderProfileLinks name="Achievements" link="." />
        <RenderProfileLinks name="Posts" link="posts" />
        <RenderProfileLinks name="Questions" link="questions" />
        <RenderProfileLinks name="Answers" link="answers" />
        <RenderProfileLinks name="Followers" link="followers" />
        <RenderProfileLinks name="Following" link="following" />
        {logedInUser?._id === user._id && (
          <RenderProfileLinks name="Anonymous Activity" link="anonymous" />
        )}
      </div>
      <div className="mt-4">
        <Outlet context={user} />
      </div>
    </>
  );
};

export default ProfileDetails;