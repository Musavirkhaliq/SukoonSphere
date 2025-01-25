import { YoutubeEmbed } from "@/components";
import customFetch from "@/utils/customFetch";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Video = () => {
    const {id: videoId} = useParams();
    const [video,setVideo]=useState()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideo = async () => {
        try {
            const {data} = await customFetch.get(`/videos/video/${videoId}`);
            setVideo(data.video);
        } catch (error) {
            setError(error.message);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        fetchVideo();
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

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
                <div className="max-w-4xl mx-auto">
                    {/* Navigation */}
                    <nav className="mb-4">
                        <Link 
                            to="/all-videos" 
                            className="text-[var(--primary-color)] hover:underline hover:text-[var(--ternery)] inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Videos
                        </Link>
                    </nav>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="relative w-full" >
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                {isLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-color)] border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0">
                                        <YoutubeEmbed embedId={video?.videoUrl} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Video;