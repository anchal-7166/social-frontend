import React from 'react';
import { Container } from 'react-bootstrap';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Container>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="navbar-brand">Social Post</div>
          
          {user && (
            <div className="user-info">
              <div className="profile-circle">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#000', fontWeight: '500' }}>
                {user.username}
              </span>
              <button className="btn-logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}

export default Navbar;