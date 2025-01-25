import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

export const allPostsLoader = async () => {
    try {
        const { data } = await customFetch.get("/posts");
        return { posts: data.posts };
    } catch (error) {
        toast.error(error?.response?.data?.msg);
        return { posts: [] };
    }
};