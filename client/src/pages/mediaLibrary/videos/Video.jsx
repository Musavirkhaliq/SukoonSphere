import { YoutubeEmbed } from "@/components";
import customFetch from "@/utils/customFetch";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaList, FaChevronDown, FaChevronUp, FaComments, FaThumbsUp, FaTrophy } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import useVideoProgress from "@/hooks/useVideoProgress";

import VideoRecommendations from "@/components/mediaLibrary/videos/VideoRecommendations";
import VideoComments from "@/components/mediaLibrary/videos/VideoComments";
import VideoReactions from "@/components/mediaLibrary/videos/VideoReactions";
import VideoAchievements from "@/components/mediaLibrary/videos/VideoAchievements";
import VideoBadgePopup from "@/components/mediaLibrary/videos/VideoBadgePopup";
import VideoPlaylistApi from "@/utils/videoPlaylistApi";

const Video = () => {
    const { id: videoId } = useParams();
    const { user } = useUser();
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    // Playlist navigation
    const [playlist, setPlaylist] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [prevVideo, setPrevVideo] = useState(null);
    const [nextVideo, setNextVideo] = useState(null);
    const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

    // Achievement tracking
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [currentBadge, setCurrentBadge] = useState(null);
    const [playlistCompleted, setPlaylistCompleted] = useState(false);

    // Collapsible section states
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);

    // References
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);

    // Progress tracking state
    const [progress, setProgress] = useState(0);
    const [watchStatus, setWatchStatus] = useState('not-started');
    const lastReportedProgress = useRef(0);

    // Use our custom hook for direct video progress tracking
    const {
        reportProgress,
        getWatchStatus
    } = useVideoProgress(videoId, videoRef);

    const fetchVideo = async () => {
        try {
            const { data } = await customFetch.get(`/videos/video/${videoId}`);
            setVideo(data.video);

            // Check if this video is part of a playlist
            checkForPlaylist(data.video);
        } catch (error) {
            setError(error.message);
        }
    };

    // Check if the video is part of a playlist and set up navigation
    const checkForPlaylist = async () => {
        try {
            setIsLoadingPlaylist(true);

            // Find playlists that contain this video
            const playlists = await customFetch.get('/video-playlists/all');
            const playlistWithVideo = playlists.data.playlists.find(p =>
                p.videos && p.videos.some(v => v === videoId || v._id === videoId)
            );

            if (playlistWithVideo) {
                // Get full playlist details with videos
                const playlistDetails = await VideoPlaylistApi.getPlaylistDetails(playlistWithVideo._id);
                setPlaylist(playlistDetails);

                // Find the current video index in the playlist
                const videoIds = playlistDetails.videos.map(v => v._id);
                const index = videoIds.indexOf(videoId);
                setCurrentIndex(index);

                // Set previous and next videos
                if (index > 0) {
                    setPrevVideo(playlistDetails.videos[index - 1]);
                }

                if (index < playlistDetails.videos.length - 1) {
                    setNextVideo(playlistDetails.videos[index + 1]);
                }
            }
        } catch (error) {
            console.error('Error checking for playlist:', error);
        } finally {
            setIsLoadingPlaylist(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchVideo();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [videoId]);

    // No custom video control functions needed as we're using YouTube's player



    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center px-4">
                <div className="bg-red-50 p-4 rounded-lg max-w-md w-full">
                    <h2 className="text-red-800 text-xl mb-2">Error Loading Video</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link
                        to="/all-videos"
                        className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Back to Videos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Navigation */}
                    <nav className="mb-4">
                        <Link
                            to="/all-videos"
                            className="text-[var(--primary)] hover:underline hover:text-[var(--ternery)] inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Videos
                        </Link>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Video Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {/* Video Player */}
                                <div className="relative w-full" ref={videoContainerRef}>
                                    {isLoading ? (
                                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {/* Use YouTube embed for all videos */}
                                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                                <div className="absolute inset-0">
                                                    <YoutubeEmbed
                                                        embedId={video?.videoUrl}
                                                        onStateChange={async (event) => {
                                                            // Mark video as started when it begins playing
                                                            if (event.data === window.YT.PlayerState.PLAYING) {
                                                                // If this is the first time playing (progress is 0), mark as in progress
                                                                if (progress === 0) {
                                                                    // Report minimal progress (1%) to mark as "in progress"
                                                                    await reportProgress(1);
                                                                    lastReportedProgress.current = 1;
                                                                    setProgress(1);

                                                                    console.log('Video marked as in progress');
                                                                }
                                                            }
                                                        }}
                                                        onProgress={async (progressPercent) => {
                                                            // Update progress state
                                                            setProgress(progressPercent);

                                                            // Update watch status based on progress
                                                            const newStatus = getWatchStatus(progressPercent);
                                                            if (newStatus !== watchStatus) {
                                                                setWatchStatus(newStatus);
                                                                console.log(`Video status changed to: ${newStatus}`);

                                                                // If status just changed to 'in-progress', log it
                                                                if (newStatus === 'in-progress' && watchStatus === 'not-started') {
                                                                    console.log('Video marked as in progress');
                                                                }

                                                                // If status just changed to 'completed', log it
                                                                if (newStatus === 'completed' && watchStatus !== 'completed') {
                                                                    console.log('Video marked as completed');
                                                                }
                                                            }

                                                            // Report progress to server periodically
                                                            if (Math.abs(progressPercent - lastReportedProgress.current) >= 5) {
                                                                const newBadges = await reportProgress(progressPercent);
                                                                lastReportedProgress.current = progressPercent;

                                                                // If new badges were earned, update state
                                                                if (newBadges && newBadges.length > 0) {
                                                                    setEarnedBadges(prev => [...prev, ...newBadges]);
                                                                    setCurrentBadge(newBadges[0]);
                                                                }

                                                                // If progress is >= 90%, check if playlist is completed
                                                                if (progressPercent >= 90 && playlist) {
                                                                    try {
                                                                        const completionData = await VideoTracker.checkPlaylistCompletion(playlist._id);

                                                                        if (completionData.isCompleted && !playlistCompleted) {
                                                                            setPlaylistCompleted(true);

                                                                            // If new badges were earned from playlist completion
                                                                            if (completionData.newBadges && completionData.newBadges.length > 0) {
                                                                                setEarnedBadges(prev => [...prev, ...completionData.newBadges]);
                                                                                // Show the first badge after current badge is closed
                                                                                if (!currentBadge) {
                                                                                    setCurrentBadge(completionData.newBadges[0]);
                                                                                }
                                                                            }
                                                                        }
                                                                    } catch (error) {
                                                                        console.error('Error checking playlist completion:', error);
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Playlist Navigation */}
                                {isLoadingPlaylist && (
                                    <div className="bg-gray-50 p-3 border-t border-b flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--primary)]"></div>
                                        <span className="ml-2 text-sm text-gray-600">Loading playlist...</span>
                                    </div>
                                )}
                                {playlist && !isLoadingPlaylist && (
                                    <div className="bg-gray-50 p-3 border-t border-b flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Link
                                                to={`/all-videos/playlist/${playlist._id}`}
                                                className="text-[var(--primary)] hover:underline flex items-center text-sm"
                                            >
                                                <FaList className="mr-1" />
                                                {playlist.title} ({currentIndex + 1}/{playlist.videos.length})
                                            </Link>
                                        </div>
                                        <div className="flex gap-2">
                                            {prevVideo ? (
                                                <Link
                                                    to={`/all-videos/video/${prevVideo._id}`}
                                                    className="btn-sm btn-outline flex items-center"
                                                >
                                                    <FaArrowLeft className="mr-1" />
                                                    Previous
                                                </Link>
                                            ) : (
                                                <button className="btn-sm btn-outline opacity-50 cursor-not-allowed flex items-center" disabled>
                                                    <FaArrowLeft className="mr-1" />
                                                    Previous
                                                </button>
                                            )}

                                            {nextVideo ? (
                                                <Link
                                                    to={`/all-videos/video/${nextVideo._id}`}
                                                    className="btn-sm btn-2 flex items-center"
                                                >
                                                    Next
                                                    <FaArrowRight className="ml-1" />
                                                </Link>
                                            ) : (
                                                <button className="btn-sm btn-2 opacity-50 cursor-not-allowed flex items-center" disabled>
                                                    Next
                                                    <FaArrowRight className="ml-1" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Video Info */}
                                {video && (
                                    <div className="p-4">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h1>
                                        <p className="text-gray-600">{video.description}</p>

                                        {/* Watch Progress for logged-in users */}
                                        {user && progress > 0 && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">Your progress</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-[var(--primary)] h-2.5 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}% watched</p>
                                            </div>
                                        )}

                                        {/* Video Reactions - Collapsible */}
                                        {video && (
                                            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setShowReactions(!showReactions)}
                                                    className="w-full p-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <FaThumbsUp className="mr-2 text-[var(--primary)]" />
                                                        <span className="font-medium">Reactions</span>
                                                        {video.likes && video.likes.length > 0 && (
                                                            <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                                                {video.likes.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {showReactions ? <FaChevronUp /> : <FaChevronDown />}
                                                </button>

                                                {showReactions && (
                                                    <div className="p-4">
                                                        <VideoReactions videoId={videoId} videoTitle={video.title} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Comments Section - Collapsible */}
                            {video && (
                                <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setShowComments(!showComments)}
                                        className="w-full p-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <FaComments className="mr-2 text-[var(--primary)]" />
                                            <span className="font-medium">Comments</span>
                                        </div>
                                        {showComments ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>

                                    {showComments && (
                                        <div className="p-4">
                                            <VideoComments videoId={videoId} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {/* Achievements - Collapsible */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                    <button
                                        onClick={() => setShowAchievements(!showAchievements)}
                                        className="w-full p-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <FaTrophy className="mr-2 text-[var(--primary)]" />
                                            <span className="font-medium">Your Achievements</span>
                                        </div>
                                        {showAchievements ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>

                                    {showAchievements && <VideoAchievements />}
                                </div>

                                {/* Recommendations */}
                                <div className="bg-white rounded-xl shadow-lg p-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Videos</h2>
                                    <VideoRecommendations videoId={videoId} currentVideo={video} />
                                </div>
                            </div>
                        </div>

                        {/* Badge Popup */}
                        {currentBadge && (
                            <VideoBadgePopup
                                badge={currentBadge}
                                onClose={() => {
                                    // Remove current badge
                                    setCurrentBadge(null);

                                    // Show next badge if any
                                    if (earnedBadges.length > 0) {
                                        const nextBadges = earnedBadges.filter(b => b._id !== currentBadge._id);
                                        setEarnedBadges(nextBadges);

                                        if (nextBadges.length > 0) {
                                            setCurrentBadge(nextBadges[0]);
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;