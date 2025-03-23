import { useEffect, useState } from "react";
import { RiHeartFill, RiChat1Fill } from "react-icons/ri";
import SectionTitle from "../sharedComponents/SectionTitle";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import UserAvatar from "../shared/UserAvatar";
import { Link } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

export default function UserPosts() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await customFetch.get(
        "/qa-section/most-answered-question"
      );
      console.log({ response });
      setQuestions(response?.data?.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const QuestionCard = ({ question }) => {
    const { _id, questionText, context, tags, createdAt, author } = question;
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <UserAvatar
            createdBy={author?.userId}
            username={author?.username}
            userAvatar={author?.userAvatar}
            createdAt={createdAt}
          />
          <div className="flex items-center gap-4">
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
              {question?.answers?.length}{" "}
              {question?.answers?.length === 1 ? "Answer" : "Answers"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg md:text-2xl mb-2 font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] transition-colors duration-200">
            {questionText}
          </h3>
          <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">
            {context}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <Link
          to={`/QA-section/question/${_id}`}
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          See answers →
        </Link>
      </div>
    );
  };

  const SkeletonCard = () => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex items-center gap-4">
            <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-12 h-4 rounded-full bg-gray-200 animate-pulse"></div>
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg md:text-2xl mb-2 font-bold text-[var(--grey--900)]">
            <div className="w-2/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          </h3>
          <p className="text-base mb-2 leading-relaxed text-[var(--grey--800)]">
            <div className="w-2/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-1/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-1/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-1/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <div className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
          <div className="w-1/3 h-4 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  };

  const splideOptions = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    pagination: true,
    arrows: false,
    gap: "1rem",

    breakpoints: {
      1024: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1 },
    },
    autoplay: "play",
    interval: 3000,
    speed: 1000,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    rewind: false,
    lazyLoad: "nearby",
    waitForTransition: true,
    updateOnMove: true,
    trimSpace: false,
    wheelMinThreshold: 10,
    wheelSleep: 400,
    preloadPages: 2
  };

  return (
    <section className="max-w-7xl mx-auto p-2">
      <SectionTitle title={"Community questions"} />
      <div>
        <Splide options={splideOptions}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
              <SplideSlide key={index} className="pb-8">
                <SkeletonCard />
              </SplideSlide>
            ))
            : questions?.map((question, index) => (
              <SplideSlide key={`${question?._id}-${index}`} className="pb-8">
                <QuestionCard key={question?._id} question={question} />
              </SplideSlide>
            ))}
        </Splide>
      </div>
    </section>
  );
}
