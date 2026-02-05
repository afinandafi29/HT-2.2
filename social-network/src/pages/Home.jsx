import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import RoomCard from '../components/RoomCard';
import { LayoutContext } from '../components/Layout/Layout';
import CreateRoomModal from '../components/CreateRoomModal';
import Phone from '../components/Phone/Phone';
import { getRoomsApi } from '../api/roomApi';
import { getJitsiTokenApi } from '../api/jitsiApi';
import { initialRooms } from '../data';
import { getGuestRooms, startCleanupInterval, stopCleanupInterval } from '../utils/guestRoomManager';
import '../styles/main.css';

function Home() {
  const {
    searchTerm,
    activeCategory,
    setActiveCategory,
    categoryVisible,
    setCategoryVisible,
    setCreateModalOpen,
    windowWidth: layoutWindowWidth,
    sidebarOpen,
    refreshTrigger,
    unreadCount,
    setUnreadCount
  } = React.useContext(LayoutContext);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showPhone, setShowPhone] = useState(false);

  // Fetch rooms on mount
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedAvatars, setHighlightedAvatars] = useState(new Set());

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const fetchedRooms = await getRoomsApi();
      const guestRooms = getGuestRooms();

      // Merge guest rooms with API rooms
      let allRooms = [];
      if (fetchedRooms && fetchedRooms.length > 0) {
        allRooms = [...guestRooms, ...fetchedRooms];
      } else {
        console.log('API returned empty or null, using initialRooms + guest rooms');
        allRooms = [...guestRooms, ...initialRooms];
      }

      setRooms(allRooms);
    } catch (err) {
      console.error("Error fetching data for Home:", err);
      // Fallback to initialRooms + guest rooms if API fails
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

  // Poll for room updates (live participants)
  useEffect(() => {
    // Initial fetch
    fetchData();
    // Auto-refresh disabled per user request
  }, [fetchData, refreshTrigger]);

  // Start guest room cleanup interval
  useEffect(() => {
    const cleanupIntervalId = startCleanupInterval();

    // Refresh rooms every minute to show updated guest rooms
    const refreshIntervalId = setInterval(() => {
      fetchData();
    }, 60 * 1000); // Refresh every minute

    return () => {
      stopCleanupInterval(cleanupIntervalId);
      clearInterval(refreshIntervalId);
    };
  }, [fetchData]);

  const socket = useSocket();

  // Socket.io Real-time Updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new room creation
    const handleRoomCreated = (newRoom) => {
      setRooms((prevRooms) => {
        if (prevRooms.some(r => r.id === newRoom.id)) return prevRooms;
        return [newRoom, ...prevRooms];
      });
    };

    // Listen for users joining rooms (Real-time avatars)
    const handleUserJoined = ({ roomName, user }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.jitsi_room_name === roomName) {
          const people = room.people || [];
          const userId = user.id || user.userId;
          if (people.some(p => (p.id || p.userId) === userId)) return room;
          return {
            ...room,
            people: [user, ...people]
          };
        }
        return room;
      }));
    };

    const handleUserLeft = ({ roomName, userId }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.jitsi_room_name === roomName) {
          const people = room.people || [];
          return {
            ...room,
            people: people.filter(p => (p.id || p.userId) !== userId)
          };
        }
        return room;
      }));
    };

    const handleUserKicked = ({ roomName, userId }) => {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.jitsi_room_name === roomName) {
          const people = room.people || [];
          return {
            ...room,
            people: people.filter(p => (p.id || p.userId) !== userId)
          };
        }
        return room;
      }));
    };

    const handleKicked = ({ roomName }) => {
      window.dispatchEvent(new CustomEvent('SHOW_ALERT', {
        detail: {
          title: 'Kicked',
          message: `You have been kicked from room: ${roomName}`
        }
      }));
      fetchData();
    };

    const handleUserBlocked = () => {
      fetchData();
    };

    socket.on('room_created', handleRoomCreated);
    socket.on('user_joined_room', handleUserJoined);
    socket.on('user_left_room', handleUserLeft);
    socket.on('user_kicked', handleUserKicked);
    socket.on('kicked_from_room', handleKicked);
    socket.on('user_blocked', handleUserBlocked);

    return () => {
      socket.off('room_created', handleRoomCreated);
      socket.off('user_joined_room', handleUserJoined);
      socket.off('user_left_room', handleUserLeft);
      socket.off('user_kicked', handleUserKicked);
      socket.off('kicked_from_room', handleKicked);
      socket.off('user_blocked', handleUserBlocked);
    };
  }, [socket, fetchData]);

  // Handle auto-join from shared links
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const joinRoomName = searchParams.get('join');

    if (joinRoomName && rooms.length > 0) {
      const roomToJoin = rooms.find(r => r.mirotalk_room_name === joinRoomName || String(r.id) === joinRoomName);
      if (roomToJoin) {
        const autoJoin = async () => {
          try {
            const userName = currentUser?.username || currentUser?.email?.split('@')[0] || 'User';
            const baseUrl = `https://p2p.mirotalk.com/join/${roomToJoin.mirotalk_room_name || roomToJoin.id}`;
            const finalUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}name=${encodeURIComponent(userName)}`;
            window.open(finalUrl, '_blank');
            navigate('/', { replace: true });
          } catch (err) {
            console.error('Auto-join failed:', err);
          }
        };
        autoJoin();
      }
    }
  }, [location.search, rooms, navigate, currentUser]);

  // Resize I suppose
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search input change - no longer needed locally as it's in Layout
  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // Filter rooms by category or search term
  const filterRooms = useCallback((room) => {
    if (searchTerm && !room.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (activeCategory === 'all') return true;
    if (activeCategory === 'trending') return room.topic?.toLowerCase() === 'english' || room.language?.toLowerCase() === 'english';
    if (activeCategory === 'youtube') return room.title?.toLowerCase().includes('youtube') || room.topic?.toLowerCase().includes('video');
    if (activeCategory === 'podcast') return room.title?.toLowerCase().includes('podcast') || room.topic?.toLowerCase().includes('podcast');
    if (activeCategory === 'movies') return room.title?.toLowerCase().includes('movie') || room.topic?.toLowerCase().includes('movie');

    // Check both topic and language for custom language categories
    if (!activeCategory) return true;
    return (
      room.topic?.toLowerCase() === activeCategory.toLowerCase() ||
      room.language?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [searchTerm, activeCategory]);

  const [phoneInitialScreen, setPhoneInitialScreen] = useState('app');

  // Add a toggle phone function
  const togglePhone = useCallback((screen = 'app') => {
    setPhoneInitialScreen(screen);
    setShowPhone(prevShowPhone => !prevShowPhone);
  }, []);


  // Function to open AI Chat page
  const openAIChatPage = useCallback(() => {
    navigate('/ai-chat');
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="home-container w-full overflow-x-hidden">
      {/* Search Bar and Navigation are now handled by Layout */}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-32 right-8 flex flex-col gap-4 z-50">
        {/* Chat Button */}
        <button
          onClick={() => {
            setUnreadCount(0);
            window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
          }}
          className="relative w-14 h-14 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
          title="Open Chat"
        >
          <i className="fas fa-comment-dots text-2xl"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Plus Button - Now opens Phone action panel */}
        <button
          onClick={() => togglePhone('app')}
          className="w-14 h-14 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
          title="Actions"
        >
          <i className="fas fa-plus text-2xl"></i>
        </button>
      </div>

      <div className="room-grid px-3 md:px-4 mt-0" id="room-grid">
        {rooms.filter(filterRooms).map(room => (
          <RoomCard
            key={room.id}
            room={room}
            currentUser={currentUser}
            onTopicUpdated={fetchData}
            highlightedAvatars={highlightedAvatars}
          />
        ))}
      </div>

      <div className="md:hidden h-16"></div>



      {
        showPhone && (
          <div className="fixed inset-0 z-[1002] flex items-center justify-end p-12 pointer-events-none">
            <div className="absolute inset-0 bg-black/10 pointer-events-auto" onClick={() => setShowPhone(false)}></div>
            <div className="relative transform scale-90 md:scale-100 transition-all duration-300 pointer-events-auto mr-4">
              <Phone onClose={() => setShowPhone(false)} initialScreen={phoneInitialScreen} />
            </div>
          </div>
        )
      }
    </div >
  );
}

export default Home;