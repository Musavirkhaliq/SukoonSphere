import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

/**
 * Loader for user followers.
 * The loading state is returned as a property of the result object.
 * You can use it in your component like this:
 * const { loading, followers } = useLoaderData();
 * if (loading) return <div>Loading...</div>;
 */
export const userFollowersLoader = async ({ params }) => {
    let loading = true;
    try {
        const { data } = await customFetch.get(`/user/followers/${params.id}`);
        loading = false;
        return { loading, ...data };
    } catch (error) {
        console.error("Error fetching followers:", error);
        toast.error(error.response?.data?.msg || "Error fetching followers");
        loading = false;
        return { loading, success: false, followers: [] };
    }
};