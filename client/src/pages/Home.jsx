import React, { Fragment, lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import Chatbot from "@/components/Chatbot";
import {
  ArticlesSections,
  HeroSection,
  OurMission,
  UserPostsHome,
  VideoSection,
} from "@/components";
import Questions from "@/components/homeComponents/Questions";

// Lazy load components
const TodaysQuote = lazy(
  () => import("../components/homeComponents/TodaysQuote")
);
const TodaysQuiz = lazy(
  () => import("../components/homeComponents/TodaysQuiz")
);
const Infography = lazy(
  () => import("../components/homeComponents/Infography")
);
const DisorderTags = lazy(
  () => import("../components/homeComponents/DisorderTags")
);
const OurTeam = lazy(() => import("../components/homeComponents/OurTeam"));
const QuizWithPopup = lazy(() => import("../components/homeComponents/QuizWithPopup"));

const Home = () => {
  return (
    <Fragment>
      <Suspense fallback={<LoadingSpinner />}>
        {/* <TopIntro /> */}
        <HeroSection />
      </Suspense>

      {/* <Chatbot /> */}
      <Suspense fallback={<LoadingSpinner />}>
        <DisorderTags />
        <UserPostsHome />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Questions />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Infography />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <TodaysQuote />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <ArticlesSections />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <VideoSection />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <TodaysQuiz />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <QuizWithPopup />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <OurMission />
      </Suspense>
      {/* <Suspense fallback={<LoadingSpinner />}>
        <CampusPartners />
      </Suspense> */}
      {/* <Suspense fallback={<LoadingSpinner />}>
        <OurTeam />
      </Suspense> */}
    </Fragment>
  );
};

export default Home;
