import React, { useState, useEffect, useCallback, useContext } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import RoomCard from '../components/RoomCard';
import { LayoutContext } from '../components/Layout/Layout';
import Phone from '../components/Phone/Phone';
import { getRoomsApi } from '../api/roomApi';
import { initialRooms } from '../data';
import { getGuestRooms, startCleanupInterval, stopCleanupInterval } from '../utils/guestRoomManager';
import ShortsSection from '../components/ShortsSection';
import '../styles/main.css';

function Home() {
  const {
    searchTerm,
    activeCategory,
    setUnreadCount,
    unreadCount,
    refreshTrigger,
    activeHomeView,
    setActiveHomeView
  } = useContext(LayoutContext);

  const [showPhone, setShowPhone] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedAvatars, setHighlightedAvatars] = useState(new Set());

  const { currentUser } = useAuth();

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const fetchedRooms = await getRoomsApi();
      const guestRooms = getGuestRooms();
      let allRooms = [];
      if (fetchedRooms && fetchedRooms.length > 0) {
        allRooms = [...guestRooms, ...fetchedRooms];
      } else {
        allRooms = [...guestRooms, ...initialRooms];
      }
      setRooms(allRooms);
    } catch (err) {
      console.error("Error fetching data for Home:", err);
      const guestRooms = getGuestRooms();
      setRooms([...guestRooms, ...initialRooms]);
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      const allParticipants = rooms.flatMap(room => room.people || []);
      const shuffled = [...allParticipants].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10).map(p => p.avatar_url).filter(Boolean);
      setHighlightedAvatars(new Set(selected));
    }
  }, [rooms]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  useEffect(() => {
    const cleanupIntervalId = startCleanupInterval();
    const refreshIntervalId = setInterval(() => {
      fetchData();
    }, 60 * 1000);
    return () => {
      stopCleanupInterval(cleanupIntervalId);
      clearInterval(refreshIntervalId);
    };
  }, [fetchData]);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    const handleRoomCreated = (newRoom) => {
      setRooms((prevRooms) => {
        if (prevRooms.some(r => r.id === newRoom.id)) return prevRooms;
        return [newRoom, ...prevRooms];
      });
    };
    const handleUserJoined = ({ roomName, user }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.jitsi_room_name === roomName) {
          const people = room.people || [];
          const userId = user.id || user.userId;
          if (people.some(p => (p.id || p.userId) === userId)) return room;
          return { ...room, people: [user, ...people] };
        }
        return room;
      }));
    };
    const handleUserLeft = ({ roomName, userId }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.jitsi_room_name === roomName) {
          const people = room.people || [];
          return { ...room, people: people.filter(p => (p.id || p.userId) !== userId) };
        }
        return room;
      }));
    };
    socket.on('room_created', handleRoomCreated);
    socket.on('user_joined_room', handleUserJoined);
    socket.on('user_left_room', handleUserLeft);
    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('user_joined_room', handleUserJoined);
      socket.off('user_left_room', handleUserLeft);
    };
  }, [socket, fetchData]);

  const filterRooms = useCallback((room) => {
    if (room.is_private && (!currentUser || room.created_by !== currentUser.id)) return false;
    if (searchTerm && !room.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'trending') return room.topic?.toLowerCase() === 'english' || room.language?.toLowerCase() === 'english';
    return !activeCategory || room.topic?.toLowerCase() === activeCategory.toLowerCase() || room.language?.toLowerCase() === activeCategory.toLowerCase();
  }, [searchTerm, activeCategory, currentUser]);

  const [phoneInitialScreen, setPhoneInitialScreen] = useState('app');
  const togglePhone = useCallback((screen = 'app') => {
    setPhoneInitialScreen(screen);
    setShowPhone(prev => !prev);
  }, []);

  const renderContent = () => {
    if (activeHomeView === 'shorts') {
      return <ShortsSection onBack={() => setActiveHomeView('rooms')} />;
    }

    return (
      <div className="room-grid px-3 md:px-4 mt-0" id="room-grid">
        {rooms.filter(filterRooms).map(room => (
          <RoomCard key={room.id} room={room} currentUser={currentUser} onTopicUpdated={fetchData} highlightedAvatars={highlightedAvatars} />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p>{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Retry</button>
      </div>
    );
  }

  return (
    <div className="home-container w-full overflow-x-hidden">
      {/* Floating Action Buttons */}
      {activeHomeView !== 'shorts' && (
        <div className="fixed bottom-32 right-8 flex flex-col gap-4 z-50">
          {/* Chat Button */}
          <button
            onClick={() => {
              setUnreadCount(0);
              window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
            }}
            className="relative w-14 h-14 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
          >
            <i className="fas fa-comment-dots text-2xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => togglePhone('app')}
            className="w-14 h-14 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
          >
            <i className="fas fa-plus text-2xl"></i>
          </button>
        </div>
      )}
      {renderContent()}
      <div className="md:hidden h-16"></div>
      {showPhone && (
        <div className="fixed inset-0 z-[1002] flex items-center justify-end p-12 pointer-events-none">
          <div className="absolute inset-0 bg-black/10 pointer-events-auto" onClick={() => setShowPhone(false)}></div>
          <div className="relative transform scale-90 md:scale-100 transition-all duration-300 pointer-events-auto mr-4">
            <Phone onClose={() => setShowPhone(false)} initialScreen={phoneInitialScreen} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;