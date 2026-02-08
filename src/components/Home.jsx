import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import FilterButtons from '../components/FilterButtons';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

const API_URL = 'http://localhost:5000/api';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2); // Show 5 posts per page

  useEffect(() => {
    loadUser();
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, activeFilter, posts]);

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort filter
    switch (activeFilter) {
      case 'most-liked':
        filtered.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
        break;
      case 'most-commented':
        filtered.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
        break;
      default:
        // 'all' - keep default order (newest first)
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setPosts([res.data.data, ...posts]);
      setCurrentPage(1); // Go to first page to see new post
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create post'
      };
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.map(post =>
        post._id === postId ? res.data.data : post
      ));
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

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5; // Show max 5 page buttons

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Smart pagination
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      
      <Container className="home-container">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CreatePost user={user} onCreatePost={handleCreatePost} />

        <FilterButtons
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h5>No posts found</h5>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          <>
            {/* Display current page posts */}
            {currentPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={handleLike}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="pagination-container justify-content-center mt-4">
                <Pagination.First 
                  onClick={() => paginate(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                />
                
                {getPageNumbers().map((number, index) => (
                  number === '...' ? (
                    <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                  ) : (
                    <Pagination.Item
                      key={number}
                      active={number === currentPage}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Pagination.Item>
                  )
                ))}
                
                <Pagination.Next 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => paginate(totalPages)} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}

            {/* Show current page info */}
            <div className="text-center text-muted mt-2 mb-4">
              Showing {indexOfFirstPost + 1} - {Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} posts
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Home;