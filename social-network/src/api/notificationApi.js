import { api } from './apiSetup';

export const getNotificationsApi = async () => {
    const response = await api.get(`/notifications`);
    return response.data;
};

export const markAsReadApi = async (notificationId) => {
    const response = await api.post(`/notifications/read/${notificationId}`);
    return response.data;
};
