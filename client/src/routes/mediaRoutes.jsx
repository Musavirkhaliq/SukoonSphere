import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';

// Lazy load each page component
const AllQuizzes = lazy(() => import('../pages/articles&resources/quiz/AllQuizzes'));
const Quiz = lazy(() => import('../pages/articles&resources/quiz/Quiz'));
// Import loaders as usual
import { AllQuizzesLoader } from '@/loaders/AllQuizzesLoader';
import { QuizDetailsLoader } from '@/loaders/QuizDetailsLoader';
import SingleVideos from '@/pages/mediaLibrary/videos/SingleVideos';
import { singleVideosLoader } from '@/loaders/singleVideosLoader';
import Video from '@/pages/mediaLibrary/videos/Video';
import AllVideos from '@/pages/mediaLibrary/videos/AllVideos';
import VideoPlaylists from '@/pages/mediaLibrary/videos/VideoPlaylists';
import PlaylistDetails from '@/pages/mediaLibrary/videos/PlaylistDetails';
import { PodcastHome } from '@/pages';
import AllsinglePodcasts from '@/pages/mediaLibrary/podcasts/AllsinglePodcasts';
import AllPdocastPlaylists from '@/pages/mediaLibrary/podcasts/AllPdocastPlaylists';
import PodcastPlaylistDetails from '@/pages/mediaLibrary/podcasts/PlaylistDetails';
import SingleEpisode from '@/pages/mediaLibrary/podcasts/SingleEpisode';
import { playlistVideosLoader } from '@/loaders/playlistVideosLoader';

export const mediaRoutes = [
    {
        path: '/quiz',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Quiz />
            </Suspense>
        ),
    },

    {
        path: '/all-quizzes',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AllQuizzes />
            </Suspense>
        ),
        loader: AllQuizzesLoader,
    },
    {
        path: '/all-quizzes/quiz/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Quiz />
            </Suspense>
        ),
        loader: QuizDetailsLoader,
    },

    {
        path: '/all-videos',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <AllVideos />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: <SingleVideos />,
                loader: singleVideosLoader
            },
            {
                path: 'playlists',
                element: <VideoPlaylists />
            },
            {
                path: 'playlist/:playlistId',
                element: <PlaylistDetails />
            },
        ],
    },
    {
        path: '/all-videos/video/:id',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <Video />
            </Suspense>
        ),
    },

    {
        path: '/podcasts',
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                <PodcastHome />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: <AllsinglePodcasts />,
            },
            {
                path: 'playlists',
                element: <AllPdocastPlaylists />,
            },
            {
                path: 'playlist/:playlistId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <PodcastPlaylistDetails />
                    </Suspense>
                ),
            },
            {
                path: 'episode/:episodeId',
                element: (
                    <Suspense fallback={<LoadingSpinner />}>
                        <SingleEpisode />
                    </Suspense>
                ),
            },
            {

            }
        ],
    },
];
