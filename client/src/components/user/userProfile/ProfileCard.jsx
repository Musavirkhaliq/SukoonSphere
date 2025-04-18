import { useUser } from "@/context/UserContext";
import UserProfileModel from "../modals/UserProfileModel";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { 
  FaFire, FaCrown, FaMedal, FaStar, 
  FaGem, FaPalette, FaUserEdit, FaTimes,
  FaCheck, FaUnlock, FaLock, FaTrophy,
  FaUserCircle, FaImage, FaLayerGroup
} from "react-icons/fa";
import AvatarCustomizerModal from "./avatarCustamization/AvatarCustomizerModal";
import { data } from "autoprefixer";

// Avatar frames and accessories data
const avatarFrames = [
  { id: 'default', name: 'Default', minPoints: 0, color: 'ring-gray-200', icon: <FaUserCircle /> },
  { id: 'bronze', name: 'Bronze', minPoints: 50, color: 'ring-amber-700', icon: <FaMedal className="text-amber-700" /> },
  { id: 'silver', name: 'Silver', minPoints: 300, color: 'ring-gray-600', icon: <FaMedal className="text-gray-400" /> },
  { id: 'gold', name: 'Gold', minPoints: 1200, color: 'ring-yellow-400', icon: <FaTrophy className="text-yellow-500" /> },
  { id: 'diamond', name: 'Diamond', minPoints: 2000, color: 'ring-blue-400', icon: <FaGem className="text-blue-400" /> },
  { id: 'elite', name: 'Elite', minPoints: 5000, color: 'ring-purple-500', icon: <FaCrown className="text-purple-500" /> },
];

const avatarAccessories = [
  { id: 'star', name: 'Star Badge', minPoints: 100, icon: <FaStar className="text-yellow-400" />, position: 'top-0 right-0' },
  { id: 'verified', name: 'Verified Mark', minPoints: 500, icon: <FaCheck className="text-blue-500" />, position: 'bottom-0 right-0' },
  { id: 'crown', name: 'Crown', minPoints: 1500, icon: <FaCrown className="text-yellow-500" />, position: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2' },
  { id: 'gem', name: 'Gem', minPoints: 2500, icon: <FaGem className="text-purple-500" />, position: 'bottom-0 left-0' },
];

// Community titles aligned with avatar frames
const communityTitles = [
  {
    id: "default",
    name: "Community Member",
    minPoints: 0,
    color: "text-cyan-500", // Bright cyan for a fresh, welcoming vibe
    icon: <FaUserCircle className="text-cyan-500" />,
  },
  {
    id: "bronze",
    name: "Active Member",
    minPoints: 50,
    color: "text-orange-500", // Vibrant orange for energy and enthusiasm
    icon: <FaStar className="text-orange-500" />,
  },
  {
    id: "silver",
    name: "Elite Member",
    minPoints: 300,
    color: "text-teal-400", // Lively teal for a modern, elite feel
    icon: <FaStar className="text-teal-400" />,
  },
  {
    id: "gold",
    name: "Top Contributor",
    minPoints: 1200,
    color: "text-yellow-400", // Brightened yellow for prestige and warmth
    icon: <FaTrophy className="text-yellow-400" />,
  },
  {
    id: "diamond",
    name: "Community Leader",
    minPoints: 2000,
    color: "text-blue-400", // Kept as is; already vibrant and fitting for leadership
    icon: <FaGem className="text-blue-400" />,
  },
  {
    id: "elite",
    name: "Elite Leader",
    minPoints: 5000,
    color: "text-purple-500", // Kept as is; vibrant and regal
    icon: <FaCrown className="text-purple-500" />,
  },
];

// Utility functions
const getAvailableFrames = (points) => avatarFrames.filter(frame => points >= frame.minPoints);
const getAvailableAccessories = (points) => avatarAccessories.filter(accessory => points >= accessory.minPoints);
const getCommunityStatus = (points) => {
  return communityTitles
    .filter(title => points >= title.minPoints)
    .sort((a, b) => b.minPoints - a.minPoints)[0] || communityTitles[0];
};

// Avatar Display Component
const AvatarDisplay = ({ user, currentFrame, isOwnProfile, setShowAvatarCustomizer }) => (
  <div className="relative">
    <div className={`relative inline-block ${currentFrame.color} ring-4 rounded-full`}>
      <img
        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Anonymous")}`}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover"
      />
      {user?.avatarAccessories?.map(accId => {
        const accessory = avatarAccessories.find(a => a.id === accId);
        if (!accessory) return null;
        return (
          <div key={accId} className={`absolute ${accessory.position} w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm`}>
            {accessory.icon}
          </div>
        );
      })}
    </div>
    {/* {data?.rank && (
      <div className={`absolute -bottom-2 -right-2 ${user.rank === 1 ? 'bg-yellow-500' : user.rank <= 3 ? 'bg-yellow-400' : user.rank <= 10 ? 'bg-blue-400' : 'bg-gray-300'} text-gray-900 rounded-full px-2 py-1 text-xs font-bold shadow-md`}>
        #{data.user.rank} {user.rank === 1 && '🏆'}
      </div>
    )} */}
    {/* {isOwnProfile && (
      <button
        onClick={() => setShowAvatarCustomizer(true)}
        className="absolute -bottom-2 -left-2 bg-white text-blue-500 rounded-full p-1 shadow-md hover:bg-blue-50 transition-colors"
        title="Customize Avatar"
      >
        <FaUserEdit size={14} />
      </button>
    )} */}
  </div>
);

// User Info Component
const UserInfo = ({ user, isOwnProfile }) => {
  const nextUnlock = [avatarFrames, avatarAccessories]
    .flat()
    .filter(item => item.minPoints > user.currentPoints)
    .sort((a, b) => a.minPoints - b.minPoints)[0];

  return (
    <div className="mt-4 text-center md:text-left">
      <h1 className="text-xl font-semibold text-gray-900">{user?.name}</h1>
      {user?.role === "contributor" && (
        <p className="text-sm text-gray-600">Mental Health Expert</p>
      )}
      {user?.currentPoints >= 0 && (
        <div className="flex gap-2">
          <h4 className="text-sm font-medium text-gray-600">Title:</h4>
          <p className={`text-sm flex items-center gap-1 ${getCommunityStatus(user.currentPoints).color}`}>
             {getCommunityStatus(user.currentPoints).icon}
            <span className="font-medium">{getCommunityStatus(user.currentPoints).name}</span>
          </p>
        </div>
      )}
      {user?.currentPoints > 0 && isOwnProfile && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>{user.currentPoints} points</span> {" "}
            {nextUnlock ? (
              <span className="text-blue-500"> 
               &nbsp; Next: {nextUnlock.minPoints - user.currentPoints} pts to {nextUnlock.name}
              </span>
            ) : (
              <span className="text-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">All items unlocked!</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (user.currentPoints / avatarFrames[avatarFrames.length-1].minPoints) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
      {user?.streakCount > 0 && (
        <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
          <FaFire className="text-orange-500" />
          <span className="font-medium">{user.streakCount} Day Streak</span>
        </p>
      )}
    </div>
  );
};

// Stats Grid Component
const StatsGrid = ({ user }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-xl font-semibold text-gray-900">{user?.counts?.totalPosts || 0}</div>
      <div className="text-sm text-gray-600">Posts</div>
    </div>
    {user?.role === "contributor" && (
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xl font-semibold text-gray-900">{user?.counts?.totalArticles || 0}</div>
        <div className="text-sm text-gray-600">Articles</div>
      </div>
    )}
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-xl font-semibold text-gray-900">{user?.counts?.totalQuestions || 0}</div>
      <div className="text-sm text-gray-600">Questions</div>
    </div>
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-xl font-semibold text-gray-900">{user?.counts?.totalAnswers || 0}</div>
      <div className="text-sm text-gray-600">Answers</div>
    </div>
  </div>
);

// Action Buttons Component
const ActionButtons = ({ user, currentUser, isOwnProfile, isFollowing, handleFollowUnfollow, handleMessageClick, setShowModal, setShowAvatarCustomizer }) => (
  <div className="flex gap-3 justify-end flex-wrap">
    {isOwnProfile ? (
      <>
        <button
          onClick={() => setShowAvatarCustomizer(true)}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
        >
          <FaImage className="text-blue-500" /> Customize Avatar
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Edit Profile
        </button>
      </>
    ) : (
      <>
        <button
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
        </button>
      </>
    )}
    {(user?.role === "user" && user?._id !== currentUser?._id && currentUser?.role === "contributor") && (
      <Link to={`/prescription/${user?._id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
        Give Prescription
      </Link>
    )}
    <Link
      to={`/about/user/${user?._id}/achievements`}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      View Achievements
    </Link>
    {user._id === currentUser?._id && currentUser?.role !== "contributor" && (
      <Link
        to={`/prescriptions/${currentUser?._id}`}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        See prescriptions
      </Link>
    )}
  </div>
);

// Main ProfileCard Component
const ProfileCard = ({ user, fetchUserById }) => {
  const { updateUser, user: currentUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(user?.avatarFrame || 'default');
  const [selectedAccessories, setSelectedAccessories] = useState(user?.avatarAccessories || []);
  const [isFollowing, setIsFollowing] = useState(user?.followers?.includes(currentUser?._id));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isOwnProfile = currentUser?._id === user?._id;

  const currentFrame = avatarFrames.find(frame => frame.id === (user?.avatarFrame || 'default')) || avatarFrames[0];

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

  const updateAvatarCustomizationMutation = useMutation({
    mutationFn: async (customizationData) => {
      const response = await customFetch.patch(`/user/avatar-customization`, customizationData);
      return response.data;
    },
    onSuccess: () => {
      setShowAvatarCustomizer(false);
      fetchUserById();
      toast.success("Avatar customized successfully!");
      queryClient.invalidateQueries(["user", user?._id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update avatar");
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
      toast.success(data.isFollowing ? "Followed successfully" : "Unfollowed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.msg || "Something went wrong. Please try again.");
    },
  });

  const handleProfileUpdate = (formData) => {
    if (isOwnProfile) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handleSaveAvatarCustomization = () => {
    if (isOwnProfile) {
      updateAvatarCustomizationMutation.mutate({
        avatarFrame: selectedFrame,
        avatarAccessories: selectedAccessories
      });
    }
  };

  const toggleAccessory = (accessoryId) => {
    if (selectedAccessories.includes(accessoryId)) {
      setSelectedAccessories(selectedAccessories.filter(id => id !== accessoryId));
    } else {
      setSelectedAccessories([...selectedAccessories, accessoryId]);
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
      navigate(`/chats/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send message");
    }
  };

  useEffect(() => {
    if (user?.followers && currentUser?._id) {
      setIsFollowing(user.followers.includes(currentUser._id));
    }
    if (user?.avatarFrame) {
      setSelectedFrame(user.avatarFrame);
    }
    if (user?.avatarAccessories) {
      setSelectedAccessories(user.avatarAccessories);
    }
  }, [user?.followers, currentUser?._id, user?.avatarFrame, user?.avatarAccessories]);

  return (
    <div className="mx-auto bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center md:items-start">
          <AvatarDisplay
            user={user}
            currentFrame={currentFrame}
            isOwnProfile={isOwnProfile}
            setShowAvatarCustomizer={setShowAvatarCustomizer}
          />
          <UserInfo user={user} isOwnProfile={isOwnProfile} />
        </div>
        <div className="flex-1">
          <StatsGrid user={user} />
          <ActionButtons
            user={user}
            currentUser={currentUser}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            handleFollowUnfollow={handleFollowUnfollow}
            handleMessageClick={handleMessageClick}
            setShowModal={setShowModal}
            setShowAvatarCustomizer={setShowAvatarCustomizer}
          />
        </div>
      </div>
      {showModal && (
        <UserProfileModel
          onClose={() => setShowModal(false)}
          user={user}
          handleProfileUpdate={handleProfileUpdate}
        />
      )}
      <AvatarCustomizerModal
        show={showAvatarCustomizer}
        onClose={() => setShowAvatarCustomizer(false)}
        user={user}
        selectedFrame={selectedFrame}
        setSelectedFrame={setSelectedFrame}
        selectedAccessories={selectedAccessories}
        toggleAccessory={toggleAccessory}
        handleSaveAvatarCustomization={handleSaveAvatarCustomization}
        avatarFrames={avatarFrames}
        avatarAccessories={avatarAccessories}
        communityTitles={communityTitles}
      />
    </div>
  );
};

export default ProfileCard;