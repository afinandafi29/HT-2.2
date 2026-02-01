import { useState } from 'react';
import { deleteRoomApi } from '../api/roomApi';
import { deleteGuestRoom } from '../utils/guestRoomManager';

const RoomCard = ({ room, currentUser, onTopicUpdated, onRoomDeleted }) => {

    const {
        id,
        title,
        topic,
        meeting_url,
        mirotalk_room_name,
        profile: creator,
        people: profiles,
        created_by,
        language,
        max_capacity = 10,
        is_guest_room
    } = room;

    const isFull = max_capacity > 0 && profiles && profiles.length >= max_capacity;

    const handleJoinRoom = () => {
        if (isFull) {
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "This room is currently full. Please try another room or wait for someone to leave." } }));
            return;
        }

        // Allow guests to join - generate a guest username if not logged in
        let userName;
        if (currentUser) {
            userName = currentUser?.username || currentUser?.email?.split('@')[0] || 'User';
        } else {
            // Generate a random guest username
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            userName = `Guest_${randomNum} `;
        }

        // Use production MiroTalk server URL
        const roomName = (mirotalk_room_name || `room-${id}`).trim();

        // Check if running locally (localhost, 127.0.0.1, or local IP ranges)
        let baseUrl = 'https://meet.happyytalk.in';
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.');

        if (isLocal) {
            baseUrl = `http://${hostname}:3000`;
        }

        // Use clean URL format: /join/RoomName?name=UserName
        const productionMiroTalkUrl = `${baseUrl}/join/${encodeURIComponent(roomName)}`;
        const finalUrl = `${productionMiroTalkUrl}?name=${encodeURIComponent(userName)}`;
        window.open(finalUrl, '_blank');
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/?join=${mirotalk_room_name || id}`;
        const shareText = `Join my room "${title}" on HAPPYY TALK!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `HAPPYY TALK - ${title}`,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Link copied to clipboard!' } }));
                }
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Link copied to clipboard!' } }));
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            // If it's a guest room, delete from localStorage
            if (is_guest_room || String(id).startsWith('guest-')) {
                deleteGuestRoom(id);
                window.dispatchEvent(new CustomEvent('SHOW_ALERT', {
                    detail: { message: 'Guest room deleted successfully!' }
                }));
            } else {
                // Otherwise delete via API
                await deleteRoomApi(id);
            }

            if (onRoomDeleted) onRoomDeleted();
            else if (onTopicUpdated) onTopicUpdated();
        } catch (err) {
            console.error("Failed to delete room:", err);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Failed to delete room" } }));
        }
    };

    // Helper to get card background based on language (Glassy with tint)
    const getCardStyle = (lang) => {
        const l = (lang || '').toLowerCase();
        const glassBase = {
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        };

        if (l.includes('english')) {
            return {
                ...glassBase,
                background: 'linear-gradient(135deg, rgba(29, 94, 255, 0.15) 0%, rgba(13, 14, 37, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
            };
        }
        if (l.includes('spanish')) {
            return {
                ...glassBase,
                background: 'linear-gradient(135deg, rgba(255, 153, 0, 0.1) 0%, rgba(13, 14, 37, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(255, 153, 0, 0.1)'
            };
        }
        if (l.includes('french')) {
            return {
                ...glassBase,
                background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.1) 0%, rgba(13, 14, 37, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(255, 0, 85, 0.1)'
            };
        }
        if (l.includes('german')) {
            return {
                ...glassBase,
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(13, 14, 37, 0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(255, 215, 0, 0.1)'
            };
        }
        // Default Glass
        return {
            ...glassBase,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
        };
    };

    const styles = getCardStyle(language);

    return (
        <div
            className="room-card relative flex flex-col justify-between p-6 rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/10"
            style={{
                height: '250px',
                ...styles
            }}
        >
            {/* Header Layout: Title/Topic | Lang | Mic */}
            <div className="grid grid-cols-[1fr_auto_auto] items-start gap-3">

                {/* Title Group */}
                <div className="min-w-0 text-left">
                    <h2
                        className="m-0 text-[1.1rem] text-white tracking-[1px] font-bold truncate transition-all duration-300"
                        style={{ fontFamily: '"Orbitron", sans-serif' }}
                        title={title}
                    >
                        {title}
                    </h2>
                    <p className="m-[4px_0_0_0] text-[0.75rem] text-white/60 truncate">
                        {topic || 'Conversational practice'}
                    </p>
                </div>

                {/* Language Label */}
                <div className="text-white text-[0.7rem] font-bold tracking-[1px] flex items-center gap-1 mt-1 whitespace-nowrap">
                    <span className="text-[1.2em]">🌐</span> {(language || 'GLOBAL').toUpperCase()}
                </div>

                {/* Mic Box */}
                <div className="bg-[rgba(255,165,0,0.15)] border border-[rgba(255,165,0,0.3)] rounded-[6px] p-1 w-6 h-6 flex justify-center items-center text-[#ffa500] text-[0.8rem]">
                    🎙️
                </div>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center items-center gap-2 my-4 min-h-[76px]">
                {profiles && profiles.slice(0, 4).map((p, i) => (
                    <div key={i} className="w-[72px] h-[72px] rounded-full border-2 border-white/20 overflow-hidden bg-[#222] shadow-lg">
                        <img
                            src={p.avatar_url || `https://i.pravatar.cc/100?u=${i}`}
                            alt={`User ${i}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {profiles && profiles.length > 4 && (
                    <div className="w-[44px] h-[44px] rounded-full bg-white/10 flex justify-center items-center text-white font-semibold text-[0.8rem] border border-white/20 ml-1">
                        +{profiles.length - 4}
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <div className="flex justify-between items-center">
                {/* Share Icon */}
                <div
                    onClick={handleShare}
                    className="text-white/80 cursor-pointer text-[1.2rem] hover:text-white transition-colors"
                >
                    <i className="fas fa-share-alt"></i>
                </div>

                {/* Creator Tag & Delete */}
                <div className="text-[0.7rem] text-white/40 flex items-center gap-2">
                    <span>Created by {creator?.username || 'Guest'}</span>

                    {/* Delete Button for Guest Rooms, Owner/Custom Rooms */}
                    {(is_guest_room || String(id).startsWith('guest-') || String(id).startsWith('custom-') || (currentUser && created_by === currentUser?.id)) && (
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400/60 hover:text-red-500 transition-all bg-transparent border-none cursor-pointer"
                            title="Delete Room"
                        >
                            <i className="fas fa-trash-alt text-[0.9rem]"></i>
                        </button>
                    )}
                </div>

                {/* Join Button */}
                <button
                    onClick={handleJoinRoom}
                    disabled={isFull}
                    className={`
                        border-none py-[10px] px-[24px] rounded-[12px] font-[800] text-[0.8rem] cursor-pointer transition-transform hover:scale-105
                        ${isFull
                            ? 'bg-red-600 text-white cursor-not-allowed shadow-[0_4px_15px_rgba(220,38,38,0.4)]'
                            : 'bg-[#1d5eff] text-white hover:bg-[#3b74ff] shadow-[0_4px_15px_rgba(29,94,255,0.4)]'}
                    `}
                    style={{ fontFamily: '"Orbitron", sans-serif' }}
                >
                    {isFull ? 'FULL' : 'JOIN'}
                </button>
            </div>

        </div>
    );
};

export default RoomCard;
