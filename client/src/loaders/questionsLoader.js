import customFetch from "@/utils/customFetch";

export const questionsLoader = async () => {
    try {
        const { data } = await customFetch.get("/qa-section");
        return { questions: data.questions };
    } catch (error) {
        return {
            error:
                error?.response?.data?.msg ||
                "An error occurred during fetching questions.",
        };
    }
};