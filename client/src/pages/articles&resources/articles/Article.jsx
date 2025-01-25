import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import {
  FaBars,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute,
  FaMale,
  FaFemale,
  FaRegCommentAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { LuTableOfContents } from "react-icons/lu";
import { FaArrowTrendDown } from "react-icons/fa6";
import "./Article.css";

import SimilarArticles from "../../../components/articleComponents/SimilarArticles";
import CommentPopup from "@/components/articleComponents/CommentPopup";
import { toast } from "react-toastify";
import { BiUpvote } from "react-icons/bi";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const { id } = useParams();
  const [toc, setToc] = useState([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const navigate = useNavigate();

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .trim();
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`articles/${id}`);
        const articleData = response.data.article;
        setArticle(articleData);
        setSimilarArticles(response.data.similarArticles);
        setLikeCount(articleData.likes?.length || 0);

        // Check if the current user has liked the article
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && articleData.likes) {
          setIsLiked(articleData.likes.includes(currentUser._id));
        }

        setError(null);
      } catch (err) {
        setError("Failed to load article. Please try again later.");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      toast.error("Please login to like this article!");
      navigate("/auth/sign-up");
      return;
    }

    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const response = await customFetch.patch(`articles/${id}/like`);
      const updatedArticle = response.data.article;

      setIsLiked(!isLiked);
      setLikeCount(updatedArticle.likes.length);

      setArticle((prev) => ({
        ...prev,
        likes: updatedArticle.likes,
      }));
    } catch (error) {
      console.error("Error liking article:", error);
      toast.error("Failed to like article. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

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

  useEffect(() => {
    if (article?.content) {
      const headings = Array.from(
        document.querySelectorAll(".article-body h1, .article-body h2")
      );

      headings.forEach((heading) => {
        if (!heading.id) {
          const slug = generateSlug(heading.innerText);
          heading.id = slug;
        }
      });

      const newToc = headings.map((heading) => ({
        text: heading.innerText,
        slug: heading.id || generateSlug(heading.innerText),
      }));

      setToc(newToc);
    }
  }, [article]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    return () => {
      if (utterance) {
        synth.cancel();
      }
    };
  }, [utterance]);

  const cleanContent = (content) => {
    try {
      return content
        .replace(
          /<div class="flex-shrink-0 flex flex-col relative items-end">[\s\S]*?<div class="relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">/,
          ""
        )
        .replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>$/, "")
        .trim();
    } catch (err) {
      console.error("Error cleaning content:", err);
      return content;
    }
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

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
    tempDiv.innerHTML = cleanContent(article.content);
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

        synth.speak(newUtterance);
      }
    };

    setIsPlaying(true);
    speakNextChunk();
  };

  const toggleToc = () => {
    setIsTocOpen(!isTocOpen);
  };

  // Modified click handler for TOC links
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg max-w-md text-center">
          <FaExclamationCircle className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
          <p className="text-lg font-medium mb-2">Article Not Found</p>
          <p>
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(article.content);

  return (
    <div className="relative bg-white">
      {/* Mobile TOC Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white shadow-sm">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={toggleToc}
            className="flex items-center gap-2 text-[var(--primary) hover:text-ternary transition-colors duration-200"
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
            {article.title}
          </h3>
        </div>
      </div>

      {/* Mobile TOC Dropdown */}
      <div
        className={`lg:hidden overflow-x-hidden fixed top-[50px] left-0 right-0 z-50 bg-white  transform transition-transform duration-300 ease-in-out ${isTocOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="px-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="table-of-contents">
            <h2 className="hidden text-xl font-bold mb-6 lg:flex items-center justify-between gap-3 text-[var(--primary)]">
              <div className="flex items-center gap-3">
                <LuTableOfContents className="text-[var(--primary)] " />
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
            <header className="max-w-4xl mx-auto px-4 py-4 space-y-3 border-b-2 border-gray-200">
              {/* Title */}
              <h2 className="text-3xl font-bold leading-tight text-gray-900">
                {article.title || "Every book I read in 2024, with commentary"}
              </h2>

              {/* Author and Meta Info Bar */}
              <div className="flex flex-col md:flex-row justify-between py-4 space-y-6 md:space-y-0">
                <div className="flex gap-3">
                  {/* Author Section */}
                  <div className="flex gap-3">
                    <img
                      src={article?.authorAvatar}
                      alt={article?.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium md:font-semibold text-sm md:text-base text-[var(--primary)]">
                          {article?.author?.name ||
                            article?.authorName ||
                            "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--grey--800)]">
                        <span>{readingTime || "10"} min read</span>
                        <span>·</span>
                        <span>
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-4">
                    {/* Upvote Button */}
                    <div
                      className={`meta-item upvote-button ${isLikeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={handleLike}
                    >
                      <div className="flex items-center justify-center gap-2 w-8 h-8 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                        {isLikeLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
                        ) : isLiked ? (
                          <BiUpvote className="meta-icon liked text-[var(--ternery)]" />
                        ) : (
                          <BiUpvote className="meta-icon text-[var(--primary)]" />
                        )}
                      </div>
                      <span className="text-sm text-[var(--grey--800)]">
                        {likeCount}
                      </span>
                    </div>

                    {/* Comment Button */}
                    <button
                      onClick={() => setIsCommentOpen(true)}
                      className="flex items-center gap-2 text-[var(--grey--800)] hover:text-[var(--ternery)]"
                    >
                      <FaRegCommentAlt className="w-5 h-5" />
                      <span>{article.totalComments || 0}</span>
                    </button>

                    {/* Listen Button Group */}
                    <div className="inline-flex items-center rounded-full shadow-sm hover:shadow-md transition-all duration-300 p-1">
                      <div className="flex space-x-1">
                        {/* Female Voice Button */}
                        <button
                          onClick={() => setVoiceGender("female")}
                          className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${
                            voiceGender === "female"
                              ? "bg-pink-500 text-white scale-110"
                              : "text-pink-500 hover:bg-pink-50"
                          }`}
                          title="Female Voice"
                        >
                          <FaFemale
                            className={`w-4 h-4 ${voiceGender === "female" ? "animate-pulse" : ""}`}
                          />
                        </button>
                        {/* Male Voice Button */}
                        <button
                          onClick={() => setVoiceGender("male")}
                          className={`flex items-center justify-center rounded-full w-8 h-8 transition-all duration-300 ${
                            voiceGender === "male"
                              ? "bg-blue-500 text-white scale-110"
                              : "text-blue-500 hover:bg-blue-50"
                          }`}
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
                        className={`flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
                          isPlaying
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
                        }`}
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

            <div
              className="progress-bar"
              style={{ width: `${scrollProgress}%` }}
            ></div>
            <div
              className="article-body prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: cleanContent(article.content),
              }}
            />
          </article>

          {/* Desktop Table of Contents */}
          <section className="hidden lg:block col-span-12 lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-14 bg-white rounded-xl shadow-md p-6">
              <div className="table-of-contents">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[var(--primary)] ">
                  <LuTableOfContents className="text-[var(--primary)] " />
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
        <div className="mt-12">
          <SimilarArticles similarArticles={similarArticles} />
        </div>
      </div>
      <CommentPopup
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
        articleId={id}
      />
    </div>
  );
};

export default Article;
