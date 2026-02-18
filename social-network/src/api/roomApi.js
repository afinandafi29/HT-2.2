import { initialRooms } from '../data';

const CUSTOM_ROOMS_KEY = 'HAPPYY_CUSTOM_ROOMS';

const getCustomRooms = () => {
    try {
        const saved = localStorage.getItem(CUSTOM_ROOMS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
};

const saveCustomRooms = (rooms) => localStorage.setItem(CUSTOM_ROOMS_KEY, JSON.stringify(rooms));

export const getRoomsApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customRooms = getCustomRooms();
            const now = Date.now();
            // Filter rooms older than 24 hours
            const validCustomRooms = customRooms.filter(r => (now - r.createdAt) < 24 * 60 * 60 * 1000);
            if (validCustomRooms.length !== customRooms.length) saveCustomRooms(validCustomRooms);
            resolve([...validCustomRooms, ...initialRooms]);
        }, 300);
    });
};

export const createRoomApi = async (roomData) => {
    const roomName = `HAPPYY-TALK-${roomData.title.replace(/\s+/g, '-')}-${Date.now()}`;
    const newRoom = {
        ...roomData,
        id: `custom-${Date.now()}`,
        happytalk_room_name: roomName,
        meeting_url: `${window.location.origin}/join/${roomName}`,
        people: [],
        profile: { username: "Me", avatar_url: "/profiles/Adem Lane.webp" },
        createdAt: Date.now()
    };
    const customRooms = getCustomRooms();
    customRooms.unshift(newRoom);
    saveCustomRooms(customRooms);
    return newRoom;
};

export const deleteRoomApi = async (roomId) => {
    if (String(roomId).startsWith('custom-')) {
        const customRooms = getCustomRooms();
        const filtered = customRooms.filter(r => r.id !== roomId);
        saveCustomRooms(filtered);
    } else {
        // For initialRooms, we can't easily delete them permanently in this mock,
        // but we can simulate it for the current session or via localStorage if we wanted to.
        // For now, let's just return success.
    }
    return { success: true };
};

export const setRoomTopicApi = async (roomId, topicData) => {
    return { message: "Topic updated", room: { id: roomId, ...topicData } };
};