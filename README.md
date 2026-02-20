# ⚖️ InCrime - Legal Document Generation Platform

> Full-Stack MERN Application | MongoDB Atlas + Express.js + React.js + Node.js

---

## 📁 PROJECT STRUCTURE

```
incrime/
├── client/                    ← React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx            ← Main router with all routes
│   │   ├── index.js           ← Entry point
│   │   ├── context/
│   │   │   └── AuthContext.js ← Global auth state (JWT)
│   │   ├── components/
│   │   │   ├── Navbar.jsx     ← Responsive navbar
│   │   │   ├── ProtectedRoute.js  ← Auth guards
│   │   │   └── UrduLegalTemplate.jsx  ← Template wrapper
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Home.jsx
│   │       ├── About.jsx
│   │       ├── HowItWorks.jsx
│   │       ├── Application.jsx
│   │       ├── Chatbot.jsx
│   │       ├── MyApplications.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── ResetPassword.jsx
│   │       └── templates/
│   │           ├── criminal/  ← 7 criminal templates
│   │           └── family/    ← 7 family templates
│   └── package.json
│
└── server/                    ← Node/Express Backend
    ├── index.js               ← Main server + seeder
    ├── .env                   ← Environment variables
    ├── config/
    │   └── db.js              ← MongoDB Atlas connection
    ├── models/
    │   ├── User.js
    │   ├── Category.js
    │   ├── Template.js
    │   ├── Application.js
    │   └── Contact.js
    ├── middleware/
    │   └── auth.js            ← JWT protect + adminOnly
    ├── routes/
    │   ├── auth.js            ← Register, Login, Forgot/Reset
    │   ├── applications.js    ← Application history
    │   ├── categories.js      ← CRUD categories
    │   ├── templates.js       ← CRUD templates
    │   ├── admin.js           ← Admin panel APIs
    │   ├── contact.js         ← Contact/Review form
    │   └── chatbot.js         ← AI chatbot responses
    └── package.json
```

---

## 🚀 INSTALLATION & SETUP

### Prerequisites
- Node.js v18+ installed
- npm v9+ installed
- Internet connection (for MongoDB Atlas)

---

### STEP 1: Setup Backend (Server)

```bash
# Navigate to server folder
cd incrime/server

# Install all dependencies
npm install

# Your .env file is already configured with MongoDB Atlas
# Verify the .env file contains:
# MONGO_URI=mongodb+srv://ikramdb:iking.546@ikramdb.m9bis7g.mongodb.net/incrime?appName=IkramDB
# JWT_SECRET=incrime_super_secret_jwt_key_2025
# PORT=5000

# Start the server (development with auto-reload)
npm run dev

# OR start in production
npm start
```

**Expected output:**
```
🚀 InCrime Server running on port 5000
📡 API: http://localhost:5000/api
✅ MongoDB Connected: ikramdb.m9bis7g.mongodb.net
✅ Admin user created: admin / Admin@123456
✅ Default categories seeded
```

---

### STEP 2: Setup Frontend (Client)

Open a NEW terminal window:

```bash
# Navigate to client folder
cd incrime/client

# Install all dependencies
npm install

# Start React development server
npm start
```

The app will open at: **http://localhost:3000**

---

## 🔐 LOGIN CREDENTIALS

| Role  | Username | Password      |
|-------|----------|---------------|
| Admin | `admin`  | `Admin@123456` |
| User  | Register via /signup |

---

## 🌐 ROUTES & PAGES

| Path | Page | Access |
|------|------|--------|
| `/login` | Login | Public |
| `/signup` | Register | Public |
| `/forgot-password` | Forgot Password | Public |
| `/` | Home | 🔒 Auth Required |
| `/about` | About InCrime | 🔒 Auth Required |
| `/how-it-works` | How It Works | 🔒 Auth Required |
| `/application` | Select Template | 🔒 Auth Required |
| `/chatbot` | AI Legal Chatbot | 🔒 Auth Required |
| `/my-applications` | My History | 🔒 Auth Required |
| `/admin` | Admin Dashboard | 🛡️ Admin Only |
| `/templates/criminal/bail-pre` | Pre-Bail Template | 🔒 Auth Required |
| `/templates/criminal/bail-post` | Post-Bail Template | 🔒 Auth Required |
| ... (all 14 templates) | ... | 🔒 Auth Required |

---

## 🛡️ ADMIN DASHBOARD FEATURES

Access at: **http://localhost:3000/admin**

| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Stats, recent users, application analytics |
| 👥 Users | View, search, activate/deactivate, delete users |
| 📋 Applications | View all generated application history |
| 📄 Templates | View, edit, delete legal templates |
| 📂 Categories | Add, edit, delete case categories |
| 💬 Reviews & Contact | View all contact forms/reviews, mark as read |

---

## 🔌 API ENDPOINTS

### Authentication
```
POST /api/auth/register      - Create account
POST /api/auth/login         - Login
GET  /api/auth/me            - Get current user (auth required)
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
PUT  /api/auth/profile       - Update profile
```

### Applications
```
POST /api/applications          - Save application history
GET  /api/applications/my       - Get my applications
PUT  /api/applications/:id/status
```

### Categories & Templates
```
GET  /api/categories            - Get all categories
POST /api/categories            - Create (admin)
PUT  /api/categories/:id        - Update (admin)
DELETE /api/categories/:id      - Delete (admin)

GET  /api/templates             - Get all templates
GET  /api/templates/all         - Get all incl. inactive (admin)
POST /api/templates             - Create (admin)
PUT  /api/templates/:id         - Update (admin)
DELETE /api/templates/:id       - Delete (admin)
```

### Admin
```
GET /api/admin/stats            - Dashboard stats
GET /api/admin/users            - All users
PUT /api/admin/users/:id/toggle - Activate/deactivate
DELETE /api/admin/users/:id     - Delete user
GET /api/admin/applications     - All applications
GET /api/admin/contacts         - All contacts/reviews
PUT /api/admin/contacts/:id/status
```

### Other
```
POST /api/contact               - Submit contact/review
POST /api/chatbot/message       - Chat with AI (auth required)
GET  /api/health                - Health check
```

---

## ✅ FEATURES IMPLEMENTED

- [x] Full MERN Stack (MongoDB Atlas + Express + React + Node)
- [x] JWT Authentication (login, register, forgot/reset password)
- [x] **Website blocked without login** (ProtectedRoute guards)
- [x] Admin Dashboard with full CRUD
- [x] Admin: Manage users (view, activate, deactivate, delete)
- [x] Admin: Manage categories
- [x] Admin: Update/delete templates
- [x] Admin: View all application history
- [x] Admin: Receive & manage contact/reviews
- [x] Email notification to admin on contact form submission
- [x] AI Legal Chatbot (connected to backend API)
- [x] Application history saved to MongoDB per user
- [x] 14 Urdu legal document templates
- [x] Print/Download functionality
- [x] Fully mobile responsive
- [x] About page
- [x] Route crash fix (all template routes working)
- [x] Dark/Light mode in chatbot

---

## 📧 EMAIL SETUP (Optional)

To enable email notifications for contact forms, edit `server/.env`:
```
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

For Gmail, create an App Password at: https://myaccount.google.com/apppasswords

---

## ⚠️ DISCLAIMER

InCrime is not affiliated with any government or legal authority. It provides AI-based assistance for educational and informational purposes only. Always consult a licensed advocate for professional legal advice.

---

© 2025 InCrime | Every Case, Every Detail
