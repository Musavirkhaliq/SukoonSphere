import { useEffect, useState } from "react";
import { FaQuestion, FaPlus, FaTag, FaCommentDots, FaChevronRight } from "react-icons/fa";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import customFetch from "@/utils/customFetch";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./EnhancedSections.css";

const SkeletonQuestionCard = () => {
  return (
    <div className="community-card question-card skeleton-card">
      <div className="card-header">
        <div className="avatar-skeleton"></div>
        <div className="user-info-skeleton">
          <div className="name-skeleton"></div>
          <div className="date-skeleton"></div>
        </div>
        <div className="badge-skeleton"></div>
      </div>
      <div className="card-content">
        <div className="title-skeleton"></div>
        <div className="content-skeleton"></div>
        <div className="content-skeleton"></div>
        <div className="content-skeleton short"></div>
      </div>
      <div className="card-tags">
        <div className="tag-skeleton"></div>
        <div className="tag-skeleton"></div>
        <div className="tag-skeleton"></div>
      </div>
      <div className="card-footer">
        <div className="link-skeleton"></div>
      </div>
    </div>
  );
};

const CallToActionCard = () => {
  return (
    <div className="community-card cta-card">
      <div className="cta-icon question-icon">
        <FaQuestion />
      </div>
      <h3>Have a Question?</h3>
      <p>
        Ask our supportive community and get answers from people who understand.
      </p>
      <Link to="/QA-section" className="cta-button">
        Ask Question
      </Link>
    </div>
  );
};

const QuestionCard = ({ question }) => {
  const { _id, questionText, context, tags, createdAt, author, answers } = question;

  return (
    <motion.div
      className="community-card question-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <UserAvatar
          createdBy={author?.userId}
          username={author?.username}
          userAvatar={author?.userAvatar}
          createdAt={createdAt}
        />

        <div className="question-badge">
          <span>{answers?.length || 0}</span>
          <span>{answers?.length === 1 ? "Answer" : "Answers"}</span>
        </div>
      </div>

      <Link to={`/QA-section/question/${_id}`} className="card-content">
        <h3 className="question-title">{questionText}</h3>
        <p className="question-context">{context}</p>
      </Link>

      <div className="card-tags">
        {tags?.slice(0, 3).map((tag, index) => (
          <span key={index} className="question-tag">
            <FaTag className="tag-icon" />
            {tag}
          </span>
        ))}
      </div>

      <div className="card-footer">
        <Link to={`/QA-section/question/${_id}`} className="question-link">
          <span>See answers</span>
          <FaChevronRight className="link-icon" />
        </Link>
      </div>
    </motion.div>
  );
};

export default function EnhancedQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await customFetch.get("/qa-section/most-answered-question");
      setQuestions(response?.data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const splideOptions = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    pagination: true,
    arrows: false,
    gap: "2rem",
    breakpoints: {
      1024: { perPage: 2 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
    autoplay: true,
    interval: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    speed: 1000,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    lazyLoad: "nearby",
    preloadPages: 2
  };

  return (
    <section className="enhanced-section">
      <div className="section-header">
        <h2 className="section-title">Community Questions</h2>
        <p className="section-subtitle">
          Explore questions from our community and share your knowledge
        </p>
        <Link to="/QA-section" className="section-link">
          View All Questions
        </Link>
      </div>

      <div className="splide-container">
        <Splide options={splideOptions} className="enhanced-splide">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
              <SplideSlide key={`skeleton-${index}`}>
                <SkeletonQuestionCard />
              </SplideSlide>
            ))
            : questions?.map((question) => (
              <SplideSlide key={question?._id}>
                <QuestionCard question={question} />
              </SplideSlide>
            ))}

          {!loading && (
            <SplideSlide>
              <CallToActionCard />
            </SplideSlide>
          )}
        </Splide>
      </div>
    </section>
  );
}
