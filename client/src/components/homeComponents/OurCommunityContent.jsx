import React, { Suspense, useState } from 'react';
import LoadingSpinner from '../loaders/LoadingSpinner';

import EnhancedUserPosts from "@/components/homeComponents/EnhancedUserPosts";
import EnhancedQuestions from "@/components/homeComponents/EnhancedQuestions";
import EnhancedArticles from "@/components/homeComponents/EnhancedArticles";
import { VideoSection } from "@/components";

const OurCommunityContent = () => {
    const [activeTab, setActiveTab] = useState('posts');

    const tabs = [
        { id: 'posts', label: 'Community Posts', icon: '👥' },
        { id: 'articles', label: 'Articles', icon: '📚' },
        { id: 'questions', label: 'Questions', icon: '❓' },
        { id: 'videos', label: 'Videos', icon: '🎬' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg  transition-all duration-300 ">
            {/* Tab Navigation - Responsive */}
            <div className="flex flex-wrap md:flex-nowrap overflow-x-auto whitespace-nowrap border-b border-gray-200 gap-1 ">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`
                            flex items-center justify-center px-3 py-3 md:px-4 md:py-2 font-medium text-sm md:text-base rounded-t-lg transition-all duration-200 flex-1 md:flex-none
                            ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                        `}
                        onClick={() => setActiveTab(tab.id)}
                        aria-selected={activeTab === tab.id}
                        role="tab"
                    >
                        <span className="hidden md:inline-block mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections - With Transitions */}
            <div className=" min-h-96 transition-all duration-300">
                {/* Loading Spinner Styling */}
                <div className="relative">
                    {/* Community Posts Section */}
                    {activeTab === 'posts' && (
                        <section className="animate-fadeIn homogeneous-section">
                            <div className="section-content">
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <LoadingSpinner />
                                    </div>
                                }>
                                    <EnhancedUserPosts />
                                </Suspense>
                            </div>
                        </section>
                    )}

                    {/* Articles Section */}
                    {activeTab === 'articles' && (
                        <section className="animate-fadeIn homogeneous-section">
                            <div className="section-content">
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <LoadingSpinner />
                                    </div>
                                }>
                                    <EnhancedArticles />
                                </Suspense>
                            </div>
                        </section>
                    )}

                    {/* Community Questions Section */}
                    {activeTab === 'questions' && (
                        <section className="animate-fadeIn homogeneous-section">
                            <div className="section-content">
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <LoadingSpinner />
                                    </div>
                                }>
                                    <EnhancedQuestions />
                                </Suspense>
                            </div>
                        </section>
                    )}

                    {/* Video Section */}
                    {activeTab === 'videos' && (
                        <section className="animate-fadeIn homogeneous-section">
                            <div className="section-content">
                                <div className="homogeneous-header text-center mb-6">
                                    <h2 className="homogeneous-title text-2xl font-bold text-gray-800">Featured Videos</h2>
                                    <p className="homogeneous-subtitle text-gray-600">Watch informative videos about mental health and wellbeing</p>
                                </div>
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-64">
                                        <LoadingSpinner />
                                    </div>
                                }>
                                    <VideoSection />
                                </Suspense>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OurCommunityContent;