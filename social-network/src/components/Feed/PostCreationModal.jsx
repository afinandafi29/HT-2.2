import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Home, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPostsApi, createPostApi } from '../../api/postApi';
import { ShortsIcon } from '../ShortsSection';

const ReelIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor" />
    </svg>
);

const PostCreationModal = ({ isOpen, onClose, onPostCreated }) => {
    const { currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [dbPosts, setDbPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setContent('');
            setLoading(true);
            getPostsApi(currentUser?.id || null)
                .then((data) => setDbPosts(Array.isArray(data) ? data : (data?.posts || data?.data || [])))
                .catch(() => setDbPosts([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen, currentUser?.id]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!content.trim() || submitting) return;
        setSubmitting(true);
        try {
            await createPostApi({ content: content.trim(), title: null });
            onPostCreated?.();
            onClose();
        } catch (err) {
            console.error('Create post failed:', err);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { title: 'Error', message: err?.message || 'Failed to create post.' } }));
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="post-detail-overlay" style={{ zIndex: 5000 }} onClick={onClose}>
            <div className="post-creation-card" onClick={e => e.stopPropagation()} style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Create New Post</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading from database...</p>
                ) : dbPosts.length > 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '12px' }}>You have {dbPosts.length} post(s) in the database.</p>
                ) : null}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><Camera size={20} /> Image</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><ReelIcon /> Video</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><MessageCircle size={20} /> Text</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><RefreshCw size={20} /> Go Live</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }} onClick={() => { window.location.href = '/create-room' }}><Home size={20} /> Create Room</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-poll"></i> Poll</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-music"></i> Music</button>
                    <button type="button" className="creation-option-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' }}><i className="fas fa-map-marker-alt"></i> Location</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', minHeight: '100px' }} />
                    <button type="submit" className="post-submit-btn" disabled={submitting || !content.trim()} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', background: 'var(--primary-color)', color: 'white', fontWeight: 'bold', border: 'none', opacity: submitting || !content.trim() ? 0.7 : 1 }}>{submitting ? 'Posting...' : 'Post Now'}</button>
                </form>
            </div>
        </div>
    );
};

export default PostCreationModal;
