"use server"

import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TCreator, TFollower, TKhaltiResponse} from "@/global/types";
import {v2 as cloudinary} from "cloudinary";
import {getUserFromSession} from "@/global/helper";
import {AxiosError} from "axios";
import {TDonationGoal} from "@/app/(pages)/view-donations/_components/validator";
import {Post} from "@/app/(pages)/manage-posts/action";


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function uploadCreatorBanner(userId: string | number, file: File | null) {
    if (file === null) {
        throw new Error("No file to upload");
    }
    try {

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileStr = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${fileStr}`;

        const response = await cloudinary.uploader.upload(fileUri, {
            folder: `${userId}`,
            filename_override: "banner",
            resource_type: "image",
            overwrite: true,
            transformation: [
                {width: 1200, height: 400, crop: "limit"},
                {quality: "auto"},
            ],
            public_id: `${userId}/banner`,
        });

        return response.secure_url;
    } catch (err) {
        console.log(err);
        throw new Error("Error uploading creator banner");
    }
}

export async function UpdateCreatorDetails(creator: TCreator) {
    try {
        const response = await axiosInstance.put<TCreator>(API_ROUTES.CREATOR.BASE + `/${creator.creatorId}`, {
            ...creator,
            contentTypeId: creator.contentType
        });
        return response.data;
    } catch {

        throw new Error("Error updating creator details");
    }
}

export async function EnrollMembership(membershipId: string | number) {

    const user = await getUserFromSession();

    if (user === null) {
        throw new Error("User should be logged in to enroll");
    }
    try {
        const response = await axiosInstance.post<TKhaltiResponse>(API_ROUTES.MEMBERSHIP.KHALTI.BASE, {
            userId: user.userId,
            membershipId
        });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetEMByUserIdMembershipId(userId: string | number, membershipId: string | number) {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.MEMBERSHIP.ENROLLED.USER}/${userId}/membership/${membershipId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetCreatorByUserName(userName: string) {
    try {
        const response = await axiosInstance.get<TCreator>(API_ROUTES.CREATOR.USERNAME + userName);
        return response.data;
    } catch (e) {
        return null
    }
}

export async function GetPostsByUsername(userName: string) {
    try {
        const response = await axiosInstance.get<Post[]>(`${API_ROUTES.POST.USER}/${userName}`);
        return response.data;
    } catch {


        return []
    }
}

export async function GetCreatorMembershipByCreatorId(creatorId: string | number) {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.MEMBERSHIP.CREATOR.BASE}/${creatorId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetCreatorActiveDonationGoal(creatorId: number) {

    try {
        const response = await axiosInstance.get<TDonationGoal>(`${API_ROUTES.DONATION.GOAL.ACTIVE}/${creatorId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
        throw new Error("Error fetching active donation goal");
    }
}


export async function AddProfileVisit(creatorId: string | number) {
    try {
        const response = await axiosInstance.patch<boolean>(`${API_ROUTES.CREATOR.PROFILE_VISIT}/${creatorId}`);
        return response.data;
    } catch {
        return false;
    }
}

export async function getFollowStatus(creatorId: number): Promise<{ isFollowing: boolean; followerCount: number }> {
    const user = await getUserFromSession();
    if (!user) {
        // If no user, they can't be following. Fetch only count.
        try {
            const countResponse = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`);
            return {isFollowing: false, followerCount: countResponse.data ?? 0};
        } catch (e) {
            console.error("Error fetching follower count (unauthenticated):", e);
            return {isFollowing: false, followerCount: 0}; // Default on error
        }
    }

    try {
        // Fetch both status and count in parallel
        const [statusResponse, countResponse] = await Promise.all([
            axiosInstance.get<boolean>(`${API_ROUTES.CREATOR.IS_FOLLOWING}/${creatorId}/${user.userId}`),
            axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`)
        ]);

        return {
            isFollowing: statusResponse.data ?? false,
            followerCount: countResponse.data ?? 0,
        };
    } catch (error) {
        console.error("Error fetching follow status:", error);
        // Attempt to return default values on error
        // You might want more specific error handling based on which request failed
        let followerCount = 0;
        try {
            // Try fetching count again if status failed
            const countResponse = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`);
            followerCount = countResponse.data ?? 0;
        } catch (countError) {
            console.error("Error fetching follower count (after status error):", countError);
        }
        return {isFollowing: false, followerCount: followerCount};
    }
}

/**
 * Action for the current user to follow a creator.
 */
export async function followCreatorAction(creatorId: number): Promise<{ success: boolean; newFollowerCount?: number }> {
    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User must be logged in to follow.");
    }

    try {
        // Assuming the API returns success status (e.g., 200 OK)
        await axiosInstance.post(`${API_ROUTES.CREATOR.FOLLOW}/${creatorId}/${user.userId}`);

        // After successful follow, fetch the new follower count
        try {
            const countResponse = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`);
            return {success: true, newFollowerCount: countResponse.data};
        } catch (countError) {
            console.error("Follow successful, but failed to fetch new count:", countError);
            return {success: true}; // Return success without count if fetch fails
        }
    } catch (error) {
        console.error("Error following creator:", error);
        // Provide more specific error message if possible
        const message = error instanceof AxiosError ? error.response?.data?.message || error.message : "Failed to follow creator.";
        // Don't throw here, return success: false for the mutation handler
        return {success: false};
        // throw new Error(message); // Or throw if you want the mutation onError to handle it differently
    }
}

/**
 * Action for the current user to unfollow a creator.
 */
export async function unfollowCreatorAction(creatorId: number): Promise<{
    success: boolean;
    newFollowerCount?: number
}> {
    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User must be logged in to unfollow.");
    }

    try {
        // Assuming the API returns success status (e.g., 200 OK or 204 No Content)
        await axiosInstance.delete(`${API_ROUTES.CREATOR.UNFOLLOW}/${creatorId}/${user.userId}`);

        // After successful unfollow, fetch the new follower count
        try {
            const countResponse = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`);
            return {success: true, newFollowerCount: countResponse.data};
        } catch (countError) {
            console.error("Unfollow successful, but failed to fetch new count:", countError);
            return {success: true}; // Return success without count if fetch fails
        }
    } catch (error) {
        console.error("Error unfollowing creator:", error);
        const message = error instanceof AxiosError ? error.response?.data?.message || error.message : "Failed to unfollow creator.";
        return {success: false};
        // throw new Error(message);
    }
}


export async function getFollowers(creatorId: number): Promise<TFollower[]> { // Replace User[] with your actual User type
    try {
        const response = await axiosInstance.get<TFollower[]>(`${API_ROUTES.CREATOR.FOLLOWERS}/${creatorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching followers:", error);
        return [];
    }
}

export async function getFollowingList(userId: number): Promise<TFollower[]> { // Replace Creator[] with your actual Creator type
    try {
        const response = await axiosInstance.get<TFollower[]>(`${API_ROUTES.CREATOR.FOLLOWING}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching following list:", error);
        return [];
    }
}


export async function GetCreatorFollowerCount(creatorId: string | number) {
    try {
        // Decide if this should use USER_ID route or FOLLOWER_COUNT route
        const response = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.FOLLOWER_COUNT}/${creatorId}`);
        // const response = await axiosInstance.get<number>(`${API_ROUTES.CREATOR.USER_ID}${creatorId}/followers`); // Old route?
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            // Consider returning 0 instead of throwing for display purposes
            console.error("Error fetching follower count:", e.response?.data?.message || e.message);
            return 0;
            // throw new Error(e.response?.data.message);
        }
        return 0; // Default to 0 on other errors
    }
}
