import { api } from './apiSetup';




export const getUserProfileApi = async (userId) => {
    try {
        const response = await api.get(`/users/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const getCurrentUserProfileApi = async () => {
    try {
        const response = await api.get(`/users/profile`);
        return response.data;
    } catch (error) {
        console.error("Error fetching current user's profile:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const updateUserProfileApi = async (profileData) => {
    try {
        // The backend's updateUserProfile expects fields like username, bio, avatar_url, socials
        const response = await api.put(`/users/profile`, profileData);
        return response.data; // Should return { message: '...', profile: updatedProfileData }
    } catch (error) {
        console.error("Error updating user profile:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const followUserApi = async (followerId) => {
    try {
        const response = await api.post(`/users/follow/${followerId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const unfollowUserApi = async (followerId) => {
    try {
        const response = await api.delete(`/users/unfollow/${followerId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const blockUserApi = async (userIdToBlock) => {
    try {
        const response = await api.post(`/users/block/${userIdToBlock}`);
        return response.data; // { message, block }
    } catch (error) {
        console.error("Error blocking user:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const unblockUserApi = async (userIdToUnblock) => {
    try {
        const response = await api.delete(`/users/unblock/${userIdToUnblock}`); // Assuming DELETE for unblock
        return response.data; // { message }
    } catch (error) {
        console.error("Error unblocking user:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const reportUserApi = async (userIdToReport, reason) => {
    try {
        const response = await api.post(`/users/report/${userIdToReport}`, { reason });
        return response.data; // { message, report }
    } catch (error) {
        console.error("Error reporting user:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};