import React from "react";
import "./UserManual.css";
import { FaBook } from "react-icons/fa";
const UserManual = () => {
  return (
    <div className="user-manual    max-w-7xl mx-auto px-2 md:px-4 py-8">
      <h1 className="text-xl md:text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-3">
        <FaBook />
        Comprehensive User Manual
      </h1>
      <p className="text-[var(--grey--800)] mb-8">
        This manual provides a detailed guide to all features available on
        SukoonSphere.
      </p>

      <div className="space-y-8">
        {/* Feature 1: Podcast Creation */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
            <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              1
            </span>
            How to Create a Podcast
          </h2>
          <p>
            Follow this step-by-step guide to create and share your podcasts on
            SukoonSphere.
          </p>
          <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
            <p>
              • Click on the "Create Podcast" button in your podcasts dashboard.
            </p>
            <p>• A modal will appear with the podcast creation form.</p>
            <p>
              • Choose whether you are creating a playlist or a standalone
              podcast.
            </p>
            <p>... (additional steps can be added here)</p>
          </div>
        </div>

        {/* Feature 2: Video Creation */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
            <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              2
            </span>
            How to Create a Video
          </h2>
          <p>
            Follow this step-by-step guide to create and share your videos on
            SukoonSphere.
          </p>
          <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
            <p>
              • Click on the "Create Video" button in your videos dashboard.
            </p>
            <p>• A modal will appear with the video creation form.</p>
            <p>• Fill in the necessary details and upload your video file.</p>
            <p>... (additional steps can be added here)</p>
          </div>
        </div>

        {/* Feature 3: Article Creation */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
            <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              3
            </span>
            How to Create an Article
          </h2>
          <p>
            Follow this step-by-step guide to create and share your articles on
            SukoonSphere.
          </p>
          <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
            <p>
              • Click on the "Create Article" button in your articles dashboard.
            </p>
            <p>• A modal will appear with the article creation form.</p>
            <p>• Write your article and submit it for review.</p>
            <p>... (additional steps can be added here)</p>
          </div>
        </div>

        {/* Additional Features can be added similarly */}
      </div>
    </div>
  );
};

export default UserManual;
