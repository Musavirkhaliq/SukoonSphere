import React, { useState } from "react";

import { useLoaderData, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { FaUserPlus, FaSearch } from "react-icons/fa";

const UserFollowers = () => {
  // const data = useLoaderData();
  const { loading, followers } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState({});

  const handleFollowUnfollow = async (followerId) => {
    if (isLoading[followerId]) return;

    try {
      setIsLoading((prev) => ({ ...prev, [followerId]: true }));
      const { data } = await customFetch.patch(`user/follow/${followerId}`);
      if (data.success) {
        toast.success(
          data.isFollowing ? "Followed successfully" : "Unfollowed successfully"
        );
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, [followerId]: false }));
    }
  };

  const filteredFollowers = followers.filter((follower) =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!Array.isArray(followers)) {
    return (
      <div className="text-center py-12 px-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Unable to load followers
        </h2>
        <p className="text-gray-500 mt-2">
          Please refresh the page to try again
        </p>
      </div>
    );
  }

  return (
    <div className="lg:p-6 bg-white rounded-xl shadow-sm">
      {/* Search Bar */}
      <div className="mb-4 lg:mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search followers by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>

      {/* Followers Count */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Followers{" "}
          <span className="text-blue-500 ml-2">{filteredFollowers.length}</span>
        </h2>
      </div>

      {/* Followers Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : filteredFollowers.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserPlus className="w-10 h-10 text-[var(--primary)]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {searchQuery ? "No matching followers found" : "No followers yet"}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try searching with a different name"
              : "Share your profile with others to gain followers!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFollowers.map((follower) => (
            <div
              key={follower._id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <Link
                  to={`/about/user/${follower._id}`}
                  className="flex-shrink-0 group"
                >
                  <img
                    src={
                      follower.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        follower.name || "User"
                      )}&background=random`
                    }
                    alt={follower.name || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors duration-300"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/about/user/${follower._id}`}
                    className="block group"
                  >
                    <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                      {follower.name || "Anonymous User"}
                    </h3>
                  </Link>
                  <div className="flex gap-4 mt-1 text-sm text-gray-500">
                    <Link
                      to={`/about/user/${follower._id}/followers`}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      <span className="font-medium">
                        {follower.totalFollowers || 0}
                      </span>
                      <span className="ml-1">followers</span>
                    </Link>
                    <Link
                      to={`/about/user/${follower._id}/following`}
                      className="hover:text-blue-600 transition-colors duration-300"
                    >
                      <span className="font-medium">
                        {follower?.totalFollowing || 0}
                      </span>
                      <span className="ml-1">following</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFollowers;
