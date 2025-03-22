import React, { useState, memo, useEffect, useRef } from "react";
import {
  FaLongArrowAltRight,
  FaSpinner,
  FaStar,
  FaTrophy,
  FaVolumeMute,
  FaVolumeUp,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
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
    icon: "🌊",
  },
  {
    id: 2,
    theme: "Courage",
    color: "#3B82F6",
    message: "Healing takes time, and asking for help is a courageous step.",
    link: "articles",
    action: "Read an article",
    icon: "🦁",
  },
  {
    id: 3,
    theme: "Gratitude",
    color: "#4ADE80",
    message:
      "Every day may not be good, but there is something good in every day.",
    link: "all-quizzes",
    action: "Attempt a quiz",
    icon: "🙏",
  },
  {
    id: 4,
    theme: "Empowerment",
    color: "#F87171",
    message: "Embrace your individuality, for you hold immense power within.",
    link: "Posts",
    action: "Share a post",
    icon: "💪",
  },
  {
    id: 5,
    theme: "Hope",
    color: "#A78BFA",
    message: "Focus on the positives, even in challenging times.",
    link: "about/mental-health",
    action: "Learn about mental health",
    icon: "🌈",
  },
  {
    id: 6,
    theme: "Resilience",
    color: "#2DD4BF",
    message:
      "Do not rush the process of healing. Seeking support is a sign of strength.",
    link: "about-us",
    action: "Read about us",
    icon: "🌱",
  },
];

// Spinner Wheel Component
const SpinnerWheel = ({ isSpinning, onSpinEnd, minSpinTime = 3000 }) => {
  const [rotation, setRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const audioRef = useRef(null);
  const wheelRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const spinTimerRef = useRef(null);

  const spinWheel = () => {
    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Calculate random spin (3-5 full rotations + partial rotation to land on a quote)
    const minRotation = 1080; // 3 full rotations
    const maxRotation = 1800; // 5 full rotations
    const randomSpin =
      Math.floor(Math.random() * (maxRotation - minRotation)) + minRotation;

    setRotation((prevRotation) => prevRotation + randomSpin);
    setSpinCount((prevCount) => prevCount + 1);

    // Store the final rotation and selected quote index
    const finalRotation = rotation + randomSpin;
    const normalizedRotation = finalRotation % 360;
    const segmentSize = 360 / quotes.length;
    const selectedIndex = Math.floor(normalizedRotation / segmentSize);

    // Clear any existing timers
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current);
    }

    // Set timer for the minimum spin time
    spinTimerRef.current = setTimeout(() => {
      // Trigger confetti
      const confettiColors = [
        quotes[selectedIndex].color,
        "#FFFFFF",
        "#000000",
      ];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
      });

      // Call the onSpinEnd callback with the selected quote
      onSpinEnd(quotes[selectedIndex]);

      // Clear the timer reference
      spinTimerRef.current = null;
    }, minSpinTime);
  };

  useEffect(() => {
    if (isSpinning) {
      spinWheel();
    }

    // Cleanup function to clear the timer if component unmounts
    return () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
      }
    };
  }, [isSpinning]);

  const toggleSound = (e) => {
    e.stopPropagation();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute -top-10 right-0 z-10 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>

      {/* Audio element for spinning sound */}
      <audio ref={audioRef} src="/sounds/wheel-spin.mp3" preload="auto"></audio>

      {/* Wheel background and highlight effect */}
      <div className="absolute inset-0 rounded-full bg-gray-800 shadow-[0_0_20px_5px_rgba(255,255,255,0.1)] z-0"></div>

      {/* Actual wheel */}
      <div
        ref={wheelRef}
        className="absolute inset-0 rounded-full overflow-hidden transition-all duration-[3000ms] ease-out shadow-lg z-10"
        style={{
          transform: `rotate(${rotation}deg)`,
          background:
            "conic-gradient(#FBBF24 0deg 60deg, #3B82F6 60deg 120deg, #4ADE80 120deg 180deg, #F87171 180deg 240deg, #A78BFA 240deg 300deg, #2DD4BF 300deg 360deg)",
        }}
      >
        {quotes.map((quote, index) => {
          const angle = (360 / quotes.length) * index;
          return (
            <div
              key={quote.id}
              className="absolute w-full h-full origin-center text-white font-bold text-lg flex items-center justify-center"
              style={{
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div className="absolute h-full w-1 bg-white opacity-50 top-0 left-1/2 transform -translate-x-1/2"></div>
              <div
                className="absolute top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                style={{ transform: `rotate(${90}deg)` }}
              >
                <span className="text-2xl mb-1">{quote.icon}</span>
                <span className="font-bold text-sm tracking-wider">
                  {quote.theme}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gray-900 border-4 border-white transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center shadow-lg">
        <div className="text-white text-xs font-bold">SPIN</div>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 w-6 h-12 transform -translate-x-1/2 z-30 pointer-events-none">
        <div className="w-6 h-6 bg-red-600 rotate-45 transform translate-y-3 rounded-sm shadow-md"></div>
      </div>

      {/* Spin counter badge */}
      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-30 shadow-lg border-2 border-white">
        {spinCount}
      </div>
    </div>
  );
};

// Quote Modal for Mobile
const QuoteModal = ({ quote, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in with a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Add body class to prevent scrolling
    document.body.classList.add("overflow-hidden");

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow exit animation to complete
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative p-6 rounded-xl shadow-xl"
          style={{
            backgroundColor: quote.color,
            boxShadow: `0 10px 25px -5px ${quote.color}80, 0 8px 10px -6px ${quote.color}40`,
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
          >
            <FaTimes />
          </button>

          <div className="flex justify-center mb-4">
            <span className="text-5xl">{quote.icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
            {quote.theme}
          </h3>
          <p className="text-white text-lg mb-6 italic">"{quote.message}"</p>
          <Link
            to={quote.link}
            className="inline-flex items-center bg-white text-gray-800 rounded-full py-3 px-6 text-sm font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 w-full justify-center"
          >
            {quote.action}
            <FaLongArrowAltRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Quote Result Component with animation (for desktop)
const QuoteResult = ({ quote }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in the result after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`mt-8 p-6 rounded-xl shadow-lg text-center transform transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{
        backgroundColor: quote.color,
        boxShadow: `0 10px 25px -5px ${quote.color}80, 0 8px 10px -6px ${quote.color}40`,
      }}
    >
      <div className="flex justify-center mb-3">
        <span className="text-5xl">{quote.icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
        {quote.theme}
      </h3>
      <p className="text-white text-lg mb-6 italic">"{quote.message}"</p>
      <Link
        to={quote.link}
        className="inline-flex items-center bg-white text-gray-800 rounded-full py-3 px-6 text-sm font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      >
        {quote.action}
        <FaLongArrowAltRight className="ml-2" />
      </Link>
    </div>
  );
};

// Reward and Achievement System
const AchievementTracker = ({ spinCount }) => {
  const achievements = [
    {
      requirement: 1,
      label: "First Spin",
      icon: <FaStar className="text-yellow-400" />,
    },
    {
      requirement: 5,
      label: "Curious Mind",
      icon: <FaStar className="text-yellow-400" />,
    },
    {
      requirement: 10,
      label: "Wisdom Seeker",
      icon: <FaTrophy className="text-yellow-400" />,
    },
  ];

  return (
    <div className="mt-8 flex gap-4 justify-center flex-wrap">
      {achievements.map((achievement, index) => {
        const isUnlocked = spinCount >= achievement.requirement;

        return (
          <div
            key={index}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              isUnlocked
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
            title={
              isUnlocked
                ? "Achieved!"
                : `Spin ${achievement.requirement} times to unlock`
            }
          >
            <div className={`${isUnlocked ? "opacity-100" : "opacity-50"}`}>
              {achievement.icon}
            </div>
            <span className="text-xs font-medium">{achievement.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const TodaysQuote = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [spinCount, setSpinCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(() => {
    const saved = localStorage.getItem("quoteStreak");
    return saved ? parseInt(saved) : 0;
  });

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Check if user has spun today
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const today = new Date().toDateString();

    if (lastSpinDate !== today && spinCount > 0) {
      localStorage.setItem("lastSpinDate", today);

      // Increment streak if consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastSpinDate === yesterdayString) {
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        localStorage.setItem("quoteStreak", newStreak);
      }
    }
  }, [spinCount]);

  const handleSpin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setSelectedQuote(null);
      setShowModal(false);
      setSpinCount((prev) => prev + 1);
    }
  };

  const handleSpinEnd = (quote) => {
    setSelectedQuote(quote);

    // On mobile, show the quote in a modal
    if (isMobile) {
      setShowModal(true);
    }

    // Only stop spinning animation after quote is ready to display
    setIsSpinning(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section className="max-w-7xl flex flex-col items-center justify-center gap-6 mx-auto relative">
      <div className="relative z-10 w-full">
        <SectionTitle title="Daily Inspiration Wheel" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl ">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Spin for Wisdom!
              </h2>

              {dailyStreak > 0 && (
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-amber-200">
                  <FaLongArrowAltRight className="text-amber-500" />
                  <span>{dailyStreak} Day Streak!</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
              Get your daily dose of inspiration and motivation.
            </p>

            <SpinnerWheel
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
              minSpinTime={1000}
            />

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`mt-8 px-8 py-4 rounded-full text-white font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 ${
                isSpinning
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30"
              }`}
            >
              {isSpinning ? (
                <>
                  <FaSpinner className="animate-spin inline-block mr-2" />
                  <span>Wait a moment...</span>
                </>
              ) : (
                "Spin the Wheel"
              )}
            </button>

            <AchievementTracker spinCount={spinCount} />
          </div>

          {/* Only show this on desktop view */}
          <div className="w-full md:w-1/2 hidden md:block">
            {selectedQuote ? (
              <QuoteResult quote={selectedQuote} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg italic">
                Spin the wheel to reveal your quote for today...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile quote modal */}
      {isMobile && showModal && selectedQuote && (
        <QuoteModal quote={selectedQuote} onClose={closeModal} />
      )}
    </section>
  );
};

export default memo(TodaysQuote);
