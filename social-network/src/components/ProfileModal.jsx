// Profile Modal Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileModal.css';

const API_BASE = 'http://localhost:5001/api';

const ProfileModal = ({ user, currentUser, isOpen, onClose }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [areFriends, setAreFriends] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user && currentUser) {
            fetchRelationshipStatus();
        }
    }, [isOpen, user, currentUser]);

    const fetchRelationshipStatus = async () => {
        try {
            setLoading(true);

            // Check if friends
            const friendsRes = await axios.get(`${API_BASE}/social/are-friends`, {
                params: { userId1: currentUser.id, userId2: user.id }
            });
            setAreFriends(friendsRes.data.areFriends);

            // Check if following
            const followingRes = await axios.get(`${API_BASE}/social/following`, {
                params: { userId: currentUser.id }
            });
            const isFollowingUser = followingRes.data.data.some(
                f => f.following_id === user.id
            );
            setIsFollowing(isFollowingUser);

            // Check if blocked
            const blockedRes = await axios.get(`${API_BASE}/moderation/is-blocked`, {
                params: { userId1: currentUser.id, userId2: user.id }
            });
            setIsBlocked(blockedRes.data.isBlocked);
        } catch (error) {
            console.error('Error fetching relationship status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`${API_BASE}/social/follow/${user.id}`, {
                    data: { followerId: currentUser.id }
                });
                setIsFollowing(false);
            } else {
                await axios.post(`${API_BASE}/social/follow/${user.id}`, {
                    followerId: currentUser.id
                });
                setIsFollowing(true);
            }

            // Re-check friendship status
            await fetchRelationshipStatus();
        } catch (error) {
            console.error('Error following/unfollowing:', error);
            alert(error.response?.data?.error || 'Failed to update follow status');
        }
    };

    const handleBlock = async () => {
        if (!confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} ${user.username}?`)) {
            return;
        }

        try {
            if (isBlocked) {
                await axios.delete(`${API_BASE}/moderation/block/${user.id}`, {
                    data: { blockerId: currentUser.id }
                });
                setIsBlocked(false);
            } else {
                await axios.post(`${API_BASE}/moderation/block/${user.id}`, {
                    blockerId: currentUser.id
                });
                setIsBlocked(true);
                setIsFollowing(false);
                setAreFriends(false);
            }
        } catch (error) {
            console.error('Error blocking/unblocking:', error);
            alert(error.response?.data?.error || 'Failed to update block status');
        }
    };

    const handleReport = async () => {
        const reason = prompt('Please provide a reason for reporting this user:');
        if (!reason) return;

        try {
            await axios.post(`${API_BASE}/moderation/report`, {
                reporterId: currentUser.id,
                reportedUserId: user.id,
                reason
            });
            alert('Report submitted successfully. Our team will review it.');
        } catch (error) {
            console.error('Error reporting user:', error);
            alert('Failed to submit report');
        }
    };

    const handleMessage = () => {
        if (!areFriends) {
            alert('You can only message friends. Follow each other to become friends!');
            return;
        }

        // Emit event to open chat with this user
        window.dispatchEvent(new CustomEvent('openChat', { detail: { user } }));
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="profile-modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="profile-modal-header">
                    <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.username}
                        className="profile-modal-avatar"
                    />
                    <h2>{user.username}</h2>
                    {user.bio && <p className="profile-modal-bio">{user.bio}</p>}
                </div>

                {loading ? (
                    <div className="profile-modal-loading">Loading...</div>
                ) : (
                    <div className="profile-modal-actions">
                        {isBlocked ? (
                            <div className="profile-modal-blocked">
                                <p>You have blocked this user</p>
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleBlock}
                                >
                                    Unblock
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="profile-modal-status">
                                    {areFriends && (
                                        <span className="status-badge friends">
                                            👥 Friends
                                        </span>
                                    )}
                                    {isFollowing && !areFriends && (
                                        <span className="status-badge following">
                                            ✓ Following
                                        </span>
                                    )}
                                </div>

                                <div className="profile-modal-buttons">
                                    <button
                                        className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleFollow}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleMessage}
                                        disabled={!areFriends}
                                        title={!areFriends ? 'You must be friends to message' : ''}
                                    >
                                        💬 Message
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={handleBlock}
                                    >
                                        🚫 Block
                                    </button>

                                    <button
                                        className="btn btn-warning"
                                        onClick={handleReport}
                                    >
                                        ⚠️ Report
                                    </button>
                                </div>

                                <div className="profile-modal-info">
                                    <p className="info-text">
                                        {areFriends
                                            ? 'You are friends! You can send messages to each other.'
                                            : isFollowing
                                                ? 'You are following this user. If they follow you back, you\'ll become friends!'
                                                : 'Follow this user to connect. When you both follow each other, you\'ll become friends and can chat!'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
