import React, { useState, memo } from "react";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../assets/styles/TodaysQuote.css";
import "../../assets/styles/global.css";
import SectionTitle from "../sharedComponents/SectionTitle";

const quotes = [
  {
    id: 1,
    theme: "Positivity",
    color: "#FBBF24",
    message:
      "You are not a drop in the ocean. You are the entire ocean in a drop.",
    link: "QA-section",
    action: "Ask a question",
    desktopPos: { left: "5%", top: "15%" },
  },
  {
    id: 2,
    theme: "Courage",
    color: "#3B82F6",
    message: "Healing takes time, and asking for help is a courageous step.",
    link: "articles",
    action: "Read an article",
    desktopPos: { left: "65%", top: "25%" },
  },
  {
    id: 3,
    theme: "Gratitude",
    color: "#4ADE80",
    message:
      "Every day may not be good, but there is something good in every day.",
    link: "all-quizzes",
    action: "Attempt a quiz",
    desktopPos: { left: "40%", top: "35%" },
  },
  {
    id: 4,
    theme: "Empowerment",
    color: "#F87171",
    message: "Embrace your individuality, for you hold immense power within.",
    link: "Posts",
    action: "Share a post",
    desktopPos: { left: "10%", top: "45%" },
  },
  {
    id: 5,
    theme: "Hope",
    color: "#A78BFA",
    message: "Focus on the positives, even in challenging times.",
    link: "about/mental-health",
    action: "Learn about mental health",
    desktopPos: { left: "55%", top: "55%" },
  },
  {
    id: 6,
    theme: "Resilience",
    color: "#2DD4BF",
    message:
      "Do not rush the process of healing. Seeking support is a sign of strength.",
    link: "about-us",
    action: "Read about us",
    desktopPos: { left: "30%", top: "65%" },
  },
];

const QuoteCard = memo(({ quote, isExpanded, onClick }) => {
  const isMobile = window.innerWidth < 640;

  return (
    <div
      onClick={onClick}
      className={`quote-card absolute cursor-pointer rounded-xl will-change-transform`}
      style={{
        backgroundColor: quote.color,
        width: isExpanded ? "280px" : "220px",
        height: isExpanded ? "180px" : "50px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: isExpanded ? 2 : 1,
        ...(isMobile
          ? {
            position: "relative",
            transform: `translateX(${quote.id % 2 === 0 ? "15px" : "-15px"})`,
          }
          : {
            position: "absolute",
            ...quote.desktopPos,
          }),
        boxShadow: isExpanded
          ? "0 10px 25px rgba(0, 0, 0, 0.2)"
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="h-full p-3 overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-black text-lg">{quote.theme}</h2>
          {isExpanded ? (
            <FaArrowCircleLeft className="text-white text-xl transition-transform duration-300 ease-in-out" />
          ) : (
            <FaArrowCircleRight className="text-white text-xl transition-transform duration-300 ease-in-out" />
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 mt-3" : "opacity-0 mt-0 h-0"}`}
        >
          {isExpanded && (
            <>
              <p className="text-white text-center text-base mb-4 line-clamp-3">
                {quote.message}
              </p>
              <Link
                to={quote.link}
                className="absolute bottom-3 left-3 right-3 bg-white text-black rounded-full py-2 text-sm flex items-center justify-center hover:bg-opacity-90 transition-all duration-200"
              >
                {quote.action}
                <FaLongArrowAltRight className="ml-2" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const TodaysQuote = () => {
  const [expandedId, setExpandedId] = useState(null);
  const isMobile = window.innerWidth < 640;

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <SectionTitle title="Today's Quote" />
      <section className="max-w-6xl flex flex-col items-center justify-center  gap-6 mx-auto px-4 py-4">
        <div className="bg-[var(--grey--900)] text-[--gray-700] text-sm hidden lg:inline-flex items-center py-2 px-3 rounded-full mb-4 glossy-effect-bar">
          <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">
            S
          </span>
          <Link
            to={
              "/about/mental-health"
            }
            target="_blank"
            className=" text-white hover:text-[var(--ternery)]"
          >
            SukoonSphere: For Mental Health Challenges
          </Link>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold  text-center  text-[1.6rem] md:text-[2.5rem] lg:text-[3.5rem] ">
          Open a Quote to get started!
        </h2>
        {isMobile ? (
          <div className="flex flex-col items-center gap-4 max-w-[320px] mx-auto">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                isExpanded={expandedId === quote.id}
                onClick={() => handleClick(quote.id)}
              />
            ))}
          </div>
        ) : (
          <div className="relative h-[80vh] w-full">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                isExpanded={expandedId === quote.id}
                onClick={() => handleClick(quote.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default memo(TodaysQuote);
