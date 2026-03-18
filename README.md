Vybe- It’s not just a platform. It’s a Vybe.

Vybe is a full-stack social media experience designed for real-time interaction, content sharing, and immersive user engagement.
Built with modern technologies, Vybe brings together messaging, media, and social connectivity — all in one place.

🚀 Features

🔐 Authentication & Security
Secure User Signup & Login
JWT-based Authentication
Logout functionality
OTP-based Password Recovery
Reset password using email OTP verification

👥 Social Experience
User Profiles
Follow / Unfollow Users
Personalized Feed
Explore other users

💬 Real-Time Vybe (Core Experience)
Real-time Chat (powered by Socket.io)
Instant messaging
Real-time Notifications (likes, follows, messages)

📸 Content Sharing
Post Images / Videos
Like / Unlike Posts
Comment on Posts
Share Content
Media upload & storage using Cloudinary

🎬 Loops (Reels Experience)
Short-form video content (Loops)
Like / Comment / Share Loops
Smooth scrolling video feed

📖 Stories
Upload Stories
View Stories
Auto-disappear after 24 hours
Story media upload handled via Cloudinary

☁️ Media Handling (Cloudinary Integration)
Upload images & videos for:
Posts
Stories
Loops
User profiles
Groups
Optimized media delivery via CDN
Efficient storage & fast retrieval

🛠 Tech Stack

-- Frontend --
React.js
Tailwind CSS

-- Backend --
Node.js
Express.js

-- Database --
MongoDB

-- Real-Time --
Socket.io

-- Media Storage --
Cloudinary

-- Authentication --
JWT + OTP Verification

⚙️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/sakshisrivastava1/Vybe
cd vybe
2️⃣ Install Dependencies
cd frontend && npm install
cd ../backend && npm install
3️⃣ Environment Variables

Create a .env file in the backend:
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

EMAIL_USER=your_email
EMAIL_PASS=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

▶️ Run the App
# backend
npm start

# frontend
npm run dev
🔌 Real-Time System

Vybe uses Socket.io to power:
Live chat messaging
Instant notifications
Low-latency real-time updates

🎯 Vision
Vybe is built with the idea that social media should feel alive, instant, and expressive — not just functional.

🔮 Future Enhancements
Mobile optimization
Advanced search & hashtags
Video calls
AI-based feed recommendations

👩‍💻 Author
Sakshi Srivastava
GitHub: https://github.com/sakshisrivastava1

🌐 Live Demo
👉 https://vybe-frontend-08a9.onrender.com/
