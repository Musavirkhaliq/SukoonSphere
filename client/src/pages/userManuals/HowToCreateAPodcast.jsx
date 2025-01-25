import React from 'react';
import { FaMicrophone, FaCheckCircle, FaImage } from 'react-icons/fa';

const HowToCreateAPodcast = () => {
  return (
    <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-[var(--primary)] mb-2 flex items-center gap-3">
          <FaMicrophone />
          How to Create a Podcast
        </h1>
        <p className="text-[var(--grey--800)] mb-8">
          Follow this step-by-step guide to create and share your podcasts on SukoonSphere.
        </p>

        {/* Steps Container */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Getting Started
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Click on the "Create Podcast" button in your podcasts dashboard.</p>
              <p>• A modal will appear with the podcast creation form.</p>
              <p>• Choose whether you are creating a playlist or a standalone podcast.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Podcast Details
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Enter a clear and descriptive title for your podcast or the playlist.</p>
              <p>• Write a detailed description explaining what listeners will learn.</p>
              <p>• If creating a playlist, enter the episode number.</p>
            </div>
          </div>

          {/* Step 3 for Playlist */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Creating a Playlist
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• If you chose to create a playlist, you can add multiple episodes.</p>
              <p>• For each episode, fill in the title, description, and upload the audio file.</p>
              <p>• Ensure each episode has a unique episode number.</p>
              <p>• You can also upload a cover image for the playlist.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="bg-[var(--primary)] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              <FaImage />
              Uploading Audio and Cover Image
            </h2>
            <div className="space-y-3 text-xs md:text-base text-[var(--grey--800)]">
              <p>• Upload an audio file for your podcast (Max 50MB).</p>
              <p>• Upload an attractive cover image (Max 5MB).</p>
              <p>• Supported formats: JPG, PNG.</p>
            </div>
          </div>

          {/* Final Step */}
          <div className="bg-green-50 rounded-lg p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
              <FaCheckCircle />
              Publishing Your Podcast
            </h2>
            <div className="space-y-3 text-[var(--grey--800)] text-xs md:text-base">
              <p>• Review all the information you've entered.</p>
              <p>• Click the "Create Podcast" button.</p>
              <p>• Wait for the success message.</p>
              <p>• Your podcast will appear in your podcasts dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToCreateAPodcast;
