import { Quizzes } from "@/utils/Quizzes";

// Loader function
export const QuizDetailsLoader = async ({ params }) => {
    const category = Quizzes[0].quizCategories[0];
    const quiz = category.quizzes.find(q => q.quizId === Number(params.id));

    if (quiz) {
        const quizDetails = quiz.quizDetails ? quiz.quizDetails[0] : {};
        const quizQuestions = quiz.quizQuestions || [];
        return { quiz, quizDetails, quizQuestions };
    }
    return { quiz: null, quizDetails: null };
};