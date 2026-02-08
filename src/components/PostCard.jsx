import React from 'react';
import { useNavigate } from 'react-router-dom';

function PostCard({ post, currentUser, onLike }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const isLikedByCurrentUser = currentUser && post.likes?.some(
    like => like.user === currentUser._id
  );

  const handleCommentClick = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.username?.charAt(0).toUpperCase()}
        </div>
        <div className="post-user-info">
          <h6>{post.username}</h6>
          <div className="post-date">{formatDate(post.createdAt)}</div>
        </div>
      </div>

      {/* Post Content */}
      {post.text && (
        <div className="post-content">{post.text}</div>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt="Post"
          className="post-image"
        />
      )}

      {/* Divider */}
      <div className="post-divider"></div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLikedByCurrentUser ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          <span>{isLikedByCurrentUser ? <i style={{color:"#e00606"}} className="bi bi-heart-fill"></i> : <i  className="bi bi-heart"></i>}</span>
          <span>{post.likesCount || 0}</span>
        </button>

        <button className="action-btn" onClick={handleCommentClick}>
          <i  className="bi bi-chat"></i>
          <span>{post.commentsCount || 0} </span>
        </button>
      </div>
    </div>
  );
}

export default PostCard;