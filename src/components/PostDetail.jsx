import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000/api';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUser();
    loadPost();
  }, [id]);

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadPost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data.data);
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/posts/${id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost(res.data.data);
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data.data);
    } catch (err) {
      setError('Failed to like post');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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

  const isLikedByCurrentUser = user && post?.likes?.some(
    like => like.user === user._id
  );

  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <Container className="post-detail-container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar user={user} onLogout={handleLogout} />
        <Container className="post-detail-container">
          <div className="empty-state">
            <h5>Post not found</h5>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      
      <Container className="post-detail-container">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        {/* Post Card */}
        <div className="post-card">
          <div className="post-header">
            <div className="post-avatar">
              {post.username?.charAt(0).toUpperCase()}
            </div>
            <div className="post-user-info">
              <h6>{post.username}</h6>
              <div className="post-date">{formatDate(post.createdAt)}</div>
            </div>
          </div>

          {post.text && (
            <div className="post-content">{post.text}</div>
          )}

          {post.image && (
            <img
              src={`http://localhost:5000${post.image}`}
              alt="Post"
              className="post-image"
            />
          )}

          <div className="post-divider"></div>

          <div className="post-actions">
            <button
              className={`action-btn ${isLikedByCurrentUser ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span>{isLikedByCurrentUser ? <i style={{color:"#e00606"}} className="bi bi-heart-fill"></i> : <i  className="bi bi-heart"></i>}</span>
              <span>{post.likesCount || 0}</span>

            </button>
            <button className="action-btn">
               <i  className="bi bi-chat"></i>
              <span>{post.commentsCount || 0} </span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h5>Comments</h5>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="comment-form">
            <div className="comment-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
                className="share-btn"
                disabled={!commentText.trim() || submitting}
                >
                <i className="bi bi-send-fill"></i>
            </button>
          </form>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-avatar">
                  {comment.username?.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-username">{comment.username}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-date">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default PostDetail;