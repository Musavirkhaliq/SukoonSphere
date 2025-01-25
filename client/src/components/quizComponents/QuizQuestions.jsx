import React, { useState, useEffect } from 'react';
import QuizSubmissionDialog from '../quizPageComponents/QuizSubmissionDialog';
import "../../assets/styles/global.css"

const QuizQuestions = ({ quizQuestionsList }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [disableSelection, setDisableSelection] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    // Retrieve the current question from the list
    const currentQuestion = quizQuestionsList[currentQuestionIndex] || {};
    const { question = '', option1 = '', option2 = '', option3 = '', option4 = '' } = currentQuestion;

    const handleOptionClick = (event, optionText) => {
        if (!disableSelection) {
            handleAnswer(event, optionText);
        }
    };

    const getOptionClasses = (optionText) => {
        return selectedAnswer === optionText
            ? 'bg-green-300 border-green-400'
            : '';
    };

    useEffect(() => {
        if (isQuizCompleted) {
            document.getElementById('my_modal_3').showModal();
        }
    }, [isQuizCompleted]);

    const handleAnswer = (event, optionText) => {
        setSelectedAnswer(optionText);
        setDisableSelection(true);

        setAnswers((prevAnswers) => [...prevAnswers, { question, selectedOption: optionText }]);
        if (currentQuestionIndex < quizQuestionsList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setDisableSelection(false);
        } else {
            // console.log('Quiz Completed');
            setIsQuizCompleted(true);
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
        }
    };

    const resetToDefault = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setDisableSelection(false);
        setIsQuizCompleted(false);
        setAnswers([]);
    }


    useEffect(() => {
        resetToDefault()
    }, [quizQuestionsList]);

    return (
        <>
            <div className='space-y-2  '>
                <div className='bg-[var(--primary)] rounded-t-[20px] p-4 '>
                    <div className="flex justify-between items-center ">
                        <h1 className="text-2xl font-bold text-[var(--white-color)]">Question {currentQuestionIndex + 1}</h1>
                        <div className="bg-[var(--btn-primary)] text-white px-4 py-2 rounded-full text-sm">
                            {currentQuestionIndex + 1}/{quizQuestionsList.length}
                        </div>
                    </div>
                    <hr className="border-gray-300 mt-4" />
                    <div>
                        <h3 className=" text-base md:text-lg  text-[--white-color] my-2">{question}</h3>
                    </div>
                </div>


                <ul className="space-y-2 rounded-xl p-2 ">
                    {[option1, option2, option3, option4].map((option, index) => (
                        <li
                            key={index}
                            onClick={(event) => handleOptionClick(event, option)}
                            className={`p-2 bg-[var(--body)] rounded-lg text-black cursor-pointer hover:border-[var(--primary)] hover:border-l-4 hover:glossy-effect-bar transition-all duration-200 ease-in-out ${getOptionClasses(option)}`}
                        // data-aos="fade-up"
                        // data-aos-duration="1500"
                        >
                            {option}
                        </li>
                    ))}
                </ul>

            </div>
            <QuizSubmissionDialog answers={answers} />
        </>
    );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(QuizQuestions);
