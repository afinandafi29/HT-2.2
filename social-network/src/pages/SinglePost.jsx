import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByIdApi } from '../api/postApi';
import PostCard from '../components/Feed/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const SinglePostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedPost = await getPostByIdApi(postId);
                setPost(fetchedPost);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message || "Failed to load post.");
            } finally {
                setIsLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleLikeToggled = (id, updatedLikesArray, updatedLikeCount) => {
        setPost(prevPost => ({
            ...prevPost,
            likes: updatedLikesArray,
            likes_count: updatedLikeCount
        }));
    };

    const handlePostDeleted = (id) => {
        // If the post is deleted, go back to the previous page or feed
        navigate('/feed');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-center px-4">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-center px-4">
                <p className="text-white mb-4">Post not found.</p>
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
            >
                <FaArrowLeft /> Back
            </button>

            <PostCard
                post={post}
                currentUser={currentUser}
                onLikeToggled={handleLikeToggled}
                onPostDeleted={handlePostDeleted}
            />
        </div>
    );
};

export default SinglePostPage;
