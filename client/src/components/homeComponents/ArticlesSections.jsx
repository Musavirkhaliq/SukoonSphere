import SectionTitle from "../sharedComponents/SectionTitle";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { ArticleCard } from "@/components";
import { useEffect, useState } from "react";
import customFetch from "@/utils/customFetch";

// Skeleton Article Card Component
const SkeletonArticleCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full h-72 animate-pulse">
      {/* Skeleton for image/thumbnail (if present) */}
      <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
      {/* Skeleton for title */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      {/* Skeleton for content snippet */}
      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      {/* Skeleton for author and engagement */}
      <div className="flex justify-between mt-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default function ArticleCards() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMostLikedArticles = async () => {
    try {
      setLoading(true);
      const response = await customFetch.get("/articles/most-liked");
      setArticles(response?.data?.articles || []);
    } catch (error) {
      console.error("Error fetching most liked articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostLikedArticles();
  }, []);

  const splideOptions = {
    type: "loop",
    perPage: 4,
    perMove: 1,
    autoplay: true,
    interval: 3000,
    pauseOnHover: true,
    arrows: false,
    pagination: true,
    gap: "1.5rem",
    breakpoints: {
      1200: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
  };

  return (
    <section className="max-w-7xl mx-auto p-2">
      <SectionTitle title={"Articles"} />
      <div className="mt-6">
        <Splide options={splideOptions}>
          {loading
            ? // Show skeleton cards while loading
              Array.from({ length: 4 }).map((_, index) => (
                <SplideSlide key={`skeleton-${index}`} className="pb-8">
                  <SkeletonArticleCard />
                </SplideSlide>
              ))
            : // Show real article cards when loaded
              articles.map((article, index) => (
                <SplideSlide key={article._id} className="pb-8">
                  <ArticleCard article={article} index={index} />
                </SplideSlide>
              ))}
        </Splide>
      </div>
    </section>
  );
}
