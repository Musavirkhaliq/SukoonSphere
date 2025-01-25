import { Quizzes } from "@/utils/Quizzes";

export const AllQuizzesLoader = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    const {
        category: selectedCategory = "",
    } = searchParams;
    let filteredQuizzes = JSON.parse(JSON.stringify(Quizzes[0].quizCategories));
    if (selectedCategory) {
        filteredQuizzes = filteredQuizzes.filter((category) =>
            category.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );
    }
    const allCategories = Quizzes[0].quizCategories.map(category => category.category);
    return { data: filteredQuizzes, allCategories };
};