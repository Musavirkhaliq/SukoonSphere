import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { FiPlus } from "react-icons/fi";
import CreateVideoModel from "../models/CreateVideoModel";
import ContributorVideoCard from "@/components/mediaLibrary/videos/ContributorVideoCard";
import customFetch from "@/utils/customFetch";
import { FaPlus } from "react-icons/fa";

const Videos = () => {
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id: ParamId } = useParams();
  const user = useOutletContext();
  const { user: currentUser } = useUser();

  const getUploadedVideos = async () => {
    try {
      setLoading(true);
      const { data } = await customFetch.get(`/videos/user-videos`);
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching uploaded videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUploadedVideos();
  }, []);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-4 py-8">
      {user?.role === "contributor" && currentUser?._id === ParamId && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Videos</h2>
            <p className="text-[var(--grey--800)]">
              Dont know how to upload a video? Check out our{" "}
              <Link
                to={"/user-manual/create-video"}
                className="text-blue-500 hover:underline"
              >
                user manual
              </Link>{" "}
              for a step-by-step guide.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-2 flex items-center gap-2"
          >
            Create Video
            <FaPlus className="w-5 h-5" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No videos found. Create your first video!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <ContributorVideoCard
              key={video._id}
              video={video}
              refetchVideos={getUploadedVideos}
            />
          ))}
        </div>
      )}

      {showModal && <CreateVideoModel setShowModal={setShowModal} />}
    </div>
  );
};

export default Videos;
