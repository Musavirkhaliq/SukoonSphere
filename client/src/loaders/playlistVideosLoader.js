import customFetch from "@/utils/customFetch";

export const playlistVideosLoader = async () => {
    try {
        const { data } = await customFetch.get("/videos/playlist-videos");
        return { videos: data.video };
    } catch (error) {
       console.log(error);
        return { videos: [] };
    }
};