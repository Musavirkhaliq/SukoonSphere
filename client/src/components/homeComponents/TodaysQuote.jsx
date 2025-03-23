// import React, { useState, memo, useEffect, useRef } from "react";
// import {
//   FaLongArrowAltRight,
//   FaSpinner,
//   FaStar,
//   FaTrophy,
//   FaVolumeMute,
//   FaVolumeUp,
//   FaTimes,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import confetti from "canvas-confetti";
// import "../../assets/styles/TodaysQuote.css";
// import "../../assets/styles/global.css";
// import SectionTitle from "../sharedComponents/SectionTitle";

// const quotes = [
//   {
//     id: 1,
//     theme: "Positivity",
//     color: "#FBBF24",
//     message:
//       "You are not a drop in the ocean. You are the entire ocean in a drop.",
//     link: "QA-section",
//     action: "Ask a question",
//     icon: "🌊",
//   },
//   {
//     id: 2,
//     theme: "Courage",
//     color: "#3B82F6",
//     message: "Healing takes time, and asking for help is a courageous step.",
//     link: "articles",
//     action: "Read an article",
//     icon: "🦁",
//   },
//   {
//     id: 3,
//     theme: "Gratitude",
//     color: "#4ADE80",
//     message:
//       "Every day may not be good, but there is something good in every day.",
//     link: "all-quizzes",
//     action: "Attempt a quiz",
//     icon: "🙏",
//   },
//   {
//     id: 4,
//     theme: "Empowerment",
//     color: "#F87171",
//     message: "Embrace your individuality, for you hold immense power within.",
//     link: "Posts",
//     action: "Share a post",
//     icon: "💪",
//   },
//   {
//     id: 5,
//     theme: "Hope",
//     color: "#A78BFA",
//     message: "Focus on the positives, even in challenging times.",
//     link: "about/mental-health",
//     action: "Learn about mental health",
//     icon: "🌈",
//   },
//   {
//     id: 6,
//     theme: "Resilience",
//     color: "#2DD4BF",
//     message:
//       "Do not rush the process of healing. Seeking support is a sign of strength.",
//     link: "about-us",
//     action: "Read about us",
//     icon: "🌱",
//   },
// ];

// // Spinner Wheel Component
// const SpinnerWheel = ({ isSpinning, onSpinEnd, minSpinTime = 7000 }) => {
//   const [rotation, setRotation] = useState(0);
//   const [spinCount, setSpinCount] = useState(0);
//   const audioRef = useRef(null);
//   const wheelRef = useRef(null);
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const spinTimerRef = useRef(null);

//   const spinWheel = () => {
//     // Play sound if enabled
//     if (soundEnabled && audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }

//     // Calculate random spin (3-5 full rotations + partial rotation to land on a quote)
//     const minRotation = 1440; // 4 full rotations
//     const maxRotation = 2160; // 6 full rotations
//     const randomSpin =
//       Math.floor(Math.random() * (maxRotation - minRotation)) + minRotation;

//     setRotation((prevRotation) => prevRotation + randomSpin);
//     setSpinCount((prevCount) => prevCount + 1);

//     // Store the final rotation and selected quote index
//     const finalRotation = rotation + randomSpin;
//     const normalizedRotation = finalRotation % 360;
//     const segmentSize = 360 / quotes.length;
//     const selectedIndex = Math.floor(normalizedRotation / segmentSize);

//     // Clear any existing timers
//     if (spinTimerRef.current) {
//       clearTimeout(spinTimerRef.current);
//     }

//     // Set timer for the minimum spin time
//     spinTimerRef.current = setTimeout(() => {
//       // Trigger confetti
//       const confettiColors = [
//         quotes[selectedIndex].color,
//         "#FFFFFF",
//         "#000000",
//       ];

//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//         colors: confettiColors,
//       });

//       // Call the onSpinEnd callback with the selected quote
//       onSpinEnd(quotes[selectedIndex]);

//       // Clear the timer reference
//       spinTimerRef.current = null;
//     }, minSpinTime);
//   };

//   useEffect(() => {
//     if (isSpinning) {
//       spinWheel();
//     }

//     // Cleanup function to clear the timer if component unmounts
//     return () => {
//       if (spinTimerRef.current) {
//         clearTimeout(spinTimerRef.current);
//       }
//     };
//   }, [isSpinning]);

//   const toggleSound = (e) => {
//     e.stopPropagation();
//     setSoundEnabled(!soundEnabled);
//   };

//   return (
//     <div className="relative w-80 h-80 mx-auto">
//       {/* Wheel background and highlight effect */}
//       <div className="absolute inset-0 rounded-full bg-gray-800 shadow-[0_0_20px_5px_rgba(255,255,255,0.1)] z-0"></div>

//       {/* Actual wheel */}
//       <div
//         ref={wheelRef}
//         className="absolute inset-0 rounded-full overflow-hidden transition-all duration-[3000ms] ease-out shadow-lg z-10"
//         style={{
//           transform: `rotate(${rotation}deg)`,
//           background:
//             "conic-gradient(#FBBF24 0deg 60deg, #3B82F6 60deg 120deg, #4ADE80 120deg 180deg, #F87171 180deg 240deg, #A78BFA 240deg 300deg, #2DD4BF 300deg 360deg)",
//         }}
//       >
//         {quotes.map((quote, index) => {
//           const angle = (360 / quotes.length) * index;
//           return (
//             <div
//               key={quote.id}
//               className="absolute w-full h-full origin-center text-white font-bold text-lg flex items-center justify-center"
//               style={{
//                 transform: `rotate(${angle}deg)`,
//               }}
//             >
//               <div className="absolute h-full w-1 bg-white opacity-50 top-0 left-1/2 transform -translate-x-1/2"></div>
//               <div
//                 className="absolute top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
//                 style={{ transform: `rotate(${90}deg)` }}
//               >
//                 <span className="text-2xl mb-1">{quote.icon}</span>
//                 <span className="font-bold text-sm tracking-wider">
//                   {quote.theme}
//                 </span>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Center hub */}
//       <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gray-900 border-4 border-white transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center shadow-lg">
//         <div className="text-white text-xs font-bold">SPIN</div>
//       </div>

//       {/* Pointer */}
//       <div className="absolute top-0 left-1/2 w-6 h-12 transform -translate-x-1/2 z-30 pointer-events-none">
//         <div className="w-6 h-6 bg-red-600 rotate-45 transform translate-y-3 rounded-sm shadow-md"></div>
//       </div>

//       {/* Spin counter badge */}
//       <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-30 shadow-lg border-2 border-white">
//         {spinCount}
//       </div>
//     </div>
//   );
// };

// // Quote Modal for Mobilea
// const QuoteModal = ({ quote, onClose }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Animate in with a small delay
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);

//     // Add body class to prevent scrolling
//     document.body.classList.add("overflow-hidden");

//     return () => {
//       clearTimeout(timer);
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, []);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(onClose, 300);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
//       onClick={handleClose}
//     >
//       <div
//         className={`relative w-full max-w-md transform transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
//           }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div
//           className="relative p-6 rounded-xl shadow-xl"
//           style={{
//             backgroundColor: quote.color,
//             boxShadow: `0 10px 25px -5px ${quote.color}80, 0 8px 10px -6px ${quote.color}40`,
//           }}
//         >
//           <button
//             onClick={handleClose}
//             className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
//           >
//             <FaTimes />
//           </button>

//           <div className="flex justify-center mb-4">
//             <span className="text-5xl">{quote.icon}</span>
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
//             {quote.theme}
//           </h3>
//           <p className="text-white text-lg mb-6 italic">"{quote.message}"</p>
//           <Link
//             to={quote.link}
//             className="inline-flex items-center bg-white text-gray-800 rounded-full py-3 px-6 text-sm font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 w-full justify-center"
//           >
//             {quote.action}
//             <FaLongArrowAltRight className="ml-2" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Quote Result Component with animation (for desktop)
// const QuoteResult = ({ quote }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Animate in the result after a short delay
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div
//       className={`mt-8 p-6 rounded-xl shadow-lg text-center transform transition-all duration-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
//         }`}
//       style={{
//         backgroundColor: quote.color,
//         boxShadow: `0 10px 25px -5px ${quote.color}80, 0 8px 10px -6px ${quote.color}40`,
//       }}
//     >
//       <div className="flex justify-center mb-3">
//         <span className="text-5xl">{quote.icon}</span>
//       </div>
//       <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
//         {quote.theme}
//       </h3>
//       <p className="text-white text-lg mb-6 italic">"{quote.message}"</p>
//       <Link
//         to={quote.link}
//         className="inline-flex items-center bg-white text-gray-800 rounded-full py-3 px-6 text-sm font-bold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
//       >
//         {quote.action}
//         <FaLongArrowAltRight className="ml-2" />
//       </Link>
//     </div>
//   );
// };

// // Reward and Achievement System
// const AchievementTracker = ({ spinCount }) => {
//   const achievements = [
//     {
//       requirement: 1,
//       label: "First Spin",
//       icon: <FaStar className="text-yellow-400" />,
//     },
//     {
//       requirement: 5,
//       label: "Curious Mind",
//       icon: <FaStar className="text-yellow-400" />,
//     },
//     {
//       requirement: 10,
//       label: "Wisdom Seeker",
//       icon: <FaTrophy className="text-yellow-400" />,
//     },
//   ];

//   return (
//     <div className="mt-8 flex gap-4 justify-center flex-wrap">
//       {achievements.map((achievement, index) => {
//         const isUnlocked = spinCount >= achievement.requirement;

//         return (
//           <div
//             key={index}
//             className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${isUnlocked
//               ? "bg-gray-800 text-white"
//               : "bg-gray-200 text-gray-400"
//               }`}
//             title={
//               isUnlocked
//                 ? "Achieved!"
//                 : `Spin ${achievement.requirement} times to unlock`
//             }
//           >
//             <div className={`${isUnlocked ? "opacity-100" : "opacity-50"}`}>
//               {achievement.icon}
//             </div>
//             <span className="text-xs font-medium">{achievement.label}</span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const TodaysQuote = () => {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [selectedQuote, setSelectedQuote] = useState(null);
//   const [spinCount, setSpinCount] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [dailyStreak, setDailyStreak] = useState(() => {
//     const saved = localStorage.getItem("quoteStreak");
//     return saved ? parseInt(saved) : 0;
//   });

//   // Check for mobile view
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     // Initial check
//     checkMobile();

//     // Add resize listener
//     window.addEventListener("resize", checkMobile);

//     // Cleanup
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     // Check if user has spun today
//     const lastSpinDate = localStorage.getItem("lastSpinDate");
//     const today = new Date().toDateString();

//     if (lastSpinDate !== today && spinCount > 0) {
//       localStorage.setItem("lastSpinDate", today);

//       // Increment streak if consecutive day
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);
//       const yesterdayString = yesterday.toDateString();

//       if (lastSpinDate === yesterdayString) {
//         const newStreak = dailyStreak + 1;
//         setDailyStreak(newStreak);
//         localStorage.setItem("quoteStreak", newStreak);
//       }
//     }
//   }, [spinCount]);

//   const handleSpin = () => {
//     if (!isSpinning) {
//       setIsSpinning(true);
//       setSelectedQuote(null);
//       setShowModal(false);
//       setSpinCount((prev) => prev + 1);
//     }
//   };

//   const handleSpinEnd = (quote) => {
//     setSelectedQuote(quote);

//     // On mobile, show the quote in a modal
//     if (isMobile) {
//       setShowModal(true);
//     }

//     // Only stop spinning animation after quote is ready to display
//     setIsSpinning(false);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <section className="max-w-7xl flex flex-col items-center justify-center gap-6 mx-auto relative">
//       <div className="relative z-10 w-full">
//         <SectionTitle title="Daily Inspiration Wheel" />

//         <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl ">
//           <div className="w-full md:w-1/2 flex flex-col items-center">
//             <div className="flex items-center gap-4 mb-4 flex-wrap justify-center">
//               <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-clip-text text-transparent bg-[var(--primary)]">
//                 Spin for wheel to start!
//               </h2>

//               {dailyStreak > 0 && (
//                 <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-amber-200">
//                   <FaLongArrowAltRight className="text-amber-500" />
//                   <span>{dailyStreak} Day Streak!</span>
//                 </div>
//               )}
//             </div>

//             <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
//               Get your daily dose of inspiration and motivation.
//             </p>

//             <SpinnerWheel
//               isSpinning={isSpinning}
//               onSpinEnd={handleSpinEnd}
//               minSpinTime={1000}
//             />

//             <button
//               onClick={handleSpin}
//               disabled={isSpinning}
//               className={`mt-8 px-8 py-4 rounded-full text-white font-bold text-lg tracking-wide transition-all duration-300 transform hover:scale-105 ${isSpinning
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "btn-1 hover:shadow-lg hover:shadow-blue-500/30"
//                 }`}
//             >
//               {isSpinning ? (
//                 <>
//                   <FaSpinner className="animate-spin inline-block mr-2" />
//                   <span>Wait a moment...</span>
//                 </>
//               ) : (
//                 "Spin the Wheel"
//               )}
//             </button>

//             <AchievementTracker spinCount={spinCount} />
//           </div>

//           {/* Only show this on desktop view */}
//           <div className="w-full md:w-1/2 hidden md:block">
//             {selectedQuote ? (
//               <QuoteResult quote={selectedQuote} />
//             ) : (
//               <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg italic">
//                 Spin the wheel to reveal your quote for today...
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile quote modal */}
//       {isMobile && showModal && selectedQuote && (
//         <QuoteModal quote={selectedQuote} onClose={closeModal} />
//       )}
//     </section>
//   );
// };

// export default memo(TodaysQuote);

import { useState, useRef } from "react"
import { FaHeart, FaSun, FaFistRaised, FaTree, FaHandHoldingHeart, FaFeather } from "react-icons/fa"
import SectionTitle from "../sharedComponents/SectionTitle";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

// Define the attributes with their properties
const attributes = [
  {
    name: "Hope",
    link: "QA-section",
    actionName: "QA-section",
    color: "bg-rose-400",
    hoverColor: "hover:bg-rose-500",
    textColor: "text-rose-500",
    borderColor: "border-rose-300",
    icon: <FaHeart className="text-white text-2xl md:text-3xl" />,
    quote: "Hope is being able to see that there is light despite all of the darkness.",
  },
  {
    name: "Positivity",
    link: "about-us",
    actionName: "About Us",
    color: "bg-amber-400",
    hoverColor: "hover:bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-300",
    icon: <FaSun className="text-white text-2xl md:text-3xl" />,
    quote: "Positive thinking will let you do everything better than negative thinking will.",
  },
  {
    name: "Courage",
    link: "about/mental-health",
    actionName: "Mental Health",
    color: "bg-orange-400",
    hoverColor: "hover:bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-300",
    icon: <FaFistRaised className="text-white text-2xl md:text-3xl" />,
    quote: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
  },
  {
    name: "Resilience",
    link: "Posts",
    actionName: "Posts",
    color: "bg-emerald-400",
    hoverColor: "hover:bg-emerald-500",
    textColor: "text-emerald-500",
    borderColor: "border-emerald-300",
    icon: <FaTree className="text-white text-2xl md:text-3xl" />,
    quote: "The human capacity for burden is like bamboo – far more flexible than you'd ever believe at first glance.",
  },
  {
    name: "Gratitude",
    link: "all-quizzes",
    actionName: "Quizzes",
    color: "bg-violet-400",
    hoverColor: "hover:bg-violet-500",
    textColor: "text-violet-500",
    borderColor: "border-violet-300",
    icon: <FaHandHoldingHeart className="text-white text-2xl md:text-3xl" />,
    quote: "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity.",
  },
  {
    name: "Empowerment",
    link: "articles",
    actionName: "articles",
    color: "bg-pink-400",
    hoverColor: "hover:bg-pink-500",
    textColor: "text-pink-500",
    borderColor: "border-pink-300",
    icon: <FaFeather className="text-white text-2xl md:text-3xl" />,
    quote: "When you undervalue what you do, the world will undervalue who you are.",

  },
]

function TodaysQuote() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const wheelRef = useRef(null)
  const [spinDuration, setSpinDuration] = useState(0)

  const spinWheel = () => {
    if (isSpinning) return

    setShowPopup(false)
    setIsSpinning(true)

    // Calculate a random number of full rotations (5-10) plus a random segment
    const spinDegrees = 360 * (Math.floor(Math.random() * 5) + 5) // 5-10 full rotations
    const randomSegment = Math.floor(Math.random() * 6) * (360 / 6) // Random segment (0-5)
    const newRotation = rotation + spinDegrees + randomSegment

    // Random duration between 4-6 seconds for more natural feel
    const duration = 4 + Math.random() * 2
    setSpinDuration(duration)
    setRotation(newRotation)

    // Calculate which segment will be at the top when wheel stops
    setTimeout(() => {
      const normalizedRotation = newRotation % 360
      const segmentIndex = Math.floor((360 - (normalizedRotation % 360)) / (360 / 6)) % 6
      setSelectedAttribute(attributes[segmentIndex])
      setIsSpinning(false)
      setShowPopup(true)
      const confettiColors = [
        attributes[segmentIndex].color,
        "#FFFFFF",
        "#000000",
      ];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
      });
    }, duration * 1000) // Match this with the CSS transition duration
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className=" max-w-7xl mx-auto ">
      <SectionTitle title="Request a quote" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center font-sans">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[var(--primary)] tracking-tight">
          Spin the wheel to get started
        </h1>

        <div className="relative w-full max-w-md aspect-square mb-12">
          {/* Center circle with improved depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-white rounded-full z-20 shadow-lg border-4 border-gray-200 flex items-center justify-center">
            <div className="w-[70%] h-[70%] rounded-full bg-gray-100 shadow-inner"></div>
          </div>

          {/* Improved pointer/indicator with better shadow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[40%] w-12 h-16 z-30">
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-gray-800 rounded-t-full shadow-md"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white shadow-xl rounded-full border-4 border-gray-800 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-red-500 shadow-inner animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Wheel container with enhanced shadow and border */}
          <div className="absolute inset-0 rounded-full shadow-[0_5px_30px_rgba(0,0,0,0.25)] overflow-hidden border-[12px] border-gray-800">
            {/* Wheel with smooth transition */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full overflow-hidden relative bg-white"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.32, 0.94, 0.6, 1)` : "none",
              }}
            >


              {/* Improved dividing lines with gradient */}
              {attributes.map((attr, index) => {
                const angle = index * 60;

                return (
                  <div
                    key={attr.name}
                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    {/* Segment with texture and shading */}
                    <div
                      className={`absolute inset-0 ${attr.color}`}
                      style={{
                        borderRight: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.15)",
                        background: `linear-gradient(135deg, ${getComputedStyle(document.documentElement).getPropertyValue('--' + attr.color.slice(3))} 0%, ${getComputedStyle(document.documentElement).getPropertyValue('--' + attr.color.slice(3) + '/80')} 100%)`,
                      }}
                    ></div>
                  </div>
                );
              })}

              {/* Add text and icons as separate elements positioned absolutely */}
              {attributes.map((attr, index) => {
                const angle = index * 60 + 30; // Position in the middle of each segment
                const radius = 35; // Adjust based on your wheel size (% of wheel radius)

                // Calculate position using trigonometry
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <div
                    key={`label-${attr.name}`}
                    className="absolute flex flex-col items-center justify-center"
                    style={{
                      top: `${y}%`,
                      left: `${x}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '20%',
                      textAlign: 'center'
                    }}
                  >
                    <div className="bg-white/20 p-2 rounded-full mb-1 backdrop-blur-sm shadow-lg flex items-center justify-center">
                      {attr.icon}
                    </div>
                    <div className="text-[var(--white-color)] font-bold text-base md:text-lg drop-shadow-lg tracking-wide whitespace-nowrap">
                      {attr.name}
                    </div>
                  </div>
                );
              })}

              {/* Divider lines between segments */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`divider-${index}`}
                  className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-white/10 to-white/40"
                  style={{
                    transform: `translateY(-50%) rotate(${index * 60}deg)`,
                    transformOrigin: "left center",
                  }}
                ></div>
              ))}
              {/* Center circle cutout */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-gray-800 rounded-full"></div>
            </div>
          </div>

          {/* Improved decorative elements with gradients */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-b-lg shadow-md"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 rounded-b-lg shadow-md"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Pure Tailwind button replacing Material UI Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`
           btn-1
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
          `}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Spinning...
              </span>
            ) : (
              "Spin the Wheel"
            )}
          </button>


        </div>

        {/* Improved modal popup with animations */}
        {showPopup && selectedAttribute && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closePopup}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ease-out"
              style={{ animation: 'popup 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${selectedAttribute.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}
                style={{
                  boxShadow: `0 10px 25px -5px ${getComputedStyle(document.documentElement).getPropertyValue('--' + selectedAttribute.color.slice(3) + '/40')}`
                }}
              >
                <div className="text-4xl">{selectedAttribute.icon}</div>
              </div>

              <h2 className={`text-3xl font-bold text-center mb-4 ${selectedAttribute.textColor}`}>
                {selectedAttribute.name}
              </h2>

              <p className="text-gray-700 text-center text-lg italic mb-8 leading-relaxed">
                "{selectedAttribute.quote}"
              </p>

              <div className="flex justify-between">
                <button
                  onClick={closePopup}
                  className={`
                  px-6 py-2 text-lg border-2 ${selectedAttribute.borderColor} ${selectedAttribute.textColor}
                  rounded-lg hover:bg-gray-50 transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-gray-200
                `}
                >
                  Close
                </button>
                <Link
                  to={selectedAttribute.link}
                  className={`
                  ${selectedAttribute.color} ${selectedAttribute.hoverColor} text-white
                  px-6 py-2 text-lg rounded-lg shadow-md hover:shadow-lg
                  transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0
                  focus:outline-none focus:ring-2 focus:ring-${selectedAttribute.color}
                `}
                >
                  Explore {selectedAttribute.actionName}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Add keyframes for popup animation */}
        <style jsx global>{`
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      </div>
    </div>
  )
}
export default TodaysQuote