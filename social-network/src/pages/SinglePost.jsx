import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageSquare, Send, Share2 as Share } from "lucide-react";
import { getPostByIdApi } from "../api/postApi";
import { getCommentsApi, createCommentApi, deleteCommentApi } from "../api/commentApi";
import { useAuth } from "../contexts/AuthContext";
import { FaTrash } from "react-icons/fa";
import "../styles/feed.css";

const toggleLikePostApi = async (postId) => {
  console.warn("toggleLikePostApi called for postId:", postId, " - This is a placeholder.");
  return new Promise(resolve => setTimeout(resolve, 500));
};

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postData, commentsData] = await Promise.all([
          getPostByIdApi(postId),
          getCommentsApi(postId)
        ]);
        setPost(postData.post);
        setComments(commentsData.comments || []);
        setLikes(postData.post.likes_count || 0);
        setLiked(postData.post.likes?.some(like => like.user_id === currentUser?.id) || false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || 'Failed to load post and comments.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostAndComments();
    }
  }, [postId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      window.dispatchEvent(new CustomEvent('SHOW_AUTH'));
      return;
    }
    const originalLikes = likes;
    const originalLiked = liked;
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
    try {
      await toggleLikePostApi(postId);
    } catch (err) {
      setLikes(originalLikes);
      setLiked(originalLiked);
      setError(err.message || 'Failed to update like.');
      window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Failed to update like. Please try again." } }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    try {
      const response = await createCommentApi(postId, newComment);
      setComments(prev => [response.comment, ...prev]);
      setNewComment("");
      setPost(prev => ({
        ...prev,
        comments_count: (prev.comments_count || 0) + 1
      }));
    } catch (err) {
      setError(err.message || 'Failed to post comment.');
      window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Failed to post comment. Please try again." } }));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;
    const originalComments = [...comments];
    const originalPostCommentCount = post?.comments_count;
    setComments(prev => prev.filter(c => c.id !== commentId));
    setPost(prev => ({
      ...prev,
      comments_count: Math.max((prev.comments_count || 0) - 1, 0)
    }));
    try {
      await deleteCommentApi(commentId);
    } catch (err) {
      setError(err.message || 'Failed to delete comment.');
      window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: "Failed to delete comment. Please try again." } }));
      setComments(originalComments);
      if (originalPostCommentCount !== undefined) {
        setPost(prev => ({ ...prev, comments_count: originalPostCommentCount }));
      }
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    const shareData = {
      title: post?.title || 'HAPPYY TALK Post',
      text: post?.content,
      url: postUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Post link copied to clipboard!' } }));
      } catch (err) {
        console.error('Failed to copy link:', err);
        window.dispatchEvent(new CustomEvent('SHOW_ALERT', { detail: { message: 'Failed to copy link. You can manually copy it from the address bar.' } }));
      }
    }
  };

  const author = post?.author || post?.profile || { username: 'Unknown User', avatar_url: null };

  return (
    <div className="feed-content-container single-post-container">
      <div className="single-post-header">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="single-post-back-btn"
        >
          <ArrowLeft size={22} />
        </button>
      </div>
      <div className="single-post-card">
        {isLoading ? (
          <div className="single-post-loading">Loading post details...</div>
        ) : error ? (
          <div className="single-post-error">
            <p>Error: {error}</p>
            <p>The post might have been removed or the link is incorrect.</p>
          </div>
        ) : !post ? (
          <div className="single-post-error">Post not found.</div>
        ) : (
          <>
            <div className="single-post-content">
              <div className="single-post-author-row">
                <div className="single-post-avatar">
                  {author.avatar_url ? (
                    <img src={author.avatar_url} alt={author.username} />
                  ) : (
                    <span>{author.username.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="single-post-author-info">
                  <div className="single-post-author-name">{author.username}</div>
                  <div className="single-post-date">
                    {new Date(post.created_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              {post.title && (
                <h2 className="single-post-title">{post.title}</h2>
              )}
              <p className="single-post-text">{post.content}</p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title || 'Post image'}
                  className="single-post-image"
                />
              )}
            </div>
            <div className="single-post-actions">
              <button
                onClick={handleLike}
                aria-label={liked ? "Unlike post" : "Like post"}
                className={`single-post-action-btn${liked ? " liked" : ""}`}
              >
                <Heart size={20} className={liked ? "liked-heart" : ""} />
                <span>{likes}</span>
              </button>
              <button
                aria-label="View comments"
                className="single-post-action-btn"
                tabIndex={-1}
                style={{ pointerEvents: "none" }}
              >
                <MessageSquare size={20} />
                <span>{comments.length}</span>
              </button>
              <button
                onClick={handleShare}
                aria-label="Share post"
                className="single-post-action-btn single-post-action-share"
              >
                <Share size={20} />
              </button>
            </div>
            <div className="single-post-comments-section">
              <h3 className="single-post-comments-title">Comments ({comments.length})</h3>
              {currentUser && (
                <div className="single-post-add-comment">
                  <textarea
                    placeholder="Write a thoughtful comment..."
                    className="single-post-comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="single-post-add-comment-actions">
                    <button
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="single-post-comment-btn"
                    >
                      <Send size={16} />
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              )}
              <div className="single-post-comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="single-post-comment-card">
                      <div className="single-post-comment-header">
                        <div className="single-post-comment-avatar">
                          {comment.author?.avatar_url ? (
                            <img
                              src={comment.author.avatar_url}
                              alt={comment.author.username}
                            />
                          ) : (
                            <span>{comment.author?.username.slice(0, 1).toUpperCase() || 'U'}</span>
                          )}
                        </div>
                        <span className="single-post-comment-username">
                          {comment.author?.username || 'Anonymous User'}
                        </span>
                        <span className="single-post-comment-date">
                          {new Date(comment.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {currentUser && currentUser.id === comment.user_id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            aria-label="Delete comment"
                            className="single-post-comment-delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                      <p className="single-post-comment-content">
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="single-post-no-comments">
                    <MessageSquare size={48} className="single-post-no-comments-icon" />
                    <p>
                      {currentUser ? "Be the first to share your thoughts!" : (
                        <span>No comments yet. <button onClick={() => window.location.href = '/in'} className="text-blue-400 font-bold hover:underline">Sign In</button> to leave a comment.</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SinglePost;