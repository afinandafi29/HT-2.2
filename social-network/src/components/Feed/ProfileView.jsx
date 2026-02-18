import React, { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';

const ProfileView = ({ user, isSelf }) => {
    const [activeTab, setActiveTab] = useState('grid');
    const [profileImages, setProfileImages] = useState([]);

    const SELF_USER_ID = `user_${Math.random().toString(36).substr(2, 9)}`;
    const SELF_USER_BIO = "Living life one post at a time ✨ | Explorer 🌍 | Coffee lover ☕";

    useEffect(() => {
        const fetchProfileImages = async () => {
            try {
                const res = await newsApi.getAllNews({ search: 'nature lifestyle', limit: 15 });
                setProfileImages((res.data || []).map(n => ({ id: n.uuid, url: n.image_url })));
            } catch (err) { console.error(err); }
        };
        fetchProfileImages();
    }, [user]);

    const displayName = isSelf ? "User" : user?.name || "User";
    const displayBio = isSelf ? SELF_USER_BIO : user?.bio || "";
    const displayId = isSelf ? SELF_USER_ID : user?.id || "";
    const stats = isSelf ? { p: 0, f1: 0, f2: 0 } : { p: profileImages.length, f1: Math.floor(Math.random() * 1000), f2: Math.floor(Math.random() * 800) };
    const pic = isSelf ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : user?.pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="user-profile-view">
            <div className="profile-header-top">
                <p>{isSelf ? "user" : user?.username || "user"} <span><img src="https://img.icons8.com/ios/30/000000/expand-arrow--v3.png" style={{ width: 10 }} alt="" /></span></p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <img src="https://img.icons8.com/ios/50/000000/plus-2-math.png" style={{ width: 30 }} alt="" />
                    <img src="https://img.icons8.com/ios-filled/50/000000/menu--v2.png" style={{ width: 30 }} alt="" />
                </div>
            </div>

            <div className="profile-bio-section">
                <div className="bio-top">
                    <div className="profile-main-pic-wrapper">
                        <div className="profile-main-pic" style={{ backgroundImage: `url(${pic})`, backgroundSize: 'cover' }}></div>
                    </div>
                    <div className="stats-flex">
                        <div className="stat-item"><span className="num">{stats.p}</span><span className="label">Posts</span></div>
                        <div className="stat-item"><span className="num">{stats.f1}</span><span className="label">Followers</span></div>
                        <div className="stat-item"><span className="num">{stats.f2}</span><span className="label">Following</span></div>
                    </div>
                </div>
                <div className="bio-content">
                    <p className="profile-name">{displayName}</p>
                    <p className="profile-bio-text">{displayBio}</p>
                    <p className="profile-user-id">ID: {displayId}</p>
                </div>

                <div className="edit-profile-row">
                    <button className="edit-btn">Edit Profile</button>
                    <button className="share-btn">Share Profile</button>
                </div>
            </div>

            <div className="highlights-section">
                <p className="highlights-title">Story Highlights</p>
                <div className="highlights-list">
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/airport.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/new-delhi.png)' }}></div>
                    <div className="highlight-item" style={{ backgroundImage: 'url(https://img.icons8.com/bubbles/50/000000/hamburger.png)' }}></div>
                    <div className="highlight-item highlight-plus">
                        <img src="https://img.icons8.com/android/24/000000/plus.png" style={{ width: 20 }} alt="" />
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <div className={`profile-tab-item ${activeTab === 'grid' ? 'active' : ''}`} onClick={() => setActiveTab('grid')}>
                    <img src="https://img.icons8.com/small/16/000000/grid.png" alt="" />
                </div>
                <div className={`profile-tab-item ${activeTab === 'tagged' ? 'active' : ''}`} onClick={() => setActiveTab('tagged')}>
                    <img src="https://cdn0.iconfinder.com/data/icons/instagram-ui-1/24/Instagram-UI_tagged-512.png" style={{ width: 20 }} alt="" />
                </div>
            </div>

            <div className="profile-post-grid">
                {profileImages.map(post => (
                    <div key={post.id} className="profile-post-item">
                        <img src={post.url} alt="" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileView;
