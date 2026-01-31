import { api } from './apiSetup';



export const createPostApi = async (postData) => {
    try {
        const response = await api.post(`/posts`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPostsApi = async (userId = null) => { // Add userId param
    try {
        const params = { };
        if (userId) {
            params.userId = userId;
        }
        const response = await api.get(`/posts`, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPostByIdApi = async (postId) => {
    try {
        const response = await api.get(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePostApi = async (postId, postData) => {
    try {
        const response = await api.put(`/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deletePostApi = async (postId) => {
    try {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const toggleLikePostApi = async (postId) => {
    try {
        const response = await api.post(`/posts/like/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const reportPostApi = async (postIdToReport, reason) => {
    try {
        const response = await api.post(`/posts/report/${postIdToReport}`, { reason });
        return response.data; // { message, report }
    } catch (error) {
        console.error("Error reporting post:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};
