import customFetch from "@/utils/customFetch";

export const SingleAnswerOutletloader = async ({ params }) => {
    const { id } = params;
    try {
        const response = await customFetch(`/qa-section/answer/${id}`);
        return { answer: response.data.answer, question: response.data.question };
    } catch (error) {
        console.log(error);
        return { error: error.response.data.msg };
    }
};