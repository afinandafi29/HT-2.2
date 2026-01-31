import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with interceptor for auth
const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('sb-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendMessageApi = async (receiverId, content) => {
    const response = await apiClient.post('/chat/send', { receiver_id: receiverId, content });
    return response.data;
};

export const getMessagesApi = async (userId) => {
    const response = await apiClient.get(`/chat/messages/${userId}`);
    return response.data;
};

export const getConversationsApi = async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
};

export const deleteMessageApi = async (messageId, forEveryone = false) => {
    const response = await apiClient.delete(`/chat/message/${messageId}`, { data: { forEveryone } });
    return response.data;
};
