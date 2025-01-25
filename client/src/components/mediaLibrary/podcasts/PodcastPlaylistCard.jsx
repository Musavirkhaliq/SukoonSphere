import React, { useState } from "react";
import {
  FaPlay,
  FaPlus,
  FaEllipsisV,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import CreateNewPodcast from "../../../pages/contributors/models/CreateNewPodcast";
import EditPodcastModel from "../../../pages/contributors/models/EditPodcastModel";
import EditPodcastPlaylistModel from "../../../pages/contributors/models/EditPodcastPlaylistModel";
import DeleteModal from "@/components/shared/DeleteModal";
import PostActions from "@/components/shared/PostActions";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

const PodcastPlaylistCard = ({ playlist, isContributor, fetchData }) => {
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const handleDelete = (episode) => {
    setSelectedEpisode(episode);
    setShowDeleteModal(true);
  };

  const handleEdit = (episode) => {
    setSelectedEpisode(episode);
    setShowEditModal(true);
  };

  const deleteEpisode = async () => {
    try {
      await customFetch.delete(`/podcasts/${selectedEpisode._id}`);
      toast.success("Episode deleted successfully");
      setShowDeleteModal(false);
      setSelectedEpisode(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast.error(error?.response?.data?.msg || "Error deleting episode");
    }
  };

  const deletePlaylist = async () => {
    try {
      await customFetch.delete(`/podcasts/playlist/${playlist._id}`);
      toast.success("Playlist deleted successfully");
      setShowDeleteModal(false);
      if (fetchData) await fetchData();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error?.response?.data?.msg || "Error deleting playlist");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full mb-6 ">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row p-4  md:p-6 space-y-2 md:space-y-0 md:space-x-8">
          {/* Left side - Image */}
          <div className="flex-shrink-0 self-start md:self-center">
            <div className="relative group w-full md:w-72 h-52 md:h-[220px] overflow-hidden rounded-xl shadow-md">
              <img
                src={playlist.imageUrl}
                alt={playlist.title}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-grow flex flex-col justify-between w-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow pr-4">
                  <Link to={`/podcasts/playlist/${playlist._id}`}>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                      {playlist.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">
                    {playlist.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {playlist.episodes.length}{" "}
                      {playlist.episodes.length <= 1 ? "Episode" : "Episodes"}
                    </span>
                  </div>
                </div>

                {isContributor && (
                  <div className="relative group">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <FaEllipsisV className="w-5 h-5" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg z-10 py-2 animate-fade-in">
                        <button
                          onClick={() => setShowAddEpisodeModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full transition-colors"
                        >
                          <FaPlus className="w-5 h-5 text-blue-600" />
                          Add Episode
                        </button>
                        <button
                          onClick={() => setShowEditPlaylistModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full transition-colors"
                        >
                          <FaPencilAlt className="w-5 h-5 text-blue-600" />
                          Edit Playlist
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedEpisode(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
                        >
                          <FaTrash className="w-5 h-5 text-red-600" />
                          Delete Playlist
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Episode List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4 md:p-6">
          {playlist?.episodes?.map((episode, index) => (
            <div
              key={episode._id}
              className="flex items-center justify-between bg-white border border-gray-100 py-2 px-4 rounded-lg hover:ring-2 hover:ring-gray-100 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 w-full">
                <span className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-gray-800 truncate max-w-full">
                    {episode.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Episode {episode.episodeNo}
                  </p>
                </div>
                {isContributor && (
                  <div className="flex-shrink-0 z-50">
                    <PostActions
                      handleEdit={() => handleEdit(episode)}
                      handleDelete={() => handleDelete(episode)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Episode Modal */}
      {showAddEpisodeModal && (
        <CreateNewPodcast
          setShowModal={setShowAddEpisodeModal}
          type="playlist"
          playlistId={playlist._id}
          fetchData={fetchData}
        />
      )}

      {/* Edit Playlist Modal */}
      {showEditPlaylistModal && (
        <EditPodcastPlaylistModel
          setShowModal={setShowEditPlaylistModal}
          playlist={playlist}
          fetchData={fetchData}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title={selectedEpisode ? "Delete Episode" : "Delete Playlist"}
        message={
          selectedEpisode
            ? `Are you sure you want to delete "${selectedEpisode.title}"? This action cannot be undone.`
            : `Are you sure you want to delete "${playlist.title}" and all its episodes? This action cannot be undone.`
        }
        onDelete={selectedEpisode ? deleteEpisode : deletePlaylist}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEpisode(null);
        }}
      />

      {/* Edit Episode Modal */}
      {showEditModal && selectedEpisode && (
        <EditPodcastModel
          setShowModal={setShowEditModal}
          podcast={selectedEpisode}
          type="playlist"
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default PodcastPlaylistCard;
