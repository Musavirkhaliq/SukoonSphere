import customFetch from "@/utils/customFetch";
export const singleVideosLoader = async () => {
    try {
        const { data } = await customFetch.get("/videos/single-videos");
        return { videos: data.video };
    } catch (error) {
        return { videos: [] };
    }
};