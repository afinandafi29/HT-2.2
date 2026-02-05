import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaShareAlt, FaCommentAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { toggleLikePostApi, deletePostApi, reportPostApi } from '../../api/postApi';
import { FaEllipsisV, FaExclamationTriangle as FaReportPostIcon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/feed.css';

const convertUrlsToLinks = (text) => {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent post navigation when clicking the link
                >
                    {part}
                </a>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

const PostCard = ({ post, currentUser, onLikeToggled, onPostDeleted }) => {
    const navigate = useNavigate();
    const initialIsLiked = currentUser && post.likes?.some(like => like.user_id === currentUser.id);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [localLikeCount, setLocalLikeCount] = useState(post.likes_count || 0);
    const [error, setError] = useState('');
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [showReportPostModal, setShowReportPostModal] = useState(false);
    const [postReportReason, setPostReportReason] = useState('');
    const [postActionError, setPostActionError] = useState('');
    const [postActionLoading, setPostActionLoading] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking like button
        if (!currentUser) {
            window.dispatchEvent(new CustomEvent('SHOW_AUTH'));
            return;
        }
        setError('');
        const originalLikedState = isLiked;
        const originalLikeCount = localLikeCount;
        try {
            setIsLiked(!isLiked);
            setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);

            await toggleLikePostApi(post.id);

            let updatedLikesArray;
            if (!originalLikedState) {
                updatedLikesArray = [...(post.likes || []), { user_id: currentUser.id }];
            } else {
                updatedLikesArray = (post.likes || []).filter(like => like.user_id !== currentUser.id);
            }
            onLikeToggled(post.id, updatedLikesArray, isLiked ? originalLikeCount - 1 : originalLikeCount + 1);
        } catch (err) {
            setIsLiked(originalLikedState);
            setLocalLikeCount(originalLikeCount);
            setError(err.message || 'Failed to toggle like.');
            console.error("Like error:", err);
        }
    };

    const [copied, setCopied] = useState(false);

    const handleShare = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking share button
        const postUrl = `${window.location.origin}/posts/${post.id}`;

        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Link copied to clipboard!' } }));
        } catch (err) {
            console.error('Failed to copy link:', err);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Failed to copy link' } }));
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete button
        if (!currentUser || currentUser.id !== post.user_id) {
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "You can only delete your own posts." } }));
            return;
        }

        window.dispatchEvent(new CustomEvent('SHOW_ALERT', {
            detail: {
                title: 'Confirm Deletion',
                message: "Are you sure you want to delete this post?",
                onConfirm: async () => {
                    try {
                        await deletePostApi(post.id);
                        if (onPostDeleted) onPostDeleted(post.id);
                    } catch (err) {
                        console.error("Failed to delete post:", err);
                        window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Failed to delete post: " + err.message } }));
                    }
                }
            }
        }));
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        if (!currentUser) {
            window.dispatchEvent(new CustomEvent('SHOW_AUTH'));
            return;
        }
        navigate(`/posts/${post.id}`);
    };

    const handleOpenReportPostModal = (e) => {
        e.stopPropagation(); // Prevent navigation when clicking report button
        if (!currentUser) {
            window.dispatchEvent(new CustomEvent('SHOW_AUTH'));
            return;
        }
        setPostReportReason('');
        setPostActionError('');
        setShowPostMenu(false); // Close menu if open
        setShowReportPostModal(true);
    };

    const handleReportPost = async (e) => {
        e.preventDefault();
        if (!postReportReason.trim()) {
            setPostActionError("Please provide a reason for reporting.");
            return;
        }
        setPostActionLoading(true);
        setPostActionError('');
        try {
            await reportPostApi(post.id, postReportReason);
            window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Post reported successfully. Thank you." } }));
            setShowReportPostModal(false);
        } catch (err) {
            setPostActionError(err.message || "Failed to report post.");
        } finally {
            setPostActionLoading(false);
        }
    };

    const handlePostClick = () => {
        navigate(`/posts/${post.id}`);
    };

    const author = post.author || post.profile || { username: 'Unknown User', avatar_url: 'https://via.placeholder.com/150' };

    return (
        <>
            <div
                className="post-card rounded-2xl shadow-lg overflow-hidden mb-12 transition hover:shadow-xl cursor-pointer"
                onClick={handlePostClick}
            >
                <div className="p-4">
                    <div className='flex justify-between rounded' >
                        <div className="flex items-center justify-start mb-4 gap-2">
                            <Link to={`/profile/${author.id || post.user_id}`} onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={author.avatar_url || 'https://via.placeholder.com/150'}
                                    alt={author.username}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700"
                                />
                            </Link>
                            <div>
                                <Link to={`/profile/${author.id || post.user_id}`} onClick={(e) => e.stopPropagation()}>
                                    <p className="font-semibold text-white hover:underline text-base">{author.username}</p>
                                </Link>
                                <p className="text-xs text-gray-200">
                                    {new Date(post.created_at).toLocaleString()}
                                </p>
                            </div>

                        </div>
                        {currentUser && currentUser.id === post.user_id ? (
                            <div className="ml-auto flex items-center gap-2">
                                <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
                                    <FaTrash />
                                </button>
                            </div>
                        ) :
                            (
                                <div className="ml-auto flex items-center gap-2 relative">
                                    <button onClick={(e) => { e.stopPropagation(); setShowPostMenu(!showPostMenu); }} className="text-gray-400 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/5 transition-all">
                                        <FaEllipsisV />
                                    </button>
                                    {showPostMenu && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 py-1">
                                            <button
                                                onClick={handleOpenReportPostModal}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 flex items-center"
                                            >
                                                <FaReportPostIcon className="mr-2" /> Report Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>

                    {post.title && (
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                    )}
                    <p className="text-white whitespace-pre-wrap leading-relaxed">{convertUrlsToLinks(post.content)}</p>
                </div>

                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title || 'Post image'}
                        className="w-full h-auto max-h-96 object-cover bg-gray-900"
                    />
                )}
                <hr className='text-sky-900' />
                <div className="post-card-actions">
                    <div className="flex items-center gap-4 text-gray-300">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/40 hover:bg-black/60 transition-all active:scale-95 ${isLiked ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'hover:text-white'}`}
                        >
                            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            <span className="text-sm font-medium">{localLikeCount}</span>
                        </button>
                        <button
                            onClick={handleCommentClick}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/40 hover:bg-black/60 hover:text-white transition-all active:scale-95"
                        >
                            <FaCommentAlt />
                            <span className="text-sm font-medium">{post.comments_count || 0}</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-black/40 hover:bg-black/60 transition-all active:scale-95 ${copied ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'hover:text-white'}`}
                        >
                            <FaShareAlt />
                            <span className="text-sm font-medium">{copied ? "Copied!" : "Share"}</span>
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>
            </div>

            {showReportPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
                        <h3 className="text-xl font-semibold mb-4 text-white">Report Post</h3>
                        <form onSubmit={handleReportPost}>
                            <textarea
                                value={postReportReason}
                                onChange={(e) => setPostReportReason(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                rows="4"
                                placeholder="Please provide a reason for reporting this post..."
                                required
                            />
                            {postActionError && <p className="text-red-500 text-sm mt-2">{postActionError}</p>}
                            <div className="mt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowReportPostModal(false)} disabled={postActionLoading} className="px-4 py-2 text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                                <button type="submit" disabled={postActionLoading} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                                    {postActionLoading ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostCard;
