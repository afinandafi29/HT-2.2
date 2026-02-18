import React, { useState, useEffect, useCallback } from 'react';
import PostCard from './PostCard';
import CreatePostForm from './CreatePostForm';
import { getPostsApi } from '../../api/postApi';
import { newsApi } from '../../api/newsApi';
import { useAuth } from '../../contexts/AuthContext';
import ActionButtons from '../ActionButtons';
import '../../styles/feed.css';

const FeedContent = ({ className, onBackClick }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const { currentUser } = useAuth();

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch User Posts
            let userPosts = [];
            try {
                const data = await getPostsApi();
                userPosts = data.posts || data.data || (Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch user posts:", err);
            }

            // Fetch News Posts
            let newsPosts = [];
            try {
                const newsRes = await newsApi.getTopStories({ limit: 20 });
                newsPosts = (newsRes.data || []).map(ns => {
                    const fallbackImgs = [
                        "https://images.unsplash.com/photo-1504711434969?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1585829365234-781fcdb4c40b?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
                    ];
                    return {
                        id: `news-${ns.uuid || Math.random().toString(36).substr(2, 9)}`,
                        username: ns.source || 'News Hub',
                        profile_pic_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(ns.source || 'N')}&background=random&color=fff`,
                        content: ns.title + (ns.description ? "\n\n" + ns.description : ""),
                        image_url: ns.image_url || fallbackImgs[Math.floor(Math.random() * fallbackImgs.length)],
                        likes_count: Math.floor(Math.random() * 500),
                        comments_count: Math.floor(Math.random() * 50),
                        created_at: ns.published_at || new Date().toISOString(),
                        is_news: true,
                        url: ns.url
                    };
                });
            } catch (err) {
                console.error("Failed to fetch news:", err);
            }

            // Interleave and sort
            const combined = [...userPosts, ...newsPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setPosts(combined);
        } catch (err) {
            setError(err.message || 'Failed to load posts.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setShowCreatePost(false);
    };

    const handlePostDeleted = (postId) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    };

    const handleLikeToggled = (postId, updatedLikesArray, updatedLikeCount) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, likes: updatedLikesArray, likes_count: updatedLikeCount }
                    : post
            )
        );
    };

    return (
        <div className={`feed-content-container ${className} mx-auto max-w-3xl px-4 py-6`}>
            <ActionButtons />
            <div className="feed-header flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                {/* <button onClick={onBackClick} className="text-blue-400 hover:text-blue-300">← Back to Rooms</button> */}
                <h2 className="text-2xl font-bold text-white">Post</h2>
                <button
                    onClick={() => {
                        if (currentUser) {
                            setShowCreatePost(true);
                        } else {
                            window.dispatchEvent(new CustomEvent('SHOW_AUTH'));
                        }
                    }}
                    className="bg-black/40 hover:bg-black/60 text-white font-semibold px-6 py-2 rounded-full border border-white/5 backdrop-blur-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                    Create Post
                </button>
            </div>

            {showCreatePost && (
                <CreatePostForm
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            {isLoading && posts.length === 0 && (
                <p className="text-center text-white/70 py-6 font-medium">Loading posts...</p>
            )}
            {error && (
                <p className="text-center text-red-500 py-6">{error}</p>
            )}

            <div className="posts-list space-y-6">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUser={currentUser}
                        onLikeToggled={handleLikeToggled}
                        onPostDeleted={handlePostDeleted}
                    />
                ))}
            </div>

            {posts.length === 0 && !isLoading && !error && (
                <p className="text-center text-white/70 py-6 font-medium">No posts yet. Be the first to create one!</p>
            )}
        </div>
    );
};

export default FeedContent;
