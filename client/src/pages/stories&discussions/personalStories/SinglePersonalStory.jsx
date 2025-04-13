import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  FaRegComment,
  FaUser,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaBars,
  FaTimes,
  FaExclamationCircle,
  FaVolumeUp,
  FaVolumeMute,
  FaMale,
  FaFemale,
} from "react-icons/fa";
import ReactionButton from "@/components/shared/Reactions/ReactionButton";
import { LuTableOfContents } from "react-icons/lu";
import { FaArrowTrendDown } from "react-icons/fa6";

import "./PersonalStory.css";
import EditStoryModal from "@/components/personalStories/EditStoryModal";
import DeleteModal from "@/components/shared/DeleteModal";

import PersonalStoryCommentPopup from "@/components/personalStories/PersonalStoryCommentPopup";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

const SinglePersonalStory = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toc, setToc] = useState([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");

  // Fetch story data
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["personalStory", id],
    queryFn: async () => {
      const response = await customFetch.get(`/personal-stories/${id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const story = data?.story;

  // Update like state when data is loaded
  useEffect(() => {
    if (story) {
      setIsLiked(story.isLiked || false);
      setLikesCount(story.totalLikes || 0);
    }
  }, [story]);

  // Get reading time in minutes
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Toggle TOC
  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  // Handle TOC click
  const handleTocClick = (e, slug) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsTocOpen(false);
    } else {
      console.error(`Element with id '${slug}' not found`);
    }
  };

  // Handle scroll for progress bar
  const handleScroll = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Text-to-speech functionality
  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    const voices = synth.getVoices();
    const maleVoicePreferences = [
      "Microsoft David Desktop",
      "Google UK English Male",
      "Microsoft David",
      "en-GB-Standard-B",
      "en-US-Standard-B",
    ];

    const selectedVoice =
      voices.find((voice) => {
        const voiceName = voice.name.toLowerCase();
        if (voiceGender === "male") {
          return maleVoicePreferences.some((preferred) =>
            voiceName.includes(preferred.toLowerCase())
          );
        } else {
          return (
            voiceName.includes("female") ||
            voiceName.includes("zira") ||
            voiceName.includes("helena")
          );
        }
      }) ||
      voices.find((voice) => {
        const voiceName = voice.name.toLowerCase();
        return voiceGender === "male"
          ? voiceName.includes("male") || voiceName.includes("david")
          : voiceName.includes("female") || voiceName.includes("zira");
      }) ||
      voices[0];

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = story.content;
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";
    const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [];

    let currentChunk = 0;

    const speakNextChunk = () => {
      if (currentChunk < chunks.length) {
        const newUtterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
        if (selectedVoice) {
          newUtterance.voice = selectedVoice;
        }

        // Add natural pauses at punctuation
        const text = chunks[currentChunk];
        const shouldPauseMore =
          text.endsWith("?") || text.endsWith("!") || text.endsWith(":");
        const pauseDuration = shouldPauseMore ? 400 : 200;

        if (voiceGender === "male") {
          // Male voice settings optimized for naturalness
          newUtterance.pitch = 0.95;
          newUtterance.rate = 0.98;
          newUtterance.volume = 1;
        } else {
          // Female voice settings optimized for naturalness
          newUtterance.pitch = 1.1;
          newUtterance.rate = 0.95;
          newUtterance.volume = 1;
        }

        // Add slight variations to pitch and rate for more natural sound
        const pitchVariation = Math.random() * 0.1 - 0.05;
        const rateVariation = Math.random() * 0.1 - 0.05;

        newUtterance.pitch += pitchVariation;
        newUtterance.rate += rateVariation;

        // Handle sentence endings with appropriate pauses
        newUtterance.onend = () => {
          currentChunk++;
          if (currentChunk < chunks.length) {
            // Add longer pauses at the end of sentences or before important punctuation
            setTimeout(() => speakNextChunk(), pauseDuration);
          } else {
            setIsPlaying(false);
          }
        };

        newUtterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          setIsPlaying(false);
        };

        setUtterance(newUtterance);
        synth.speak(newUtterance);
      }
    };

    setIsPlaying(true);
    speakNextChunk();
  };

  // Clean up speech synthesis on unmount
  useEffect(() => {
    const synth = window.speechSynthesis;
    return () => {
      if (utterance) {
        synth.cancel();
      }
    };
  }, [utterance]);

  // Handle reaction change
  const handleReactionChange = (reactionCounts, userReaction) => {
    // Update the story state with the new reaction data
    setIsLiked(!!userReaction);
    setLikesCount(Object.values(reactionCounts).reduce((sum, count) => sum + count, 0));
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await customFetch.delete(`/personal-stories/${id}`);
      toast.success("Story deleted successfully");
      navigate("/personal-stories");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error(error?.response?.data?.msg || "Failed to delete story");
    }
  };

  // Handle story update
  const handleStoryUpdate = () => {
    refetch();
  };

  // Check if user is the author
  const isAuthor = user && story && (
    (story.author === user._id) ||
    (story.isAnonymous && story.realCreator === user._id)
  );

  // Generate TOC from headings
  useEffect(() => {
    if (story?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = story.content;

      const headings = Array.from(
        tempDiv.querySelectorAll('h1, h2, h3')
      );

      const newToc = headings.map((heading, index) => {
        const text = heading.textContent;
        const slug = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
        heading.id = slug;
        return { text, slug };
      });

      setToc(newToc);
    }
  }, [story]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !story) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error?.response?.data?.msg || "The story could not be found or has been removed."}</p>
          <Link to="/personal-stories" className="btn-2 inline-flex items-center gap-2 mt-4">
            <FaArrowLeft />
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(story.content);

  return (
    <div className="relative bg-white">
      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        title="Delete Story"
        message="Are you sure you want to delete this story? This action cannot be undone."
        itemType="story"
      />

      {/* Mobile TOC Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white shadow-sm">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={toggleToc}
            className="flex items-center gap-2 text-[var(--primary)] hover:text-ternary transition-colors duration-200"
            aria-label="Toggle Table of Contents"
          >
            {isTocOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
            <span className="font-medium">Contents</span>
          </button>
          <h3 className="text-sm font-medium text-[var(--grey--800)] truncate max-w-[200px]">
            {story.title}
          </h3>
        </div>
      </div>

      {/* Mobile TOC Dropdown */}
      <div
        className={`lg:hidden overflow-x-hidden fixed top-[50px] left-0 right-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${isTocOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="px-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="table-of-contents">
            <h2 className="hidden text-xl font-bold mb-6 lg:flex items-center justify-between gap-3 text-[var(--primary)]">
              <div className="flex items-center gap-3">
                <LuTableOfContents className="text-[var(--primary)]" />
                Quick Navigation
              </div>
            </h2>
            <nav className="toc-nav">
              <ol className="space-y-4">
                {toc.map((item, index) => (
                  <li key={index} className="group">
                    <a
                      href={`#${item.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.slug);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          setIsTocOpen(false);
                        } else {
                          console.error(
                            `Element with id '${item.slug}' not found.`
                          );
                        }
                      }}
                    >
                      <FaArrowTrendDown className="text-ternary w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      <span className="text-gray-700 group-hover:text-ternary transition-colors duration-200 font-medium">
                        {item.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile TOC Overlay */}
      <div
        className={`lg:hidden overflow-x-hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isTocOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggleToc}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-12 gap-6 lg:gap-12">
          <article className="col-span-12 lg:col-span-8 order-2 lg:order-1 mt-4 lg:mt-8">
            {/* Back button */}
            <div className="mb-6 px-4">
              <Link to="/personal-stories" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <FaArrowLeft />
                Back to Stories
              </Link>
            </div>

            <header className="max-w-4xl mx-auto px-4 py-4 space-y-3 border-b-2 border-gray-200">
              {/* Title with Edit/Delete buttons for owner */}
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl font-bold leading-tight text-gray-900">
                  {story.title}
                </h2>

                {isAuthor && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      title="Edit story"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      title="Delete story"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Author and Meta Info Bar */}
              <div className="flex flex-col md:flex-row justify-between py-4 space-y-6 md:space-y-0">
                <div className="flex gap-3">
                  {/* Author Section */}
                  <div className="flex gap-3">
                    {story.authorAvatar ? (
                      <img
                        src={story.authorAvatar}
                        alt={story.authorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium md:font-semibold text-sm md:text-base text-[var(--primary)]">
                          {story.authorName || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--grey--800)]">
                        <span>{readingTime || "5"} min read</span>
                        <span>·</span>
                        <span>
                          {format(new Date(story.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-4">
                    {/* Reaction Button */}
                    <div className="meta-item">
                      <ReactionButton
                        contentId={id}
                        contentType="personalStory"
                        initialReactions={{ like: likesCount }}
                        initialUserReaction={isLiked ? 'like' : null}
                        onReactionChange={handleReactionChange}
                      />
                    </div>

                    {/* Comment Button */}
                    <button
                      onClick={() => {
                        const currentUser = JSON.parse(localStorage.getItem("user"));
                        if (!currentUser) {
                          toast.info("Login to join the conversation");
                        }
                        setIsCommentOpen(true);
                      }}
                      className="flex items-center gap-2 text-[var(--grey--800)] hover:text-[var(--ternery)]"
                      title="View comments"
                    >
                      <FaRegComment className="w-5 h-5" />
                      <span>{story.totalComments || 0}</span>
                    </button>

                    {/* Listen Button Group */}
                    <div className="inline-flex items-center rounded-full shadow-sm hover:shadow-md transition-all duration-300 p-1">
                      <div className="flex space-x-1">
                        {/* Female Voice Button */}
                        <button
                          onClick={() => setVoiceGender("female")}
                          className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${voiceGender === "female" ? "bg-pink-500 text-white scale-110" : "text-pink-500 hover:bg-pink-50"}`}
                          title="Female Voice"
                        >
                          <FaFemale
                            className={`w-4 h-4 ${voiceGender === "female" ? "animate-pulse" : ""}`}
                          />
                        </button>
                        {/* Male Voice Button */}
                        <button
                          onClick={() => setVoiceGender("male")}
                          className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${voiceGender === "male" ? "bg-blue-500 text-white scale-110" : "text-blue-500 hover:bg-blue-50"}`}
                          title="Male Voice"
                        >
                          <FaMale
                            className={`w-4 h-4 ${voiceGender === "male" ? "animate-pulse" : ""}`}
                          />
                        </button>
                      </div>

                      <div className="w-[1px] bg-gray-200 mx-1 h-6 self-center"></div>

                      {/* Play/Stop Button */}
                      <button
                        onClick={handleTextToSpeech}
                        className={`flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-300 ${isPlaying ? "bg-red-500 text-white hover:bg-red-600" : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"}`}
                        title={isPlaying ? "Stop Reading" : "Start Reading"}
                      >
                        <div className="flex items-center gap-2">
                          {isPlaying ? (
                            <>
                              <FaVolumeMute className="w-4 h-4" />
                              <span className="text-sm font-medium">Stop</span>
                            </>
                          ) : (
                            <>
                              <FaVolumeUp
                                className={`w-4 h-4 ${!isPlaying && voiceGender ? "animate-bounce" : ""}`}
                              />
                              <span className="text-sm font-medium">
                                Listen
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Reading Progress Bar */}
            <div
              className="progress-bar"
              style={{ width: `${scrollProgress}%` }}
            ></div>

            {/* Story Cover Image */}
            {story.imageUrl && (
              <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              </div>
            )}

            {/* Story Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div
                className="article-body prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: story.content,
                }}
              />
            </div>
          </article>

          {/* Desktop Table of Contents */}
          <section className="hidden lg:block col-span-12 lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-14 bg-white rounded-xl shadow-md p-6">
              <div className="table-of-contents">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--primary)]">
                  <LuTableOfContents className="text-[var(--primary)]" />
                  Quick Navigation
                </h2>
                <nav className="toc-nav max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <ol className="space-y-3 pr-4">
                    {toc.map((item, index) => (
                      <li key={index} className="group">
                        <a
                          href={`#${item.slug}`}
                          className="flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                          onClick={(e) => handleTocClick(e, item.slug)}
                        >
                          <FaArrowTrendDown className="text-ternary w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="text-gray-700 group-hover:text-ternary transition-colors duration-200 font-medium">
                            {item.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </section>
        </div>

        {/* Comments section - only shown in popup on mobile */}
        <div className="mt-12 px-4 lg:hidden">
          <button
            onClick={() => setIsCommentOpen(true)}
            className="btn-2 w-full flex items-center justify-center gap-2"
          >
            <FaRegComment />
            View All Comments ({story.totalComments || 0})
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <EditStoryModal
          story={story}
          onClose={() => setShowEditModal(false)}
          onStoryUpdated={handleStoryUpdate}
        />
      )}

      {/* Comment popup */}
      <PersonalStoryCommentPopup
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        storyId={id}
      />
    </div>
  );
};

export default SinglePersonalStory;
