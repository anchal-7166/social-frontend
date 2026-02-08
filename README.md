## Social Post 

A modern, minimalist social media application built with React and React Bootstrap

### Prerequisites
- Node.js 14+ installed
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/social-frontend.git

# Navigate to project directory
cd social-frontend

# Install dependencies
npm install

# Start development server
npm start

# Open browser at http://localhost:3000
```

##  Built With

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI Library |
| React Router | 6.20.0 | Routing |
| React Bootstrap | 2.9.1 | UI Components |
| Bootstrap | 5.3.2 | CSS Framework |
| Bootstrap Icons | 1.11.1 | Icons |
| Axios | 1.6.2 | HTTP Client |

##  Usage Guide

### 1. Authentication

**Signup:**
```
1. Visit http://localhost:3000/signup
2. Fill in: Username, Email, Password
3. Click "Sign Up"
4. Auto redirect to home
```

**Login:**
```
1. Visit http://localhost:3000/login
2. Enter: Email, Password
3. Click "Login"
4. Redirect to home
```

## 🔌 API Integration

### Endpoints

```javascript
// Authentication
POST /api/auth/signup     // Register
POST /api/auth/login      // Login

// Posts
GET  /api/posts           // Get all posts
POST /api/posts           // Create post
GET  /api/posts/:id       // Get single post
PUT  /api/posts/:id/like  // Like/unlike
POST /api/posts/:id/comment // Add comment
```

### Request Format

```javascript
// With Authentication
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}

// With Image Upload
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'multipart/form-data'
}
```






















