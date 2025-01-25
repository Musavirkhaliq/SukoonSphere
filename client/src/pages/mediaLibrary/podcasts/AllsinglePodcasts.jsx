import React, { useState, useEffect } from "react";
import customFetch from "@/utils/customFetch";
import PodcastsGrid from "@/components/mediaLibrary/podcasts/PodcastsGrid";

const AllsinglePodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await customFetch.get("/podcasts/singles");
        console.log({ response });
        setPodcasts(response.data.podcasts || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="mx-auto py-2 min-h-screen">
      <PodcastsGrid podcasts={podcasts} loading={loading} error={error} />
    </div>
  );
};

export default AllsinglePodcasts;
