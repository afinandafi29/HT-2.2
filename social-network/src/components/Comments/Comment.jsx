import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { deleteCommentApi } from '../../api/commentApi';

const Comment = ({ comment, currentUser, onCommentDeleted }) => {
    const author = comment.author || comment.profile || { username: 'Unknown User', avatar_url: 'https://via.placeholder.com/150' };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!currentUser || currentUser.id !== comment.user_id) {
            alert("You can only delete your own comments.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteCommentApi(comment.id);
                if (onCommentDeleted) onCommentDeleted(comment.id);
            } catch (err) {
                console.error("Failed to delete comment:", err);
                alert("Failed to delete comment: " + err.message);
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 transition-all duration-200 hover:bg-gray-750 hover:translate-x-1">
            <div className="flex items-start gap-3">
                <Link 
                    to={`/profile/${author.id || comment.user_id}`}
                    className="flex-shrink-0"
                >
                    <img
                        src={author.avatar_url || 'https://via.placeholder.com/150'}
                        alt={author.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700 transition-transform duration-200 hover:scale-105"
                    />
                </Link>
                
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <Link 
                                to={`/profile/${author.id || comment.user_id}`}
                                className="font-semibold text-white hover:text-blue-400 transition-colors duration-200"
                            >
                                {author.username}
                            </Link>
                            <span className="text-xs text-gray-400 ml-2">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </div>
                        
                        {currentUser && currentUser.id === comment.user_id && (
                            <button
                                onClick={handleDelete}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                title="Delete comment"
                            >
                                <FaTrash size={14} />
                            </button>
                        )}
                    </div>
                    
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comment; 