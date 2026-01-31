import { api } from './apiSetup';

export const sendFriendRequestApi = async (receiverId) => {
    const response = await api.post(`/friends/request/${receiverId}`);
    return response.data;
};

export const acceptFriendRequestApi = async (requestId) => {
    const response = await api.post(`/friends/accept/${requestId}`);
    return response.data;
};

export const rejectFriendRequestApi = async (requestId) => {
    const response = await api.post(`/friends/reject/${requestId}`);
    return response.data;
};

export const unfriendUserApi = async (targetUserId) => {
    const response = await api.delete(`/friends/unfriend/${targetUserId}`);
    return response.data;
};

export const getFriendsApi = async () => {
    const response = await api.get(`/friends/list`);
    return response.data;
};

export const getPendingRequestsApi = async () => {
    const response = await api.get(`/friends/pending`);
    return response.data;
};
