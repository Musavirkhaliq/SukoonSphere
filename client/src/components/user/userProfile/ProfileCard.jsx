import { useUser } from "@/context/UserContext";
import UserProfileModel from "../modals/UserProfileModel";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { FaFire } from "react-icons/fa";

const ProfileCard = ({ user, fetchUserById }) => {
  const { updateUser, user: currentUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );
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
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const { data } = await customFetch.post(`user/follow/${user?._id}`);
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
      toast.error(
        error.response?.data?.msg || "Something went wrong. Please try again."
      );
    },
  });

  const handleProfileUpdate = (formData) => {
    if (isOwnProfile) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handleFollowUnfollow = () => {
    if (!isOwnProfile) {
      followMutation.mutate();
    }
  };
  const handleMessageClick = async () => {
    try {
      const { data } = await customFetch.post(`chats`, { _userId: user._id });
      console.log({ data });
      navigate(`/chats/${data._id}`);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.msg || "Failed to send message");
    }
  };
  useEffect(() => {
    if (user?.followers && currentUser?._id) {
      setIsFollowing(user.followers.includes(currentUser._id));
    }
  }, [user?.followers, currentUser?._id]);

  return (
    <div className=" mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Profile Image and Basic Info */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "Anonymous")}`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-100"
            />
            {user?.rank && (
              <div className={`absolute -bottom-2 -right-2 ${user.rank === 1 ? 'bg-yellow-500' : user.rank <= 3 ? 'bg-yellow-400' : user.rank <= 10 ? 'bg-blue-400' : 'bg-gray-300'} text-gray-900 rounded-full px-2 py-1 text-xs font-bold shadow-md`}>
                #{user.rank} {user.rank === 1 && '🏆'}
              </div>
            )}
          </div>
          <div className="mt-4 text-center md:text-left">
            <h1 className="text-xl font-semibold text-gray-900">
              {user?.name}
            </h1>
            {user?.role === "contributor" && (
              <p className="text-sm text-gray-600">Mental Health Expert</p>
            )}
            {user?.rank && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                {user.rank === 1 ? (
                  <span className="text-yellow-600 font-medium">Community Leader 🏆</span>
                ) : user.rank <= 3 ? (
                  <span className="text-yellow-600 font-medium">Top Contributor 🥇</span>
                ) : user.rank <= 10 ? (
                  <span className="text-blue-600 font-medium">Elite Member 🌟</span>
                ) : user.rank <= 50 ? (
                  <span className="text-purple-600 font-medium">Active Member</span>
                ) : (
                  <span>Community Member</span>
                )}
              </p>
            )}

            {/* Streak Badge */}
            {user?.streakCount > 0 && (
              <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                <FaFire className="text-orange-500" />
                <span className="font-medium">{user.streakCount} Day Streak</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Stats and Actions */}
        <div className="flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-semibold text-gray-900">
                {user?.counts?.totalPosts || 0}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            {user?.role === "contributor" && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-semibold text-gray-900">
                  {user?.counts?.totalArticles || 0}
                </div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-semibold text-gray-900">
                {user?.counts?.totalQuestions || 0}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-semibold text-gray-900">
                {user?.counts?.totalAnswers || 0}
              </div>
              <div className="text-sm text-gray-600">Answers</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end flex-wrap">
            {isOwnProfile ? (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <><button
                onClick={handleFollowUnfollow}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
                <button
                  onClick={handleMessageClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Message
                </button></>
            )}
            {
              (user?.role === "user" && user?._id !== currentUser?._id && currentUser?.role === "contributor") && (
                <Link to={`/prescription/${user?._id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Give Prescription
                </Link>
              )}
            {/* Show View Achievements button for all users */}
            <Link
              to={`/about/user/${user?._id}/achievements`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Achievements
            </Link>
            {user._id === currentUser?._id &&
              currentUser?.role !== "contributor" && (
                <Link
                  to={`/prescriptions/${currentUser?._id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  See prescriptions
                </Link>
              )}
          </div>
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
