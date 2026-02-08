import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function CreatePost({ user, onCreatePost }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !image) {
      setError('Please add text or image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (text.trim()) {
      formData.append('text', text.trim());
    }
    if (image) {
      formData.append('image', image);
    }

    const result = await onCreatePost(formData);
    
    if (result.success) {
      setText('');
      setImage(null);
      setImagePreview(null);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const isPostEnabled = text.trim() || image;

  return (
    <div className="create-post-card">
      <h6>Create Post</h6>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          className="create-post-input"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={handleRemoveImage}
            >
              ×
            </button>
          </div>
        )}

        <div className="create-post-divider"></div>

        <div className="create-post-actions">
          <label htmlFor="image-upload" className="camera-btn">
            <i className="bi bi-camera"></i>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="submit"
            className="post-btn"
            disabled={!isPostEnabled || loading}
            >
            {loading ? (
                'Posting...'
            ) : (
                <>
                <i className="bi bi-send-fill share"></i> Post
                </>
            )}
        </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;