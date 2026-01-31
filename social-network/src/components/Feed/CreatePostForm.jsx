import React, { useState } from 'react';
import { createPostApi } from '../../api/postApi';

const CreatePostForm = ({ onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !title.trim()) {
            setError('Post content or title cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const postData = { title, content };
            if (imageUrl.trim()) {
                postData.image_url = imageUrl.trim();
            }
            const newPost = await createPostApi(postData);
            onPostCreated(newPost);
            setTitle('');
            setContent('');
            setImageUrl('');
        } catch (err) {
            setError(err.message || 'Failed to create post.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-post-modal-overlay">
            <div className="create-post-modal">
                <button
                    onClick={onClose}
                    className="create-post-close-btn"
                    aria-label="Close"
                    type="button"
                >
                    &times;
                </button>
                <h3 className="create-post-title">Create New Post</h3>
                <form onSubmit={handleSubmit} className="create-post-form">
                    <div className="create-post-form-group">
                        <label htmlFor="postTitle" className="text-white font-bold mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="postTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="create-post-input"
                            placeholder="Title of your post"
                        />
                    </div>
                    <div className="create-post-form-group">
                        <label htmlFor="postContent" className="text-white font-bold mb-1">
                            Content
                        </label>
                        <textarea
                            id="postContent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            className="create-post-textarea"
                            placeholder="What's on your mind?"
                            required
                        />
                    </div>
                    <div className="create-post-form-group">
                        <label htmlFor="postImageUrl" className="text-white font-bold mb-1">
                            Image URL <span className="text-white/50 text-xs italic">(optional)</span>
                        </label>
                        <input
                            type="url"
                            id="postImageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="create-post-input"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    {error && <p className="create-post-error">{error}</p>}
                    <div className="create-post-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="create-post-cancel-btn"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="create-post-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostForm;