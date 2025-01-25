import { useUser } from "@/context/UserContext";
import UserProfileModel from "../modals/UserProfileModel";
import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaQuestion,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
} from "react-icons/fa";
import { FcAnswers } from "react-icons/fc";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProfileCard = ({ user, fetchUserById }) => {
  const { id: paramsId } = useParams();
  const { updateUser, user: currentUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const queryClient = useQueryClient();

  const isOwnProfile = currentUser?._id === user?._id;

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await updateUser(formData);
      return response;
    },
    onSuccess: () => {
      setShowModal(false);
      fetchUserById();
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["user", user?._id]);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const { data } = await customFetch.patch(`user/follow/${user?._id}`);
      return data;
    },
    onSuccess: (data) => {
      setIsFollowing(data.isFollowing);
      fetchUserById();
      queryClient.invalidateQueries(["user", user?._id]);
      toast.success(
        data.isFollowing ? "Followed successfully" : "Unfollowed successfully"
      );
    },
    onError: (error) => {
      console.error("Error following/unfollowing user:", error);
      toast.error(
        error.response?.data?.msg || "Something went wrong. Please try again."
      );
    },
  });

  const handleProfileUpdate = async (formData) => {
    if (isOwnProfile) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handleFollowUnfollow = async () => {
    if (!isOwnProfile) {
      followMutation.mutate();
    }
  };

  useEffect(() => {
    if (user?.followers && currentUser?._id) {
      setIsFollowing(user.followers.includes(currentUser._id));
    }
  }, [user?.followers, currentUser?._id]);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 max-w-7xl mx-auto">
      <div className="relative h-32 rounded-t-2xl overflow-hidden">
        <img
          src={
            user?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Anonymous")}&background=random`
          }
          alt="Profile"
          className="w-full h-full object-cover rounded-t-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="px-4 pb-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center -mt-12">
          <div className="relative">
            <div className="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Anonymous")}&background=random`
                }
                alt="Profile"
                className="rounded-full w-24 h-24 border-4 border-white shadow-lg object-cover transform hover:scale-105 transition-transform duration-300"
              />
              {isOwnProfile ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-0 right-0 bg-[var(--ternery)] text-white p-2 rounded-full shadow-lg hover:bg-[var(--secondary)] transition-colors duration-300"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
              ) : (
                <div className="absolute bottom-0 right-0">
                  <button
                    onClick={handleFollowUnfollow}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`p-2 rounded-full shadow-lg ${
                      isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600"
                        : "bg-[var(--ternery)] text-white hover:bg-[var(--secondary)]"
                    } transition-all duration-300`}
                  >
                    {isFollowing ? (
                      <FaUserMinus className="h-4 w-4" />
                    ) : (
                      <FaUserPlus className="h-4 w-4" />
                    )}
                  </button>
                  {showTooltip && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
                      {isFollowing ? "Unfollow" : "Follow"}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <h1 className="text-2xl font-bold text-gray-800 hover:text-[var(--ternery)] transition-colors duration-300">
              {user?.name || "Anonymous"}
            </h1>
          </div>
          {!isOwnProfile && (
            <p className="text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors duration-300">
              {isFollowing ? "Following" : "Not Following"}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex justify-center space-x-8 mt-4 border-y border-gray-100 py-3">
          <div className="text-center group cursor-pointer">
            <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">
              {user?.posts?.length || 0}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
              Posts
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">
              {user?.followers?.length || 0}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
              Followers
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="font-bold text-gray-800 group-hover:text-[var(--ternery)] transition-colors duration-300">
              {user?.following?.length || 0}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
              Following
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="mt-4 flex justify-center items-center gap-6">
          <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
            <FaQuestion className="text-pink-500 text-xl mb-1 group-hover:text-pink-600" />
            <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">
              {user?.questions?.length || 0}
            </div>
            <div className="text-xs text-gray-500 group-hover:text-gray-700">
              Questions Asked
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
            <FcAnswers className="text-blue-500 text-xl mb-1 group-hover:text-blue-600" />
            <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">
              {user?.answers?.length || 0}
            </div>
            <div className="text-xs text-gray-500 group-hover:text-gray-700">
              Answers Posted
            </div>
          </div>
          {user?.role === "contributor" && (
            <div className="flex flex-col items-center justify-center text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <FaBookmark className="text-purple-500 text-xl mb-1 group-hover:text-purple-600" />
              <div className="text-sm font-semibold group-hover:text-[var(--ternery)]">
                {user?.articles?.length || 0}
              </div>
              <div className="text-xs text-gray-500 group-hover:text-gray-700">
                Articles Posted
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <UserProfileModel
          onClose={() => setShowModal(false)}
          user={user}
          handleProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfileCard;
