import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const YoutubeEmbed = ({ embedId, onProgress, onReady, onStateChange }) => {
    const playerRef = useRef(null);
    const iframeRef = useRef(null);

    // Extract YouTube video ID from URL if needed
    const getYoutubeId = (url) => {
        if (!url) return '';

        // Handle different YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        }

        // If the input is already a video ID (11 characters)
        if (url.length === 11) {
            return url;
        }

        // If it's already an embed URL, extract the ID
        if (url.includes('youtube.com/embed/')) {
            const embedMatch = url.match(/youtube\.com\/embed\/([^\/\?&]+)/);
            if (embedMatch && embedMatch[1]) {
                return embedMatch[1];
            }
        }

        console.warn('Could not extract YouTube ID from URL:', url);
        return ''; // Return empty if we can't parse it
    };

    // Format the embed URL correctly
    const getEmbedUrl = (url) => {
        const videoId = getYoutubeId(url);

        if (!videoId) {
            console.error('Invalid YouTube URL:', url);
            return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Fallback to a default video
        }

        // Always use the standard embed format with API enabled
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}&autoplay=0&rel=0`;
    };

    // Initialize YouTube API and player
    useEffect(() => {
        // Load YouTube API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }

        function initPlayer() {
            if (iframeRef.current && window.YT && window.YT.Player) {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    events: {
                        onReady: handleReady,
                        onStateChange: handleStateChange
                    }
                });
            }
        }

        return () => {
            // Clean up
            if (playerRef.current) {
                playerRef.current = null;
            }
        };
    }, [embedId]);

    // Set up progress tracking
    useEffect(() => {
        let progressInterval;

        const trackProgress = () => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                try {
                    const currentTime = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();

                    if (duration > 0) {
                        const progressPercent = (currentTime / duration) * 100;
                        if (onProgress) {
                            onProgress(progressPercent, currentTime, duration);
                        }
                    }
                } catch (error) {
                    console.error('Error tracking YouTube progress:', error);
                }
            }
        };

        if (playerRef.current) {
            // Track progress every 5 seconds
            progressInterval = setInterval(trackProgress, 5000);
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [onProgress]);

    const handleReady = (event) => {
        if (onReady) {
            onReady(event);
        }
    };

    const handleStateChange = (event) => {
        if (onStateChange) {
            onStateChange(event);
        }

        // Track progress immediately when video starts playing
        if (event.data === window.YT.PlayerState.PLAYING && onProgress) {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();
            const progressPercent = (currentTime / duration) * 100;

            // If this is the first play (near the beginning of the video), mark as "in progress"
            if (currentTime < 3 && progressPercent < 5) {
                console.log('Video started playing near the beginning - marking as in progress');
                // Force a minimum progress of 1% to mark as "in progress"
                onProgress(Math.max(1, progressPercent), currentTime, duration);
            } else {
                onProgress(progressPercent, currentTime, duration);
            }
        }
    };

    return (
        <div className="video-responsive" >
            <iframe
                ref={iframeRef}
                width="853"
                height="480"
                src={getEmbedUrl(embedId)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    );
};

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired,
    onProgress: PropTypes.func,
    onReady: PropTypes.func,
    onStateChange: PropTypes.func
};

export default YoutubeEmbed;
