import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    getUserProfileApi,
    followUserApi,
    unfollowUserApi,
    blockUserApi,
    reportUserApi
} from '../api/userApi';
import {
    sendFriendRequestApi,
    acceptFriendRequestApi,
    rejectFriendRequestApi,
    unfriendUserApi
} from '../api/friendApi';
import { kickUserApi } from '../api/jitsiApi';

const UserProfileModal = ({ isOpen, onClose, user, currentUser, roomName, roomAdminId }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [friendStatus, setFriendStatus] = useState(null); // { status, is_sender }
    const [reportReason, setReportReason] = useState('');
    const [showReportInput, setShowReportInput] = useState(false);

    const [chatPrivacy, setChatPrivacy] = useState('everyone');
    const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchProfile();
        }
    }, [isOpen, user]);

    const fetchProfile = async () => {
        const userId = user.id || user.user_id || user.userId;

        // Handle dummy/test users or cases where we already have some data
        if (!userId || userId.toString().startsWith('dummy-') || user.is_dummy) {
            setProfile({
                id: userId || 'temp-' + Date.now(),
                username: user.username || user.display_name || user.name || 'Guest User',
                avatar_url: user.avatar_url || user.avatar || '/default-avatar.png',
                bio: user.bio || "Hi! I'm enjoying HAPPYY TALK.",
                followers_count: user.followers_count || Math.floor(Math.random() * 100),
                following_count: user.following_count || Math.floor(Math.random() * 50),
                is_dummy: true,
                is_following: false,
                is_friend: false,
                chat_privacy: 'everyone'
            });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data = await getUserProfileApi(userId);
            setProfile(data);
            setIsFollowing(data.is_following);
            setIsFriend(data.is_friend);
            setFriendStatus(data.friend_request_status);
            setChatPrivacy(data.chat_privacy || 'everyone');
        } catch (error) {
            console.error("Failed to fetch profile, using passed data as fallback", error);
            // Fallback to passed user data if API fails
            setProfile({
                id: userId,
                username: user.username || user.display_name || user.name || 'User',
                avatar_url: user.avatar_url || user.avatar || '/default-avatar.png',
                bio: user.bio || "Profile details temporarily unavailable.",
                followers_count: user.followers_count || 0,
                following_count: user.following_count || 0,
                chat_privacy: 'everyone'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePrivacy = async (newPrivacy) => {
        setIsUpdatingPrivacy(true);
        try {
            await updateUserProfileApi({ chat_privacy: newPrivacy });
            setChatPrivacy(newPrivacy);
        } catch (error) {
            alert("Failed to update privacy: " + error.message);
        } finally {
            setIsUpdatingPrivacy(false);
        }
    };

    const handleFriendAction = async (action) => {
        if (profile.is_dummy) {
            if (action === 'request') {
                setFriendStatus({ status: 'pending', is_sender: true });
                alert("Friend request sent to " + profile.username);
            } else if (action === 'unfriend') {
                setIsFriend(false);
                setFriendStatus(null);
                alert("Unfriended " + profile.username);
            }
            return;
        }

        try {
            if (action === 'request') {
                await sendFriendRequestApi(profile.id);
                setFriendStatus({ status: 'pending', is_sender: true });
            } else if (action === 'accept') {
                const requestId = friendStatus?.id;
                if (requestId) {
                    await acceptFriendRequestApi(requestId);
                    alert("Follow request accepted! You are now mutually following.");
                    fetchProfile();
                }
            }
            else if (action === 'unfriend') {
                if (window.confirm("Unfriend this user?")) {
                    await unfriendUserApi(profile.id);
                    setIsFriend(false);
                    setFriendStatus(null);
                }
            }
        } catch (error) {
            alert(error.message || "Action failed");
        }
    };

    const handleFollowToggle = async () => {
        if (profile.is_dummy) {
            setIsFollowing(!isFollowing);
            alert(isFollowing ? "Unfollowed " : "Following " + profile.username);
            return;
        }

        try {
            if (isFollowing) {
                await unfollowUserApi(profile.id);
                setIsFollowing(false);
            } else {
                await followUserApi(profile.id);
                setIsFollowing(true);
            }
        } catch (error) {
            alert(error.message || "Action failed");
        }
    };

    const handleBlock = async () => {
        if (!window.confirm(`Are you sure you want to block ${profile.username}?`)) return;

        if (profile.is_dummy) {
            alert("User blocked");
            onClose();
            return;
        }

        try {
            await blockUserApi(profile.id);
            alert("User blocked");
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleReport = async () => {
        if (!reportReason.trim()) return;

        if (profile.is_dummy) {
            alert("Thank you. Our moderators will review this virtual participant.");
            setShowReportInput(false);
            setReportReason('');
            return;
        }

        try {
            await reportUserApi(profile.id, reportReason);
            alert("User reported");
            setShowReportInput(false);
            setReportReason('');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleKick = async () => {
        if (!window.confirm(`Are you sure you want to kick ${profile.username} from the room?`)) return;

        if (profile.is_dummy) {
            alert("User kicked from room (Simulated)");
            onClose();
            return;
        }

        try {
            await kickUserApi(roomName, profile.id);
            alert("User kicked and blocked from room");
            onClose();
        } catch (error) {
            alert(error.message || "Failed to kick user");
        }
    };

    if (!isOpen || !user) return null;

    const isMe = currentUser && profile && currentUser.id === profile.id;
    const isRoomAdmin = currentUser && roomAdminId && currentUser.id === roomAdminId;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1100] p-4 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#0f172a]/95 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(30,64,175,0.3)] border border-white/10 relative animate-in fade-in zoom-in-95 duration-300">

                {/* Cover Glow */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white z-20 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-blue-400 font-bold tracking-widest animate-pulse">LOADING PROFILE...</p>
                    </div>
                ) : profile ? (
                    <div className="relative z-10">
                        {/* Profile Section */}
                        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">

                            {/* Left: Avatar */}
                            <div className="relative group/avatar shrink-0">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] border-4 border-[#1e293b] shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden bg-gray-800 flex items-center justify-center transition-all duration-500 group-hover/avatar:scale-[1.02] group-hover/avatar:rotate-2">
                                    <img
                                        src={profile.avatar_url || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-[#0f172a] rounded-2xl shadow-xl flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* Right: Info */}
                            <div className="flex-grow space-y-4 max-w-md">
                                {/* Mockup Style Header Info */}
                                <div className="text-center">
                                    <div className="flex justify-center items-center gap-2 mb-1">
                                        <i className="far fa-star text-blue-400 text-xs"></i>
                                        <h2 className="text-2xl font-black text-white truncate uppercase tracking-tight">{profile.username}</h2>
                                    </div>
                                    <div className="flex justify-center items-center gap-2">
                                        <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${profile.is_dummy ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                            {profile.is_dummy ? 'Virtual' : 'Member'}
                                        </span>
                                        {profile.is_friend && (
                                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <i className="fas fa-heart text-[8px]"></i> Friend
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs mx-auto italic">
                                        {profile.bio ? `"${profile.bio}"` : '"Enjoying the HAPPYY TALK network."'}
                                    </p>
                                </div>

                                <div className="flex justify-center md:justify-start gap-8 pt-4">
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-black text-white">{profile.followers_count || 0}</div>
                                        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Followers</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-black text-white">{profile.following_count || 0}</div>
                                        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Container */}
                        {!isMe && (
                            <div className="px-8 pb-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Follow Button */}
                                    {isFriend ? (
                                        <button
                                            onClick={() => handleFriendAction('unfriend')}
                                            className="w-full py-4 rounded-2xl font-black bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all group"
                                        >
                                            <i className="fas fa-check mr-2 group-hover:hidden"></i>
                                            <span className="group-hover:hidden uppercase tracking-widest">Following</span>
                                            <span className="hidden group-hover:block uppercase tracking-widest">Unfollow</span>
                                        </button>
                                    ) : friendStatus?.status === 'pending' ? (
                                        <button
                                            disabled={friendStatus.is_sender}
                                            onClick={() => !friendStatus.is_sender && handleFriendAction('accept')}
                                            className={`w-full py-4 rounded-2xl font-black border uppercase tracking-widest transition-all ${friendStatus.is_sender ? 'bg-gray-800 text-gray-500 border-white/5' : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}
                                        >
                                            <i className={`fas ${friendStatus.is_sender ? 'fa-hourglass-half' : 'fa-user-clock'} mr-2`}></i>
                                            {friendStatus.is_sender ? 'Requested' : 'Accept Follow'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFriendAction('request')}
                                            className="w-full py-4 rounded-2xl font-black bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all uppercase tracking-widest"
                                        >
                                            <i className="fas fa-plus mr-2"></i> Follow User
                                        </button>
                                    )}

                                    {/* Chat Button */}
                                    <button
                                        onClick={() => {
                                            if (!isFriend && chatPrivacy === 'friends_only') {
                                                alert("This user only accepts messages from friends.");
                                                return;
                                            }
                                            onClose();
                                            window.dispatchEvent(new CustomEvent('OPEN_CHAT_PANEL'));
                                            window.dispatchEvent(new CustomEvent('OPEN_AND_SELECT_CHAT', {
                                                detail: {
                                                    userId: profile.id,
                                                    username: profile.username,
                                                    avatar_url: profile.avatar_url,
                                                    chat_privacy: profile.chat_privacy,
                                                    isFriend: isFriend
                                                }
                                            }));
                                        }}
                                        className={`w-full py-4 rounded-2xl font-black transition-all uppercase tracking-widest ${isFriend ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-transparent text-gray-500 border border-white/5 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <i className="fas fa-comment-dots mr-2"></i> {isFriend ? 'Live Chat' : 'Chat'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        onClick={() => handleBlock()}
                                        className="py-3 rounded-2xl font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-ban"></i> Block
                                    </button>
                                    <button
                                        onClick={() => setShowReportInput(!showReportInput)}
                                        className="py-3 rounded-2xl font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-flag"></i> Report
                                    </button>
                                </div>

                                {isRoomAdmin && (
                                    <button
                                        onClick={handleKick}
                                        className="w-full mt-4 py-3 rounded-2xl font-black bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20 transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        <i className="fas fa-user-slash mr-2"></i> Kick from current room
                                    </button>
                                )}

                                {/* Report Input */}
                                {showReportInput && (
                                    <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-yellow-500/20 animate-in slide-in-from-top-2">
                                        <textarea
                                            placeholder="Please describe why you are reporting this user..."
                                            value={reportReason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            className="w-full bg-transparent border-none text-white text-sm outline-none resize-none h-20 placeholder:text-gray-600"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={handleReport}
                                                className="px-6 py-2 bg-yellow-600 text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-yellow-500 transition-colors"
                                            >
                                                Send Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isMe && (
                            <div className="px-8 pb-12">
                                <section className="mb-8">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Chat Privacy</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleUpdatePrivacy('everyone')}
                                            disabled={isUpdatingPrivacy}
                                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${chatPrivacy === 'everyone' ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                                        >
                                            <i className="fas fa-globe mr-2"></i> Everyone
                                        </button>
                                        <button
                                            onClick={() => handleUpdatePrivacy('friends_only')}
                                            disabled={isUpdatingPrivacy}
                                            className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${chatPrivacy === 'friends_only' ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                                        >
                                            <i className="fas fa-user-friends mr-2"></i> Friends Only
                                        </button>
                                    </div>
                                    <p className="mt-3 text-[10px] text-gray-600 italic leading-relaxed">
                                        {chatPrivacy === 'everyone' ? 'Anyone can send you message requests.' : 'Only accepted friends can message you directly.'}
                                    </p>
                                </section>

                                <div className="text-center">
                                    <button
                                        onClick={() => window.location.href = '/profile'}
                                        className="w-full py-4 bg-white/5 text-gray-300 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                    >
                                        <i className="fas fa-edit mr-2"></i> Edit Detailed Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-20 text-center text-red-400 font-bold uppercase tracking-widest">Profile vanished or unavailable.</div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;
