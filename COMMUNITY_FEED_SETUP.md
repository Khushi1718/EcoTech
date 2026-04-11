# 🌿 EcoTech Community Feed - Complete Setup Guide

## ✅ What's Been Implemented (100% READY)

### Frontend Components
- ✅ **Community.jsx**: Feed page with posts, tag filtering, real-time refresh
- ✅ **CreatePostModal.jsx**: Image upload (base64), caption, tag selection
- ✅ **Sidebar.jsx**: New post button + tag sidebar with callback mechanism
- ✅ **PostCard.jsx**: Post display with likes, timestamps, tag badges
- ✅ **Axios API Client**: Pre-configured with baseURL `http://localhost:5001`

### Backend Setup
- ✅ **Express Server**: CORS enabled, body parsing (10MB limit), MongoDB connected
- ✅ **Post Model**: userId, username, caption, imageURL, tag, likes, createdAt
- ✅ **API Routes**:
  - `POST /api/posts` - Create new post
  - `GET /api/posts` - Fetch all posts (sorted by latest)
  - `GET /api/posts/tag/:tag` - Filter by tag
  - `POST /api/posts/:id/like` - Like a post
  - `DELETE /api/posts/:id` - Delete post

### Data Flow
1. User clicks "+ new post" → Modal opens
2. Selects image, writes caption, picks tag
3. Submits → Base64 image sent to backend
4. Backend saves to MongoDB
5. Frontend refreshes without page reload
6. New post appears instantly

---

## 🚀 How to Run

### Prerequisites
- Node.js & npm installed
- MongoDB Atlas URI in `.env` (backend folder)
- Ports 5001 (backend) & 5173 (frontend) available

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecotech
# PORT=5001
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5001
- Community Feed: http://localhost:5173/community (after login)

---

## 🧪 Testing the Feature

### Step 1: Login/Signup
1. Go to http://localhost:5173/login
2. Sign up with any credentials
3. Navigate to /community

### Step 2: Create Your First Post
1. Click **"+ new post"** button in sidebar
2. Upload an image (jpg, png, gif)
3. Write a caption: "Just installed a water-saving device! 💧"
4. Select tag: "save water"
5. Click **"Post"**

### Step 3: Verify in Database
Expected result:
- Post appears instantly in feed
- Shows your username, avatar initial
- Displays timestamp (e.g., "Just now")
- Shows tag badge: `#save water`
- Image loads correctly

### Step 4: Test Filtering
1. Click "save electricity" tag on left sidebar
2. Feed updates to show only that tag
3. Click "Clear Filter" to reset

### Step 5: Test Likes
1. Click ❤️ on any post
2. Like count increments
3. Refresh page - like count persists (saved in DB)

---

## 🔧 Architecture Details

### File Structure
```
frontend/
  └─ src/
     ├─ components/
     │  ├─ CreatePostModal.jsx (form + base64 upload)
     │  ├─ PostCard.jsx (display + likes)
     │  └─ Sidebar.jsx (button + callback)
     ├─ pages/
     │  └─ Community.jsx (feed + tag filter)
     └─ api/
        └─ axios.js (baseURL: http://localhost:5001)

backend/
  ├─ server.js (express + cors + routes)
  ├─ models/
  │  └─ Post.js (mongoose schema)
  ├─ routes/
  │  └─ postRoutes.js (all endpoints)
  └─ config/
     └─ db.js (mongoose.connect)
```

### Request/Response Flow

**Create Post:**
```javascript
// Frontend sends
POST /api/posts HTTP/1.1
{
  "userId": "user_123",
  "username": "john_doe",
  "caption": "Saved water today!",
  "tag": "save water",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}

// Backend returns
HTTP/1.1 201 Created
{
  "_id": "ObjectId(...)",
  "userId": "user_123",
  "username": "john_doe",
  "caption": "Saved water today!",
  "imageURL": "data:image/jpeg;base64,...",
  "tag": "save water",
  "likes": 0,
  "createdAt": "2024-04-12T10:30:00.000Z"
}
```

**Fetch Posts:**
```javascript
// Frontend sends
GET /api/posts HTTP/1.1

// Backend returns
HTTP/1.1 200 OK
[
  {
    "_id": "...",
    "username": "john_doe",
    "caption": "...",
    "imageURL": "data:image/jpeg;base64,...",
    "tag": "save water",
    "likes": 5,
    "createdAt": "2024-04-12T10:30:00.000Z"
  },
  ...
]
```

---

## 🐛 Troubleshooting

### Issue: "POST /api/posts returned 403"
**Cause**: Port 5000/5001 might be blocked by AirTunes on macOS
**Fix**: Change backend PORT to 5002 in `.env` and update frontend axios baseURL

### Issue: "Posts not showing in feed"
**Checklist**:
1. Backend running? `npm start` in backend folder
2. MongoDB connected? Check server logs for "MongoDB connected"
3. Frontend can reach API? Check browser console for CORS errors
4. Using correct port? Frontend axios should point to localhost:5001

### Issue: "Image not displaying"
**Cause**: Base64 strings might be too large
**Fix**: Compress images before upload or use Cloudinary (optional)

### Issue: "CORS Error: Access-Control-Allow-Origin"
**Fix**: Backend already has `app.use(cors())` enabled. If still issues:
```javascript
// In backend/server.js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

---

## ✨ Features Included

| Feature | Status | Details |
|---------|--------|---------|
| Create post with image | ✅ | Base64 upload, 10MB limit |
| Tags (5 options) | ✅ | save water, public transport, save electricity, tree planting, composting |
| Tag filtering | ✅ | Click tag to filter, click again to clear |
| Like posts | ✅ | Increments count, persists in DB |
| Infinite scroll | ⏳ | Shows all posts (pagination ready) |
| User avatars | ✅ | Shows username initial in colored circle |
| Timestamps | ✅ | "Just now", "2h ago", etc. |
| Empty state UI | ✅ | Shows when no posts |
| Loading state | ✅ | Spinner while fetching |
| Error handling | ✅ | User-friendly messages |
| Responsive design | ✅ | Tailwind CSS |

---

## 🎯 Next Steps (Optional Enhancements)

1. **Comments**: Add `comments: [{ username, text, date }]` to Post schema
2. **Cloud Storage**: Integrate Cloudinary for image compression
3. **User-specific posts**: Create `/api/user/:userId/posts`
4. **Unfollow/Follow**: Add follower system
5. **Search**: Add post search by caption/username
6. **Notifications**: Real-time notifications for likes/comments
7. **Edit/Delete**: User can edit/delete own posts

---

## 📋 Summary

| Component | Status | Works With |
|-----------|--------|-----------|
| Frontend API calls | ✅ Axios | Backend /api/posts |
| Image upload | ✅ Base64 | MongoDB imageURL field |
| Tag filtering | ✅ Frontend | Post.tag field |
| Auto-refresh | ✅ Callback | No page reload needed |
| Like system | ✅ API | MongoDB likes counter |
| Error handling | ✅ Complete | User alerts |

**Everything is connected and ready to use!** 🚀

Start the backend, start the frontend, and test the complete flow from user click → data save → instant display. Enjoy! 🌱
