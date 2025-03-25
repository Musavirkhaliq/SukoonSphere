import React, { useState, useEffect } from 'react';

const QuizWithPopup = () => {
    const [showQuiz, setShowQuiz] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasDismissedPopup, setHasDismissedPopup] = useState(false);
    const [showResults, setShowResults] = useState(false); // New state for results dialog
    const [quizAnswers, setQuizAnswers] = useState([]); // Store answers from quiz

    const sampleQuizQuestions = [
        {
            question:
                "How do you feel when someone close to you starts to spend less time with you and more time with someone else?",
            option1:
                "I worry that they might drift away from me, and it makes me feel anxious.",
            option2:
                "I feel a bit left out but understand that relationships evolve.",
            option3:
                "It doesn't bother me much; I value our time together when it happens.",
            option4: "I feel hurt and wonder if I did something wrong.",
        },
        {
            question:
                "When someone you care about seems distant, how do you usually respond?",
            option1:
                "I try to reach out and make more effort to reconnect with them.",
            option2: "I give them space and wait for them to come back around.",
            option3:
                "I feel insecure and often question what I might have done wrong.",
            option4: "I adapt easily and don't let it affect my mood much.",
        },
        {
            question:
                "How do you react if your partner begins spending significant time with new friends?",
            option1: "I feel jealous and insecure about our relationship.",
            option2:
                "I understand that they need social interaction and feel okay with it.",
            option3:
                "I try to communicate my feelings and seek reassurance from them.",
            option4:
                "I appreciate the independence and find it gives me time for my own interests.",
        },
        {
            question:
                "What are your thoughts when a family member starts prioritizing others over you?",
            option1:
                "I feel neglected and may become anxious about our relationship.",
            option2:
                "I feel okay and respect their need for balance in their relationships.",
            option3:
                "I feel hurt and try to discuss it with them to understand their perspective.",
            option4: "I feel fine and use the time to focus on my own activities.",
        },
        {
            question:
                "How do you usually feel when a close person doesn't respond to your messages promptly?",
            option1: "I feel anxious and start to worry if something is wrong.",
            option2:
                "I understand that they may be busy and try not to overthink it.",
            option3: "I feel frustrated and may follow up with another message.",
            option4: "I feel indifferent and continue with my day as usual.",
        },
    ];

    useEffect(() => {
        const dismissed = localStorage.getItem('quizPopupDismissed') === 'true';
        if (dismissed) {
            setHasDismissedPopup(true);
            return;
        }

        const timer = setTimeout(() => {
            if (!hasDismissedPopup) setShowPopup(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, [hasDismissedPopup]);

    const handleYes = () => {
        setShowPopup(false);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowQuiz(true);
        }, 1000);
    };

    const handleNo = () => {
        setShowPopup(false);
        setHasDismissedPopup(true);
        localStorage.setItem('quizPopupDismissed', 'true');
    };

    const handleQuit = () => {
        setShowQuiz(false);
    };

    const handleQuizCompleted = (answers) => {
        setShowQuiz(false); // Hide quiz modal
        setQuizAnswers(answers); // Store answers
        setShowResults(true); // Show results dialog
    };

    const handleCloseResults = () => {
        setShowResults(false); // Allow manual closing of results
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            {showPopup && !hasDismissedPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Quiz Time!</h2>
                        <p className="mb-6">Would you like to attempt a quiz?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleNo}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                No, thanks
                            </button>
                            <button
                                onClick={handleYes}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Yes, start quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-lg">Preparing your quiz...</p>
                        </div>
                    </div>
                </div>
            )}

            {showQuiz && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[var(--body)] p-6 rounded-lg shadow-lg max-w-2xl w-full">
                        <QuizQuestions
                            quizQuestions={sampleQuizQuestions}
                            onQuit={handleQuit}
                            onCompleted={handleQuizCompleted}
                        />
                    </div>
                </div>
            )}

            {showResults && (
                <QuizSubmissionDialog answers={quizAnswers} onClose={handleCloseResults} />
            )}
        </div>
    );
};

const QuizQuestions = ({ quizQuestions, onQuit, onCompleted }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);

    const handleAnswerSelect = (option) => {
        const newAnswer = {
            question: quizQuestions[currentQuestionIndex].question,
            selectedOption: option,
        };
        const updatedAnswers = [...answers, newAnswer];
        setAnswers(updatedAnswers);
        setSelectedAnswer(option);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            }, 500);
        } else {
            onCompleted(updatedAnswers); // Pass answers to parent on completion
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={onQuit}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-4 top-2 sm:top-4 hover:bg-red-100 hover:text-red-500 transition-all duration-300"
            >
                ✕
            </button>
            <h2 className="text-xl font-bold">
                Question {currentQuestionIndex + 1}/{quizQuestions.length}
            </h2>
            <p>{quizQuestions[currentQuestionIndex].question}</p>
            <div className="space-y-2">
                {[1, 2, 3, 4].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleAnswerSelect(quizQuestions[currentQuestionIndex][`option${num}`])}
                        className={`w-full p-2 rounded-lg ${selectedAnswer === quizQuestions[currentQuestionIndex][`option${num}`]
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                            }`}
                    >
                        {quizQuestions[currentQuestionIndex][`option${num}`]}
                    </button>
                ))}
            </div>
        </div>
    );
};

function QuizSubmissionDialog({ answers, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="modal-box w-11/12 max-w-5xl p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-4 top-2 sm:top-4 hover:bg-red-100 hover:text-red-500 transition-all duration-300"
                >
                    ✕
                </button>
                <div className="header text-center">
                    <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">
                        🎉 Quiz Completed! 🎉
                    </h2>
                    <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">
                        Your style: <span className="font-semibold">Anxious</span>
                    </h2>
                </div>
                <p className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">
                    Here are your selected answers:
                </p>
                <ul className="space-y-2 sm:space-y-3 max-h-[50vh] overflow-y-auto pr-2 sm:pr-4">
                    {answers.map((answer, index) => (
                        <li key={index} className="bg-white p-1 sm:p-2 rounded-xl shadow-md">
                            <strong className="block text-lg sm:text-xl mb-1 sm:mb-2">
                                Question {index + 1}:
                            </strong>
                            <h4 className="mb-1 sm:mb-2 text-base sm:text-lg">{answer.question}</h4>
                            <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                                <strong className="text-gray-700 sm:mr-2">Your Answer:</strong>
                                <span className="text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm sm:text-base w-fit">
                                    {answer.selectedOption}
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default QuizWithPopup;