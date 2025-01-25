import React from 'react';
import { Link } from 'react-router-dom';
const recentQuizzesTitles = [
  {
    quizId: 2,
    title: "How Empathic are you?",
    imgSrc: "https://via.placeholder.com/50/000000/FFFFFF/?text=A",
  },
  {
    quizId: 3,
    title: "What is your communication style?",
    imgSrc: "https://via.placeholder.com/50/000000/FFFFFF/?text=B",
  },
  {
    quizId: 4,
    title: "Discover your stress management style?",
    imgSrc: "https://via.placeholder.com/50/000000/FFFFFF/?text=C",
  }, {
    quizId: 1,
    title: "What is your attachment style?",
    imgSrc: "https://via.placeholder.com/50/000000/FFFFFF/?text=D",
  },
];

function QuizItem({ title, imgSrc }) {
  return (

    <div
      className="flex items-center py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 rounded-[8px]  "
    >
      <img src={imgSrc} alt={title} className="w-12 h-12 mr-4 rounded-r-[8px]" />
      <h3 className="text-lg font-semibold text-[#364663] hover:text-[var(--ternery)]">{title}</h3>
    </div>
  );
}

function QuizList() {

  return (
    <div className="w-full max-w-sm mx-auto">
      <div>
        {recentQuizzesTitles.map((quiz, index) => (
          <Link to={`/all-quizzes/quiz/${quiz.quizId}`}>
            <QuizItem
              key={index}
              title={quiz.title}
              imgSrc={quiz.imgSrc}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
