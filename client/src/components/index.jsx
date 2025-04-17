import LoadingSpinner from "@/components/loaders/LoadingSpinner";

import { lazy, Suspense } from "react";
// Utility function to create optimized component with fallback
export const createOptimizedComponent = (importFn) => {
  const LazyComponent = lazy(importFn);

  return (props) => (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export { default as Header } from "./shared/Header";
export { default as Footer } from "./shared/Footer";

export const HeroSection = createOptimizedComponent(
  () => import("./homeComponents/HeroSection")
);

export const Like = createOptimizedComponent(() => import("./shared/Like"));
export const Follow = createOptimizedComponent(() => import("./shared/Follow"));

export const PageIntro = createOptimizedComponent(
  () => import("./shared/PageIntro")
);

// Home Components
export const TopIntro = createOptimizedComponent(
  () => import("./homeComponents/TopIntro")
);
export const Infography = createOptimizedComponent(
  () => import("./homeComponents/Infography")
);
export const DisorderTags = createOptimizedComponent(
  () => import("./homeComponents/DisorderTags")
);
export const OurTeam = createOptimizedComponent(
  () => import("./homeComponents/OurTeam")
);

export const OurStory = createOptimizedComponent(
  () => import("./homeComponents/OurStory")
);
export const TodaysQuiz = createOptimizedComponent(
  () => import("./homeComponents/TodaysQuiz")
);
export const TodaysQuote = createOptimizedComponent(
  () => import("./homeComponents/TodaysQuote")
);
export const CampusPartners = createOptimizedComponent(
  () => import("./homeComponents/CampusPartners")
);
export const OurMission = createOptimizedComponent(
  () => import("./homeComponents/OurMission")
);
export const QuizWithPopup = createOptimizedComponent(
  () => import("./homeComponents/QuizWithPopup")
);
// -----------------------------------------------//

export const UserPostsHome = createOptimizedComponent(
  () => import("./homeComponents/UserPosts")
);
export const GraphSection = createOptimizedComponent(
  () => import("./homeComponents/GraphSection")
);
export const ArticlesSections = createOptimizedComponent(
  () => import("./homeComponents/ArticlesSections")
);
export const VideoSection = createOptimizedComponent(
  () => import("./homeComponents/VideoSection")
);
// Article Components

export const Search = createOptimizedComponent(
  () => import("./articleComponents/search")
);
export const SimilarArticles = createOptimizedComponent(
  () => import("./articleComponents/SimilarArticles")
);
export const ArticleGallery = createOptimizedComponent(
  () => import("./articleComponents/ArticleGallery")
);
export const ArticleCard = createOptimizedComponent(
  () => import("./articleComponents/ArticleCard")
);
export const ArticleCommentCard = createOptimizedComponent(
  () => import("./articleComponents/ArticleCommentCard")
);
export const ArticleCommentReply = createOptimizedComponent(
  () => import("./articleComponents/ArticleCommentReply")
);
export const ArticleComments = createOptimizedComponent(
  () => import("./articleComponents/ArticleComments")
);
export const CommentPopup = createOptimizedComponent(
  () => import("./articleComponents/CommentPopup")
);
export const SearchAndFilterBar = createOptimizedComponent(
  () => import("./articleComponents/SearchAndFilterBar ")
);

// Post Components

export const PostModal = createOptimizedComponent(
  () => import("./posts/PostModel")
);

// Quiz Components

export const QuizList = createOptimizedComponent(
  () => import("./quizPageComponents/allQuizzesComponents/QuizList")
);
export const FilterQuizByCatagory = createOptimizedComponent(
  () =>
    import("./quizPageComponents/allQuizzesComponents/FilterQuizzesByCatagory")
);

// QA Section Components
export const QuestionModal = createOptimizedComponent(
  () => import("./qa/QuestionModal")
);

// User Profile Components

export const ProfileCard = createOptimizedComponent(
  () => import("./user/userProfile/ProfileCard")
);
export const ProfileDetails = createOptimizedComponent(
  () => import("./user/userProfile/ProfileDetails")
);
export const UserPosts = createOptimizedComponent(
  () => import("./user/userProfile/UserPosts")
);
export const UserAnswers = createOptimizedComponent(
  () => import("./user/userProfile/UserAnswers")
);
export const UserQuestions = createOptimizedComponent(
  () => import("./user/userProfile/UserQuestion")
);
export const UserFollowers = createOptimizedComponent(
  () => import("./user/userProfile/UserFollowers")
);
export const UserFollowing = createOptimizedComponent(
  () => import("./user/userProfile/UserFollowing")
);
export const UserAchievements = createOptimizedComponent(
  () => import("./user/userProfile/UserAchievements")
);

// Media Library
export const YoutubeEmbed = createOptimizedComponent(
  () => import("./mediaLibrary/videos/YoutubeEmbed")
);

// Chat Components
export const ChatHeader = createOptimizedComponent(
  () => import("./chatsComponents/ChatHeader")
)
export const ChatInput = createOptimizedComponent(
  () => import("./chatsComponents/ChatInput")
)
export const ChatMessages = createOptimizedComponent(
  () => import("./chatsComponents/ChatMessages")
)
export const ChatSidebar = createOptimizedComponent(
  () => import("./chatsComponents/ChatSidebar")
)
export const DefaultChat = createOptimizedComponent(
  () => import("./chatsComponents/DefaultChat")
)