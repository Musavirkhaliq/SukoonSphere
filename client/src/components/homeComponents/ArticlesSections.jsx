import SectionTitle from "../sharedComponents/SectionTitle";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { ArticleCard } from "@/components";
import { useEffect, useState } from "react";

export default function ArticleCards() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const articles = [
    {
      _id: "1a2b3c4d5e",
      title: "The Power of Positive Thinking: Boosting Mental Well-being",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      likes: [1, 2, 3, 4, 5, 6],
      comments: [
        { id: "c1", text: "Great article!", author: "Alice" },
        { id: "c2", text: "Really helpful tips.", author: "Bob" }
      ],
      authorName: "Dr. Jane Smith",
      authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      createdAt: "2025-03-18T10:15:30Z"
    },
    {
      _id: "2f3g4h5i6j",
      title: "Managing Stress in the Workplace: Tips for a Healthier Mind",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
      likes: [1, 2, 3],
      comments: [
        { id: "c3", text: "Very useful advice!", author: "Charlie" }
      ],
      authorName: "Dr. Robert Johnson",
      authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      createdAt: "2025-03-15T08:20:10Z"
    },
    {
      _id: "3k4l5m6n7o",
      title: "The Connection Between Sleep and Mental Health",
      imageUrl: "https://images.unsplash.com/photo-1516822003754-cca485356ecb",
      likes: [1, 2, 3, 4, 5, 6, 7, 8],
      comments: [
        { id: "c4", text: "I need to work on my sleep schedule!", author: "Dana" }
      ],
      authorName: "Dr. Emily Carter",
      authorAvatar: "https://randomuser.me/api/portraits/women/50.jpg",
      createdAt: "2025-03-12T14:45:22Z"
    },
    {
      _id: "4p5q6r7s8t",
      title: "Mindful Breathing: A Simple Yet Powerful Practice",
      imageUrl: "https://images.unsplash.com/photo-1535378620163-557a7c1c0f87",
      likes: [1, 2],
      comments: [
        { id: "c5", text: "This practice has changed my life!", author: "Eve" }
      ],
      authorName: "Dr. Michael Lee",
      authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      createdAt: "2025-03-10T09:30:00Z"
    }
  ];

  const splideOptions = {
    type: 'loop',
    perPage: 4,
    perMove: 1,
    autoplay: true,
    interval: 3000,
    pauseOnHover: false,
    arrows: false,
    pagination: true,
    gap: '1.5rem',
    breakpoints: {
      1200: {
        perPage: 3,
      },
      768: {
        perPage: 2,
      },
      640: {
        perPage: 1,
      }
    }
  };

  return (
    <section className="space-y-6 px-4 md:px-8 py-8">
      <SectionTitle title={"Articles"} />
      <div className="mt-6">
        <Splide options={splideOptions}>
          {articles.map((article, index) => (
            <SplideSlide key={article._id}>
              <ArticleCard article={article} index={index} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}
