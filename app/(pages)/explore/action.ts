import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {Post} from "@/app/(pages)/manage-posts/action";

export default async function GetTopPosts() {
    try {
        const response = await axiosInstance.get<Post[]>(API_ROUTES.POST.TOP)
        return response.data;
    } catch (error) {
        console.error("Error fetching top posts:", error);
        return [] as Post[];
    }
}