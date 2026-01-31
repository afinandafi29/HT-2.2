import { api } from './apiSetup';

export const getCommentsApi = async (postId) => {
    try {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const createCommentApi = async (postId, content) => {
    try {
        const response = await api.post(`/comments/${postId}`, { content });
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

export const deleteCommentApi = async (commentId) => {
    try {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
}; 