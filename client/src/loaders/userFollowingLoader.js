import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
export const userFollowingLoader = async ({ params }) => {
    let loading = true;
    try {
        const { data } = await customFetch.get(`/user/following/${params.id}`);
        loading=false
        return {loading,...data};
    } catch (error) {
        console.error("Error fetching following:", error);
        toast.error(error.response?.data?.msg || "Error fetching following");
          loading=false
        return {loading, success: false, following: [] };
    }
};