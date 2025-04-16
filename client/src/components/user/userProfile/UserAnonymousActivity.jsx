import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import PostCard from "@/components/posts/PostCard";
import PersonalStoryCard from "@/components/personalStories/PersonalStoryCard";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

const UserAnonymousActivity = () => {
  const user = useOutletContext();
  const { user: loggedUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [anonymousContent, setAnonymousContent] = useState({
    posts: [],
    stories: [],
    // Add other content types as needed
  });

  // Check if the current user is viewing their own profile
  const isOwnProfile = loggedUser?._id === user?._id;

  useEffect(() => {
    const fetchAnonymousContent = async () => {
      if (!isOwnProfile) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch anonymous posts
        const postsResponse = await customFetch.get("/user/anonymous-content/posts");

        // Fetch anonymous stories
        const storiesResponse = await customFetch.get("/user/anonymous-content/stories");

        // Set the anonymous content
        setAnonymousContent({
          posts: postsResponse.data.posts || [],
          stories: storiesResponse.data.stories || [],
          // Add other content types as needed
        });
      } catch (error) {
        console.error("Error fetching anonymous content:", error);
        toast.error("Failed to load anonymous content");
      } finally {
        setLoading(false);
      }
    };

    fetchAnonymousContent();
  }, [isOwnProfile, user?._id]);

  // If not viewing own profile, don't show anything
  if (!isOwnProfile) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Anonymous content is only visible to the content creator
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const hasAnonymousContent =
    anonymousContent.posts.length > 0 ||
    anonymousContent.stories.length > 0;

  if (!hasAnonymousContent) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800">
          You haven't created any anonymous content yet
        </h2>
        <p className="text-gray-500 mt-2">
          When you create content anonymously, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Anonymous Posts Section */}
      {anonymousContent.posts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Anonymous Posts
          </h2>
          <div className="space-y-4">
            {anonymousContent.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Anonymous Stories Section */}
      {anonymousContent.stories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Anonymous Stories
          </h2>
          <div className="space-y-4">
            {anonymousContent.stories.map((story) => (
              <PersonalStoryCard key={story._id} story={story} />
            ))}
          </div>
        </div>
      )}

      {/* Add other anonymous content sections as needed */}
    </div>
  );
};

export default UserAnonymousActivity;
