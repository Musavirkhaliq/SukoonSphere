import customFetch from "@/utils/customFetch";

export const boardMembersLoader = async () => {
    try {
        const { data } = await customFetch.get("/user/all-contributors");
        return { posts: data.contributors };
    } catch (error) {
        toast.error(error?.response?.data?.msg);
        return { posts: [] };
    }
};