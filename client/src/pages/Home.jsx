import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import Chatbot from "@/components/Chatbot";
import {
  HeroSection,
  OurMission,
  VideoSection,
} from "@/components";
import MentalHealthStats from "@/components/homeComponents/MentalHealthStats";
import EnhancedUserPosts from "@/components/homeComponents/EnhancedUserPosts";
import EnhancedQuestions from "@/components/homeComponents/EnhancedQuestions";
import EnhancedArticles from "@/components/homeComponents/EnhancedArticles";
import "@/assets/styles/HomogeneousLayout.css";
import "@/assets/styles/EnhancedMentalHealthTopics.css";

// Lazy load components
const TodaysQuote = lazy(
  () => import("../components/homeComponents/TodaysQuote")
);
const TodaysQuiz = lazy(
  () => import("../components/homeComponents/TodaysQuiz")
);
// Replaced with enhanced MentalHealthStats component
// const Infography = lazy(
//   () => import("../components/homeComponents/Infography")
// );
const EnhancedMentalHealthTopics = lazy(
  () => import("../components/homeComponents/EnhancedMentalHealthTopics")
);
// const OurTeam = lazy(() => import("../components/homeComponents/OurTeam"));
const QuizWithPopup = lazy(() => import("../components/homeComponents/QuizWithPopup"));
const SukoonAIPromo = lazy(() => import("../components/homeComponents/SukoonAIPromo"));

const Home = () => {
  return (
    <div className="homogeneous-container">
      {/* Hero Section */}
      <section className="homogeneous-section hero-section">
        <Suspense fallback={<LoadingSpinner />}>
          <HeroSection />
        </Suspense>
      </section>

      {/* Mental Health Statistics Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <div className="homogeneous-header">
            <h2 className="homogeneous-title">Mental Health Statistics</h2>
            <p className="homogeneous-subtitle">Explore the latest data on mental health conditions, their prevalence, and trends over time.</p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <MentalHealthStats />
          </Suspense>
        </div>
      </section>

      {/* SukoonAI Promo Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <div className="homogeneous-header">
            <h2 className="homogeneous-title">Self-Discovery Journey</h2>
            <p className="homogeneous-subtitle">Explore yourself with our AI-powered personal growth companion</p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <SukoonAIPromo />
          </Suspense>
        </div>
      </section>

      {/* Mental Health Topics Section */}
      <section className="homogeneous-section featured-section">
        <div className="section-content">
          <div className="homogeneous-header">
            <h2 className="homogeneous-title">Mental Health Topics</h2>
            <p className="homogeneous-subtitle">Explore common mental health disorders, their symptoms, and learn how to recognize them</p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedMentalHealthTopics />
          </Suspense>
        </div>
      </section>

      {/* Community Posts Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedUserPosts />
          </Suspense>
        </div>
      </section>

      {/* Community Questions Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedQuestions />
          </Suspense>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <div className="homogeneous-header">
            <h2 className="homogeneous-title">Daily Inspiration</h2>
            <p className="homogeneous-subtitle">Find motivation and comfort in these thoughtful quotes</p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <TodaysQuote />
          </Suspense>
        </div>
      </section>

      {/* Articles Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedArticles />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="homogeneous-section">
        <div className="section-content">
          <div className="homogeneous-header">
            <h2 className="homogeneous-title">Featured Videos</h2>
            <p className="homogeneous-subtitle">Watch informative videos about mental health and wellbeing</p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <VideoSection />
          </Suspense>
        </div>
      </section>

      {/* Mental Health Quiz Section */}
      <section className="homogeneous-section featured-section">
        <div className="section-content">
          <Suspense fallback={<LoadingSpinner />}>
            <TodaysQuiz />
          </Suspense>
        </div>
      </section>

      {/* Additional Content */}
      <section className="homogeneous-section">
        <div className="section-content">
          <div className="component-container">
            <Suspense fallback={<LoadingSpinner />}>
              <QuizWithPopup />
            </Suspense>
          </div>

          <div className="component-container">
            <Suspense fallback={<LoadingSpinner />}>
              <OurMission />
            </Suspense>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default Home;
