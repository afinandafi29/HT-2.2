import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share2, Bookmark, MoreHorizontal, X } from 'lucide-react';

const PostDetailModal = ({ isOpen, post, onClose, onShare }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [reposted, setReposted] = useState(false);

    if (!isOpen || !post) return null;

    return (
        <div className="post-detail-overlay-alien" onClick={onClose}>
            <div className="alien-wrapper">
                <div className="alien-card" onClick={e => e.stopPropagation()}>
                    <div className="alien-top">
                        <div className="alien-userDetails">
                            <div className="alien-profile_img">
                                <img src={post.user.pic} className="alien-cover" alt="" />
                            </div>
                            <h3>{post.user.username}<br /><span>{post.user.location || "Earth, Solar System"}</span></h3>
                        </div>
                        <div className="alien-dot">
                            <MoreHorizontal size={20} />
                        </div>
                    </div>
                    <div className="alien-imgBx">
                        <img src={post.image} className="alien-cover" alt="" />
                    </div>
                    <div className="alien-actionBtns">
                        <div className="left">
                            <Heart
                                size={24}
                                className={`alien-icon ${liked ? 'liked' : ''}`}
                                color={liked ? '#ef4444' : 'currentColor'}
                                fill={liked ? '#ef4444' : 'none'}
                                onClick={() => setLiked(!liked)}
                            />
                            <MessageCircle size={24} className="alien-icon" />
                            <Repeat
                                size={24}
                                className={`alien-icon ${reposted ? 'reposted' : ''}`}
                                color={reposted ? '#22c55e' : 'currentColor'}
                                onClick={() => setReposted(!reposted)}
                                style={{ cursor: 'pointer' }}
                            />
                            <Share2 size={24} className="alien-icon" onClick={() => onShare && onShare(post)} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className="right">
                            <Bookmark
                                size={24}
                                className={`alien-icon ${saved ? 'saved' : ''}`}
                                color={saved ? '#3b82f6' : 'currentColor'}
                                fill={saved ? '#3b82f6' : 'none'}
                                onClick={() => setSaved(!saved)}
                            />
                        </div>
                    </div>
                    <h4 className="alien-likes">{(post.likes + (liked ? 1 : 0)).toLocaleString()} likes</h4>
                    <h4 className="alien-message"><b>{post.user.username}</b> {post.caption} <span>#AlienUI</span> <span>#Future</span> <span>#HappyTalk</span></h4>
                    <h4 className="alien-comments">View all {post.comments || 0} comments</h4>
                    <div className="alien-addComments">
                        <div className="alien-userImg">
                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" className="alien-cover" alt="" />
                        </div>
                        <input type="text" className="alien-text" placeholder="Add a comment..." />
                    </div>
                    <h5 className="alien-postTime">{post.time || "4 hours ago"}</h5>
                    <button className="alien-close-btn" onClick={onClose}><X size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
