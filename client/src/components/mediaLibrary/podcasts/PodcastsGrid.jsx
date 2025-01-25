import React from "react";
import PodcastCard from "./PodcastCard";
import { FaVideo } from "react-icons/fa";

const PodcastsGrid = ({ podcasts, loading, error, isPlayList }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4 flex items-center justify-center col-span-full capitalize">
          laskdjflkasjd{error}
        </div>
      ) : podcasts && podcasts.length > 0 ? (
        podcasts.map((podcast) => (
          <PodcastCard
            key={podcast._id}
            podcast={podcast}
            isPlayList={isPlayList}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 col-span-full py-12">
          <div className="flex flex-col items-center justify-center  rounded-xl p-8 space-y-4 text-center">
            <div className="bg-blue-100 p-6 rounded-full">
              <FaVideo className="w-16 h-16 text-[var(--primary)] animate-pulse" />
            </div>
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
                No Podcasts Found
              </h2>
              <p className="text-[var(--grey--800)] mb-6">
                No podcasts found. This collection is currently empty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastsGrid;
