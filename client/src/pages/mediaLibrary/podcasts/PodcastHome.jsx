import { NavLink } from "react-router-dom";
import React from "react";
import { Outlet } from "react-router-dom";
import { FaVideo, FaList } from "react-icons/fa";
import { PageIntro } from "@/components";

const PodcastHome = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      <div className="rounded-lg">
        <PageIntro
          title={"Podcasts"}
          description={`Explore our collection of healing and mindfulness podcasts. Listen
              to our podcasts and learn from mental health experts, and gain
              insights on how to live a happier and healthier life.`}
        />
        <div className="border-b border-gray-200">
          <nav className="flex sm:w-1/3 md:w-1/4 justify-center">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200`
              }
            >
              <FaVideo className="inline-block mr-2 -mt-1" />
              Podcasts
            </NavLink>
            <NavLink
              to="/podcasts/playlists"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } w-1/2 py-2 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200`
              }
            >
              <FaList className="inline-block mr-2 -mt-1 " />
              Playlists
            </NavLink>
          </nav>
        </div>

        <div className="p-0 mt-2  md:mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PodcastHome;
