import { FilterQuizByCatagory, PageIntro, QuizList } from "@/components";
import React from "react";
import { useLoaderData } from "react-router-dom";

function AllQuizzes() {
  const { data: quizCategories, allCategories } = useLoaderData();
  return (
    <>
      {/* <HeaderImg currentPage="All Quizzes" bgImg={bgImg} /> */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 space-y-6 ">
        <PageIntro
          title={"Quizzes"}
          description={
            "A quiz can't tell you everything you need to know about yourself, but it can help provide insight into some of your personality traits, behaviors, and how you view and respond to the world around you. If you're curious about a particular aspect of your personality or something that's going on in your life and relationships, try out one of our quizzes below to find out more about what your thoughts and feelings may say about you."
          }
        />
        <FilterQuizByCatagory categories={quizCategories} />
        <QuizList quizCategories={quizCategories} />
      </div>
    </>
  );
}

export default AllQuizzes;
