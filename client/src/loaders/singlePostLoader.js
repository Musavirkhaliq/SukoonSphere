import customFetch from "@/utils/customFetch";

export const singlePostLoader = async ({ params }) => {
    const { id } = params;
    try {
        const { data } = await customFetch.get(`/posts/${id}`);
        return data;
    } catch (error) {
        console.log(error);
        return {
            error: error?.response?.data?.msg || "Failed to load post",
        };
    }
};