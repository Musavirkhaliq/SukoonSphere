import { useState, useRef, useEffect } from "react";
import {
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { FaPlay, FaChevronRight } from "react-icons/fa";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import SectionTitle from "../sharedComponents/SectionTitle";
import customFetch from "../../utils/customFetch";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import VideoTracker from "../../utils/videoTracker";

// Format duration in seconds to MM:SS format
const formatDuration = (seconds) => {
  if (!seconds) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Skeleton Video Card Component
const SkeletonVideoCard = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md h-[440px] animate-pulse">
      {/* Skeleton for thumbnail/video */}
      <div className="relative h-full">
        <div className="w-full h-full bg-gray-200"></div>{" "}
        {/* Video placeholder */}
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="p-3 bg-white/80 rounded-full">
            <FiPlay className="text-2xl text-gray-800" />
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
        </div>
        {/* Video info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-1"></div>{" "}
          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Author */}
        </div>
      </div>
    </div>
  );
};

export default function VideoReels() {
  const { user } = useUser();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [watchHistory, setWatchHistory] = useState({});
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const videoRef = useRef(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get('/videos/all-videos');
        setVideos(data.videos.slice(0, 8)); // Limit to 8 videos for the carousel
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Fetch watch history for logged-in users
  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user) return;

      try {
        const { data } = await customFetch.get('/videos/watch-history');

        // Create a map of videoId -> watchPercentage
        const historyMap = {};
        data.watchHistory.forEach(item => {
          historyMap[item.videoId._id] = item.watchPercentage;
        });

        setWatchHistory(historyMap);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      }
    };

    fetchWatchHistory();
  }, [user]);

  // Fetch recommended videos
  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      if (!user || !videos.length) return;

      try {
        // Use the first video as a reference for recommendations if no watch history
        const videoId = Object.keys(watchHistory).length > 0
          ? Object.keys(watchHistory)[0]
          : videos[0]?._id;

        if (videoId) {
          const recommendations = await VideoTracker.getRecommendations(videoId, 4);
          setRecommendedVideos(recommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendedVideos();
  }, [user, videos, watchHistory]);

  const splideOptions = {
    perPage: 4,
    perMove: 1,
    gap: "1rem",
    pagination: true,
    arrows: false,
    breakpoints: {
      1200: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1.5 },
      480: { perPage: 1.2 },
    },
  };

  const openVideoPlayer = (video) => {
    setSelectedVideo(video);
    setMuted(true);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <SectionTitle title="Featured Videos" />
        <Link
          to="/all-videos"
          className="text-[var(--primary)] hover:underline flex items-center"
        >
          View All <FaChevronRight className="ml-1" size={12} />
        </Link>
      </div>

      {/* Featured Videos Carousel */}
      <Splide options={splideOptions} aria-label="Featured Videos">
        {loading
          ? // Show skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <SplideSlide key={`skeleton-${index}`} className="pb-8">
                <SkeletonVideoCard />
              </SplideSlide>
            ))
          : // Show real video cards when loaded
            videos.map((video) => (
              <SplideSlide key={video._id} className="pb-8">
                <div
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer h-[440px]"
                  onClick={() => openVideoPlayer(video)}
                >
                  <div className="relative h-full">
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                      <div className="p-3 bg-white/80 rounded-full">
                        <FiPlay className="text-2xl text-gray-800" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {formatDuration(video.duration)}
                    </div>

                    {/* Video info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-lg font-medium text-white line-clamp-2 mb-1">
                        {video.title}
                      </h3>

                      {/* Watch progress for logged-in users */}
                      {user && watchHistory[video._id] > 0 && (
                        <div className="mt-2 mb-2">
                          <div className="w-full bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-[var(--primary)] h-1 rounded-full"
                              style={{ width: `${watchHistory[video._id]}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">
                            {watchHistory[video._id] >= 90 ? 'Watched' : `${Math.round(watchHistory[video._id])}% watched`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Video thumbnail or cover image */}
                    <img
                      className="w-full h-full object-cover"
                      src={video.coverImage}
                      alt={video.title}
                    />
                  </div>
                </div>
              </SplideSlide>
            ))}
      </Splide>

      {/* Recommended Videos Section (if user is logged in) */}
      {user && recommendedVideos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedVideos.map(video => (
              <Link
                key={video._id}
                to={`/all-videos/video/${video._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={video.coverImage}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-white/80 rounded-full">
                      <FaPlay className="text-gray-800" />
                    </div>
                  </div>

                  {/* Watch progress indicator */}
                  {watchHistory[video._id] > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-[var(--primary)]"
                        style={{ width: `${watchHistory[video._id]}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Video info */}
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{video.description}</p>

                  {/* Watch progress text */}
                  {watchHistory[video._id] > 0 && (
                    <p className="text-xs text-[var(--primary)] mt-1">
                      {watchHistory[video._id] >= 90 ? 'Watched' : `${Math.round(watchHistory[video._id])}% watched`}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-3xl">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={selectedVideo.videoUrl}
              poster={selectedVideo.coverImage}
              autoPlay
              muted={muted}
              controls={false}
              loop
            />
            <div className="absolute top-4 right-4 flex space-x-4">
              <button
                onClick={toggleMute}
                className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
              >
                {muted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
              </button>
              <button
                onClick={closeVideoPlayer}
                className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedVideo.title}
              </h3>
              <Link
                to={`/all-videos/video/${selectedVideo._id}`}
                className="text-sm text-[var(--primary)] hover:underline"
                onClick={closeVideoPlayer}
              >
                Watch full video
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
