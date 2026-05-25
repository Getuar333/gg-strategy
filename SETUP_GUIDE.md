# G.G Strategy - Complete Setup & Deployment Guide

## 📋 Project Overview

**G.G Strategy** is a premium, full-stack productivity and planning web application that helps users organize their daily life, manage tasks, plan meetings, track productivity, and use an interactive calendar with email notifications.

## 🏗️ Complete Project Structure

```
GG Strategy/
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── MeetingCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SidebarToggle.jsx
│   │   ├── pages/               # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/            # API services
│   │   │   ├── apiClient.js
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   ├── meetingService.js
│   │   │   ├── statsService.js
│   │   │   └── notificationService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── assets/              # Static files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── backend/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   └── email.js             # Nodemailer setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── meetingController.js
│   │   ├── notificationController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── meetingRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Meeting.js
│   │   ├── Notification.js
│   │   └── ProductivityStats.js
│   ├── utils/
│   │   └── validators.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── database/
    └── gg_strategy.sql          # Complete MySQL schema
```

## 🚀 Getting Started - Step by Step

### Part 1: Database Setup

1. **Open MySQL Workbench**
2. **Create a new connection** (if you don't have one)
3. **Execute the SQL schema:**
   - Open the file: `database/gg_strategy.sql`
   - Copy all the SQL code
   - Paste it in MySQL Workbench and execute

This will create:
- Database: `gg_strategy`
- Tables: users, tasks, meetings, notifications, productivity_stats
- Proper indexes and relationships

### Part 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=WJ28@krhps
   DB_NAME=gg_strategy
   DB_PORT=3306

   JWT_SECRET=supersecretkey123
   JWT_EXPIRE=7d

   PORT=3000
   NODE_ENV=development

   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password

   FRONTEND_URL=http://localhost:5173
   API_URL=http://localhost:3000/api
   ```

5. **Start backend server:**
   ```bash
   npm run dev
   ```
   
   Expected output:
   ```
   🚀 G.G Strategy Backend Server running on http://localhost:3000
   📧 Email notifications: Enabled
   🔒 JWT Authentication: Active
   ```

### Part 3: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   This will open http://localhost:5173 automatically

### Part 4: Email Configuration

To enable email notifications:

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Make sure 2-step verification is enabled
   - Select "Mail" → "Windows Computer"
   - Generate app password
   - Copy the 16-character password

2. **Update backend `.env`:**
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

3. **Restart backend server**

## 🧪 Testing the Application

### 1. Register a New Account
- Go to http://localhost:5173/register
- Fill in credentials:
  - Full Name: John Doe
  - Email: john@example.com
  - Password: Password123
  - Confirm Password: Password123

### 2. Create Tasks
- Click "Create New Task" button
- Fill in task details:
  - Title: "Complete Project"
  - Description: "Finish the final phase"
  - Priority: High
  - Due Date: Tomorrow
  - Category: Work

### 3. Schedule Meetings
- Click "Schedule Meeting" button
- Fill in meeting details:
  - Title: "Team Standup"
  - Location: "Conference Room"
  - Date: Today
  - Time: 10:00 - 11:00

### 4. Test Email Notifications
- Complete a task to trigger notifications
- Check your email for G.G Strategy notifications

## 📦 Build & Deployment

### Frontend Deployment (Netlify)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Set environment variable:**
   - In Netlify dashboard → Settings → Environment
   - Add: `VITE_API_URL=https://your-backend-api.com`

### Backend Deployment (Render)

1. **Create Render account** at https://render.com

2. **Create new Web Service**
   - Connect your GitHub repository
   - Choose "Node"
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set environment variables:**
   ```
   DB_HOST=your-mysql-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=gg_strategy
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

### Database Deployment (AWS RDS)

1. **Create MySQL instance on AWS RDS**
2. **Run SQL schema on RDS**
3. **Update backend `.env` with RDS endpoint**

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS on production
- [ ] Set CORS to specific domain
- [ ] Use strong database passwords
- [ ] Enable database encryption
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Use API rate limiting

## 📊 Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Protected routes
- ✅ Profile management
- ✅ Logout functionality

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Priority levels (low, medium, high)
- ✅ Categories and color labels
- ✅ Task status tracking
- ✅ Due date and time management
- ✅ Mark tasks as complete
- ✅ Filter by status and date range

### Meeting Management
- ✅ Schedule meetings
- ✅ Add attendees
- ✅ Set location and meeting links
- ✅ Meeting notifications
- ✅ Edit and delete meetings
- ✅ View upcoming meetings

### Notifications
- ✅ Email reminders for tasks
- ✅ Meeting reminders
- ✅ Automatic email sending
- ✅ Notification history
- ✅ Mark notifications as read

### Dashboard
- ✅ Productivity statistics
- ✅ Task completion tracking
- ✅ Upcoming tasks preview
- ✅ Meeting schedule
- ✅ Motivational quotes
- ✅ Quick action buttons

### UI/UX
- ✅ Dark premium theme
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Beautiful gradients
- ✅ Professional typography
- ✅ Modern components

## 🛠️ Troubleshooting

### Backend won't connect to database
```bash
# Check MySQL is running
# Verify credentials in .env
# Check database exists: gg_strategy
```

### Email not sending
```bash
# Verify Gmail app password is correct
# Check 2-factor authentication is enabled
# Verify email address matches
# Check backend logs
```

### Frontend can't reach backend
```bash
# Ensure backend is running on port 3000
# Check CORS is enabled
# Verify VITE_API_URL in .env
# Check network tab in browser DevTools
```

### Port already in use
```bash
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
# Kill process: taskkill /PID <PID> /F
```

## 📚 API Documentation

### Authentication

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### Tasks

**Create Task:**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Project",
  "description": "Finish phase 1",
  "priority": "high",
  "category": "work",
  "dueDate": "2024-12-31",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Get Upcoming Tasks:**
```http
GET /api/tasks/upcoming?days=7
Authorization: Bearer <token>
```

## 🎯 Next Steps for Enhancement

- [ ] Add calendar view with drag-and-drop
- [ ] Implement recurring tasks
- [ ] Add task templates
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Mobile app version
- [ ] Offline mode
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Integration with Google Calendar

## 📞 Support

For issues or questions:
1. Check the README files in backend and frontend folders
2. Review the troubleshooting section
3. Check browser console for errors
4. Check backend logs in terminal

## 📄 License

This project is private and for personal use.

---

**Happy Productivity! 🚀**

**G.G Strategy - Master Your Life, One Task at a Time**
