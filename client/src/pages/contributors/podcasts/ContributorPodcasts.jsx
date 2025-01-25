import React, { useState, useEffect } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { FaMicrophone, FaList, FaChevronDown, FaPlus } from "react-icons/fa";
import CreateNewPodcast from "../models/CreateNewPodcast";
import CreateNewPodcastPlaylist from "../models/CreateNewPodcastPlaylist";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import PodcastPlaylistCard from "@/components/mediaLibrary/podcasts/PodcastPlaylistCard";
import SinglePodcastCard from "@/components/mediaLibrary/podcasts/SinglePodcastCard";

const ContributorPodcasts = () => {
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [singlePodcasts, setSinglePodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { id: ParamId } = useParams();
  const user = useOutletContext();
  const { user: currentUser } = useUser();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [playlistsRes, singlesRes] = await Promise.all([
        customFetch.get(`/podcasts/user/${currentUser._id}/playlists`),
        customFetch.get(`/podcasts/user/${currentUser._id}/singles`),
      ]);
      console.log(playlistsRes, singlesRes);

      setPlaylists(playlistsRes.data.playlists);
      setSinglePodcasts(singlesRes.data.podcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      toast.error("Failed to load podcasts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isContributor =
    user?.role === "contributor" && currentUser?._id === ParamId;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-4 py-8">
      {isContributor && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Podcasts</h2>
            <div>
              <p className="text-[var(--grey--800)]">
                Dont know how to upload a podcast? Check out our{" "}
                <Link
                  to={"/user-manual/create-podcast"}
                  className="text-blue-500 hover:underline"
                >
                  user manual
                </Link>{" "}
                for a step-by-step guide.
              </p>
            </div>
          </div>
          <div className="relative transition-all duration-300">
          <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn-2 flex items-center gap-2"
            >
              Create podcasts
              <FaPlus className="w-5 h-5" />
            </button>
            {showDropdown && (
              <div className="absolute top-10 md:right-0 z-10 bg-white shadow-xl p-2 rounded-lg w-52 ">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowPodcastModal(true);
                  }}
                  className="block w-full text-[.9rem] text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Create Podcast</span>
                  <FaMicrophone className="w-4 h-4 ml-2 inline-block" />
                </button>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowPlaylistModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span>Create Playlist</span>
                  <FaList className="w-4 h-4 ml-2 inline-block" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Playlists Section */}
          {playlists?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Playlists</h3>
              <div className="space-y-4">
                {playlists.map((playlist) => (
                  <PodcastPlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                    isContributor={isContributor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Single Episodes Section */}
          {singlePodcasts?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your podcasts</h3>
              <div className="grid grid-cols-1 gap-4">
                {singlePodcasts.map((podcast) => (
                  <SinglePodcastCard
                    key={podcast._id}
                    podcast={podcast}
                    fetchData={fetchData}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {playlists?.length === 0 && singlePodcasts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No podcasts found. Create your first podcast or playlist!
              </p>
            </div>
          )}
        </div>
      )}

      {showPodcastModal && (
        <CreateNewPodcast
          setShowModal={setShowPodcastModal}
          type="single"
          fetchData={fetchData}
        />
      )}
      {showPlaylistModal && (
        <CreateNewPodcastPlaylist
          setShowModal={setShowPlaylistModal}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default ContributorPodcasts;
