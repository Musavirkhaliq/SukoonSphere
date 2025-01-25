import React from "react";
import { FaCalendar, FaDownload, FaPlay } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const PodcastCard = ({ podcast, isPlayList }) => {
  const navigate = useNavigate();

  return (
    <Link
      to={`/podcasts/episode/${podcast._id}`}
      key={podcast._id}
      style={{
        backgroundImage: `url(${podcast.imageUrl || "/default-podcast-image.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative text-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Overlay for additional styling */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-xl overflow-hidden "></div>

      <div className="relative group w-52 h-40 my-10 mx-auto shadow-2xl bg-white rounded-lg overflow-hidden">
        <img
          src={podcast.imageUrl || "/default-podcast-image.jpg"}
          alt={podcast.title}
          className="absolute z-20 top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 relative ">
        <h2 className="text-xl font-bold mb-2 text-white line-clamp-2 h-14">
          {podcast.title}
        </h2>

        {isPlayList && <span>episode no {podcast.episodeNo}</span>}
        {/* <p className="text-[var(--grey--400)] line-clamp-1 text-sm">
          {podcast.description || "No description available"}
        </p> */}
        <div className=" ">
          <div className="flex items-center gap-2 ">
            <FaCalendar size={16} className= "text-[var(--grey--400)]" />
            <p className="text-[var(--grey--400)] text-sm mt-2">
              {podcast.createdAt.split("T")[0]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Link
              to={`/podcasts/episode/${podcast._id}`}
              className="flex items-center gap-2 backdrop-blur-sm  bg-white/50 px-4 py-2 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group hover:underline"
            >
              <span className="group-hover:text-[var(--primary)]">
                {" "}
                Listen Now
              </span>
              <FaPlay className="text-white group-hover:text-[var(--primary)]" />
            </Link>
            <div>
              <button
                onClick={() => {
                  // Add functionality to download the podcast
                  window.location.href = podcast.audioUrl;
                }}
                className="backdrop-blur-md  bg-white/40 p-2 rounded-full shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <FaDownload className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
