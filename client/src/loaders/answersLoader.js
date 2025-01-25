import customFetch from "@/utils/customFetch";

export const answersLoader = async () => {
    try {
        const { data } = await customFetch.get("/qa-section/all-questions");
        return { allQuestions: data.questions };
    } catch (error) {
        console.log(error);
        return { error: error?.response?.data?.msg || "Could not fetch answers." };
    }
    return null;
};