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
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const handleVisitProfile = () => {
    navigate(`/profile/${user?._id}`);
  };

  useEffect(() => {
    if (user?.followers && currentUser?._id) {
      setIsFollowing(user.followers.includes(currentUser._id));
    }
  }, [user?.followers, currentUser?._id]);

  return (
     <div className=" mx-auto bg-white rounded-lg overflow-hidden">
      {/* Banner Image */}
      <div className="h-48 bg-cover bg-center w-full" style={{backgroundImage: `url(${user?.avatar || `https://source.unsplash.com/random/1920x480/?sig=${user?._id}`})`}}>
      </div>
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="absolute -top-12 left-6">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Anonymous")}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3">
          {isOwnProfile ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1 text-gray-600 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Edit profile
            </button>
          ) : (
            <>
              <button onClick={handleFollowUnfollow} className="px-6 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </>
          )}
          <button onClick={handleVisitProfile} className="px-3 py-1 text-gray-600 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
            Message
          </button>
        </div>

        {/* Profile Info */}
        <div className="mt-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {user?.name }
          </h1>
          <p className="text-sm text-gray-600 mt-1">Mental Health Expert</p>
            {/* Stats */}
            <div className="flex gap-4 mt-2">
            <a href="#" className="text-xs md:text-sm text-[var(--grey--900)] hover:underline">
              <span className="font-semibold text-gray-900">{user?.counts?.totalPosts || 0}</span> posts
            </a>
            <a href="#" className="text-xs md:text-sm text-[var(--grey--900)] hover:underline">
              <span className="font-semibold text-gray-900">{user?.articles?.length || 0}</span> articles
            </a>
            <a href="#" className="text-xs md:text-sm text-[var(--grey--900)] hover:underline">
              <span className="font-semibold text-gray-900">{user?.questions?.length || 0}</span> questions
            </a>
            <a href="#" className="text-xs md:text-sm text-[var(--grey--900)] hover:underline">
              <span className="font-semibold text-gray-900">{user?.answers?.length || 0}</span> answers
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet nulla auctor, vestibulum magna sed, convallis ex.
          </p>
          
        

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
