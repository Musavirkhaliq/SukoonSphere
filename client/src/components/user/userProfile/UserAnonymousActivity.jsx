import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { FaLock, FaUser } from "react-icons/fa";
import { MdQuestionAnswer, MdBookmark } from "react-icons/md";
import { BsPencilSquare, BsChatLeftText } from "react-icons/bs";
import PostCard from "@/components/posts/PostCard";
import PersonalStoryCard from "@/components/personalStories/PersonalStoryCard";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import QuestionCard from "@/pages/stories&discussions/qaSection/components/QuestionCard";
import Answer from "@/pages/stories&discussions/qaSection/components/Answer";

// Skeleton loader component using only Tailwind
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-4 w-full">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
    <div className="mt-4 flex items-center">
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="ml-2 w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

// Empty state component using only React and Tailwind
const EmptyState = ({ type, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 transition-opacity duration-300 ease-in-out">
    <div className="bg-blue-100 p-3 rounded-full mb-4">
      <Icon className="w-8 h-8 text-[var(--primary)]" />
    </div>
    <h3 className="text-lg font-medium text-gray-800">No Anonymous {type} Yet</h3>
    <p className="text-gray-500 text-center mt-2 max-w-sm">
      When you create {type.toLowerCase()} anonymously, they will appear here for your reference.
    </p>
  </div>
);

const UserAnonymousActivity = () => {
  const user = useOutletContext();
  const { user: loggedUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [anonymousContent, setAnonymousContent] = useState({
    posts: [],
    stories: [],
    questions: [],
    answers: []
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

        // Fetch data for all content types in parallel
        const postsPromise = customFetch.get("/user/anonymous-content/posts");
        const storiesPromise = customFetch.get("/user/anonymous-content/stories");
        const questionsPromise = customFetch.get("/user/anonymous-content/question");
        const answersPromise = customFetch.get("/user/anonymous-content/answer");

        const [postsResponse, storiesResponse, questionsResponse, answersResponse] = await Promise.all([
          postsPromise,
          storiesPromise,
          questionsPromise,
          answersPromise
        ]);

        setAnonymousContent({
          posts: postsResponse.data.posts || [],
          stories: storiesResponse.data.stories || [],
          questions: questionsResponse.data.questions || [],
          answers: answersResponse.data.answers || []
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

  // If not viewing own profile, show privacy message
  if (!isOwnProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 opacity-0 animate-fade-in">
        <div className="bg-gray-100 p-4 rounded-full mb-6">
          <FaLock className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Anonymous Content is Private
        </h2>
        <p className="text-gray-600 mt-3 max-w-md text-center">
          Anonymous content is only visible to the person who created it to protect user privacy.
        </p>
      </div>
    );
  }

  // Function to get total content count
  const getTotalCount = () => {
    return (
      anonymousContent.posts.length +
      anonymousContent.stories.length +
      anonymousContent.questions.length +
      anonymousContent.answers.length
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Empty state for all content
  if (getTotalCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-blue-100 p-4 rounded-full mb-6">
          <FaUser className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          No Anonymous Activity Yet
        </h2>
        <p className="text-gray-600 mt-3 max-w-md text-center">
          When you create content anonymously, it will appear here. Anonymous posts and stories help you share without revealing your identity.
        </p>
      </div>
    );
  }

  // Custom tab button component
  const TabButton = ({ id, active, icon: Icon, label, count, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center justify-center md:justify-start px-2 py-2 rounded-[8px] transition-colors duration-200 ease-in-out text-sm md:text-base w-full
        ${active ? "bg-blue-100 text-[var(--primary)] font-medium" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      <span className="htext-sm md:text-base">{label}</span>
      <span className="ml-1 bg-gray-200 text-gray-700 rounded-full text-xs px-2 py-0.5">
        {count}
      </span>
    </button>
  );

  return (
    <div className="rounded-lg overflow-hidden relative">
      {/* Header Section */}
      <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaLock className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="text-2xl font-bold text-gray-800">Anonymous Activity</h1>
        </div>
        <p className="text-gray-600">
          This is your private dashboard showing all content you've shared anonymously. Only you can see this.
        </p>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex flex-col md:flex-row gap-6 ">
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm p-3">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            <TabButton 
              id="all" 
              active={activeTab === "all"} 
              icon={FaUser} 
              label="All" 
              count={getTotalCount()}
              onClick={setActiveTab} 
            />
            <TabButton 
              id="posts" 
              active={activeTab === "posts"} 
              icon={BsPencilSquare} 
              label="Posts" 
              count={anonymousContent.posts.length}
              onClick={setActiveTab} 
            />
            <TabButton 
              id="stories" 
              active={activeTab === "stories"} 
              icon={MdBookmark} 
              label="Stories" 
              count={anonymousContent.stories.length}
              onClick={setActiveTab} 
            />
            <TabButton 
              id="questions" 
              active={activeTab === "questions"} 
              icon={MdQuestionAnswer} 
              label="Questions" 
              count={anonymousContent.questions.length}
              onClick={setActiveTab} 
            />
            <TabButton 
              id="answers" 
              active={activeTab === "answers"} 
              icon={BsChatLeftText} 
              label="Answers" 
              count={anonymousContent.answers.length}
              onClick={setActiveTab} 
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* All Content Tab */}
          {activeTab === "all" && (
            <div className="space-y-8">
              {/* Only show sections that have content */}
              {anonymousContent.posts.length > 0 && (
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BsPencilSquare className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Anonymous Posts ({anonymousContent.posts.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {anonymousContent.posts.map((post,index) => (
                      <PostCard
                      key={`${post._id}-${index}`}
                      post={post}
                      user={loggedUser}
                  />
                    ))}
                  </div>
                </div>
              )}

              {anonymousContent.stories.length > 0 && (
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MdBookmark className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Anonymous Stories ({anonymousContent.stories.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {anonymousContent.stories.map((story) => (
                      <PersonalStoryCard key={story._id} story={story} />
                    ))}
                  </div>
                </div>
              )}

              {anonymousContent.questions.length > 0 && (
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MdQuestionAnswer className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Anonymous Questions ({anonymousContent.questions.length})
                  </h2>
                  <div className="space-y-4">
                    {anonymousContent.questions.map((question) => (
                      <QuestionCard key={question._id} question={question} />
                    ))}
                  </div>
                </div>
              )}

              {anonymousContent.answers.length > 0 && (
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BsChatLeftText className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Anonymous Answers ({anonymousContent.answers.length})
                  </h2>
                  <div className="space-y-4">
                    {anonymousContent.answers.map((answer) => (
                      <Answer key={answer._id} answer={answer} preview={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <>
              {anonymousContent.posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anonymousContent.posts.map((post,index) => (
                    <PostCard
                    key={`${post._id}-${index}`}
                    post={post}
                    user={loggedUser} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Posts" icon={BsPencilSquare} />
              )}
            </>
          )}

          {/* Stories Tab */}
          {activeTab === "stories" && (
            <>
              {anonymousContent.stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anonymousContent.stories.map((story) => (
                    <PersonalStoryCard key={story._id} story={story} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Stories" icon={MdBookmark} />
              )}
            </>
          )}

          {/* Questions Tab */}
          {activeTab === "questions" && (
            <>
              {anonymousContent.questions.length > 0 ? (
                <div className="space-y-4">
                  {anonymousContent.questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Questions" icon={MdQuestionAnswer} />
              )}
            </>
          )}

          {/* Answers Tab */}
          {activeTab === "answers" && (
            <>
              {anonymousContent.answers.length > 0 ? (
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anonymousContent.answers.map((answer) => (
                    <Answer key={answer._id} answer={answer} preview={true}  user={loggedUser} />
                  ))}
                </div>
              ) : (
                <EmptyState type="Answers" icon={BsChatLeftText} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnonymousActivity;