import { api } from './apiSetup';


export const getJitsiTokenApi = async (roomName) => {
    try {
        const response = await api.get(`/jitsi/getToken/${roomName}`);
        return response?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const leaveRoomApi = async (roomName) => {
    try {
        const response = await api.post(`/jitsi/leave/${roomName}`);
        return response?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const kickUserApi = async (roomName, userId) => {
    try {
        const response = await api.post(`/jitsi/kick/${roomName}/${userId}`);
        return response?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};