import React from "react";
import QuizQuestions from "@/components/quizComponents/QuizQuestions";
import QuizList from "@/components/quizPageComponents/QuizList";
import QuizSummary from "@/components/quizPageComponents/QuizSummary";
import { useLoaderData } from "react-router-dom";

function Quiz() {
  const { quiz, quizDetails, quizQuestions } = useLoaderData();
  return (
    <>
      <div className="max-w-full mx-auto px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
          {/* Sidebar */}
          <div
            className="hidden lg:flex lg:col-span-3 bg-slate-100 p-4 flex-col gap-8 rounded-xl lg:sticky lg:top-20 order-1 lg:order-3"
            style={{ height: "max-content" }}
          >
            <h3 className="text-lg font-bold text-gray-900 text-center">
              Related Quizzes
            </h3>
            <QuizList />
          </div>

          {/* Quiz Questions Section */}
          <div className="lg:col-span-3 lg:sticky top-20 h-[500px] grid gap-6 rounded-[20px] bg-[var(--white-color)] order-2  lg:mt-0">
            <div>
              <QuizQuestions quizQuestionsList={quizQuestions} />
            </div>
          </div>

          {/* Quiz Summary Section */}
          <div className="lg:col-span-6 grid gap-6 rounded lg:sticky lg:top-20 order-3 lg:order-2 ">
            <QuizSummary data={quizDetails} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Quiz;
