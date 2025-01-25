import customFetch from "@/utils/customFetch";

export const homeLoader = async () => {
    try {
        const { data } = await customFetch.get("/user/get-most-liked-content");
        return data.data;
    } catch (error) {
        console.log(error);
        return { error: error?.response?.data?.msg || "Could not fetch answers." };
    }
    return null;
};