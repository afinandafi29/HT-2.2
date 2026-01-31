/**
 * Guest Room Manager
 * Handles temporary room creation for guest users
 * Rooms auto-delete after 15 minutes of inactivity
 */

const GUEST_ROOMS_KEY = 'happytalk_guest_rooms';
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Get all guest rooms from localStorage
 */
export const getGuestRooms = () => {
    try {
        const rooms = localStorage.getItem(GUEST_ROOMS_KEY);
        return rooms ? JSON.parse(rooms) : [];
    } catch (error) {
        console.error('Error reading guest rooms:', error);
        return [];
    }
};

/**
 * Save guest rooms to localStorage
 */
const saveGuestRooms = (rooms) => {
    try {
        localStorage.setItem(GUEST_ROOMS_KEY, JSON.stringify(rooms));
    } catch (error) {
        console.error('Error saving guest rooms:', error);
    }
};

/**
 * Create a new guest room
 */
export const createGuestRoom = (roomData) => {
    const rooms = getGuestRooms();

    const newRoom = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: roomData.title,
        topic: roomData.topic || roomData.language,
        language: roomData.language || 'English',
        max_capacity: roomData.max_capacity || 0,
        mirotalk_room_name: `guest-room-${Date.now()}`,
        meeting_url: null, // Will use local MiroTalk
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        participants: 0,
        is_guest_room: true,
        profile: {
            username: 'Guest',
            avatar_url: '/profiles/default-avatar.png'
        },
        people: []
    };

    rooms.push(newRoom);
    saveGuestRooms(rooms);

    return newRoom;
};

/**
 * Update room activity (when someone joins/leaves)
 */
export const updateRoomActivity = (roomId, participantCount) => {
    const rooms = getGuestRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);

    if (roomIndex !== -1) {
        rooms[roomIndex].last_activity = new Date().toISOString();
        rooms[roomIndex].participants = participantCount;
        saveGuestRooms(rooms);
    }
};

/**
 * Delete a guest room
 */
export const deleteGuestRoom = (roomId) => {
    const rooms = getGuestRooms();
    const filteredRooms = rooms.filter(r => r.id !== roomId);
    saveGuestRooms(filteredRooms);
};

/**
 * Clean up inactive rooms (no participants for 15+ minutes)
 */
export const cleanupInactiveRooms = () => {
    const rooms = getGuestRooms();
    const now = new Date().getTime();

    const activeRooms = rooms.filter(room => {
        const lastActivity = new Date(room.last_activity).getTime();
        const timeSinceActivity = now - lastActivity;

        // Keep room if it has participants OR if it's been less than 15 minutes
        if (room.participants > 0) {
            return true; // Keep rooms with active participants
        }

        if (timeSinceActivity < INACTIVITY_TIMEOUT) {
            return true; // Keep rooms that are still within the timeout period
        }

        console.log(`Deleting inactive guest room: ${room.title} (inactive for ${Math.floor(timeSinceActivity / 60000)} minutes)`);
        return false; // Delete inactive rooms
    });

    if (activeRooms.length !== rooms.length) {
        saveGuestRooms(activeRooms);
        console.log(`Cleaned up ${rooms.length - activeRooms.length} inactive guest rooms`);
    }

    return activeRooms;
};

/**
 * Initialize cleanup interval
 * Checks every minute for inactive rooms
 */
export const startCleanupInterval = () => {
    // Run cleanup immediately
    cleanupInactiveRooms();

    // Then run every minute
    const intervalId = setInterval(() => {
        cleanupInactiveRooms();
    }, 60 * 1000); // Check every minute

    return intervalId;
};

/**
 * Stop cleanup interval
 */
export const stopCleanupInterval = (intervalId) => {
    if (intervalId) {
        clearInterval(intervalId);
    }
};
