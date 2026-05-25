# 🎯 G.G Strategy - Premium Productivity & Planning Application

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-proprietary-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

**Master your productivity. Organize your life. Achieve your goals.**

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Support](#support)

## 🌟 Overview

G.G Strategy is a **premium, full-stack web application** designed for professionals and students who want to:

- 📋 Organize daily tasks and responsibilities
- 📅 Plan and manage meetings efficiently
- 📊 Track productivity metrics
- 📧 Receive automated email reminders
- 🎨 Use an intuitive, dark-themed interface
- 🔒 Keep data secure with authentication

Perfect for:
- Project managers
- Students
- Entrepreneurs
- Remote workers
- Teams seeking better productivity

## ✨ Features

### 🔐 Authentication System
- **User Registration**: Secure signup with validation
- **Login**: JWT-based authentication with token storage
- **Session Management**: Persistent login sessions
- **Profile Management**: Update personal information
- **Logout**: Clear session and tokens

### 📝 Task Management
- Create, edit, and delete tasks
- Set priorities (Low, Medium, High)
- Assign categories and color labels
- Set due dates and times
- Track task status (Pending, In Progress, Completed, Cancelled)
- Mark tasks as complete
- Filter by status and date range
- Upcoming tasks preview

### 📅 Meeting Management
- Schedule meetings with details
- Add location and meeting links
- Include attendees list
- Set meeting times and duration
- Automatic reminders
- View upcoming meetings
- Edit and manage meetings

### 📊 Productivity Dashboard
- Real-time statistics
- Task completion tracking
- Productivity score calculation
- Meeting schedules
- Motivational quotes
- Quick action buttons
- Visual analytics

### 📧 Email Notifications
- Automated task reminders
- Meeting notifications
- Deadline alerts
- Customizable reminder times
- Email templates

### 🎨 User Interface
- Dark premium theme
- Beautiful gradients and animations
- Smooth transitions
- Responsive design (Mobile, Tablet, Desktop)
- Intuitive navigation
- Professional typography
- Productivity-focused design

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18.2** | UI Framework |
| **Vite** | Build Tool |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **React Router** | Navigation |
| **Axios** | HTTP Client |
| **React Icons** | Icon Library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **MySQL2** | Database Driver |
| **JWT** | Authentication |
| **bcryptjs** | Password Hashing |
| **Nodemailer** | Email Service |
| **CORS** | Cross-Origin Support |

### Database
| Component | Details |
|-----------|---------|
| **MySQL** | Relational Database |
| **Tables** | Users, Tasks, Meetings, Notifications, Stats |
| **Indexes** | Optimized queries |
| **Relations** | Foreign keys, constraints |

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ and npm
- **MySQL** 5.7+
- **Git**
- **Text Editor** (VS Code recommended)

### Installation (5 minutes)

1. **Clone/Setup Project**
   ```bash
   cd GG\ Strategy
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npm run dev
   ```

3. **Setup Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Setup Database**
   - Open MySQL Workbench
   - Import `database/gg_strategy.sql`

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

**See [QUICK_START.md](QUICK_START.md) for detailed commands**

## 📁 Project Structure

```
GG Strategy/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── context/         # React Context (Auth)
│   │   ├── assets/          # Static files
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                  # Express Server
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── models/              # Data models
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── database/
│   └── gg_strategy.sql      # Complete database schema
│
└── Documentation
    ├── SETUP_GUIDE.md       # Complete setup instructions
    ├── QUICK_START.md       # Quick reference commands
    ├── DEPLOYMENT.md        # Production deployment
    └── README.md            # This file
```

## 📖 Documentation

### Essential Guides
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete step-by-step setup
- **[QUICK_START.md](QUICK_START.md)** - Quick reference and troubleshooting
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[frontend/README.md](frontend/README.md)** - Frontend structure guide

### API Routes

#### Authentication
```
POST   /api/auth/register      - Create new account
POST   /api/auth/login         - User login
GET    /api/auth/me            - Get current user
PUT    /api/auth/profile       - Update profile
```

#### Tasks
```
GET    /api/tasks              - Get all tasks
POST   /api/tasks              - Create task
PUT    /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Delete task
PATCH  /api/tasks/:id/complete - Mark complete
GET    /api/tasks/upcoming     - Upcoming tasks
```

#### Meetings
```
GET    /api/meetings           - Get all meetings
POST   /api/meetings           - Schedule meeting
PUT    /api/meetings/:id       - Update meeting
DELETE /api/meetings/:id       - Delete meeting
GET    /api/meetings/upcoming  - Upcoming meetings
```

#### Notifications
```
GET    /api/notifications      - Get notifications
PATCH  /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id  - Delete notification
```

#### Statistics
```
GET    /api/stats/today        - Today's stats
GET    /api/stats/range        - Stats for date range
```

## 🌐 Deployment

### One-Click Deployment

**Frontend:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Backend:** [![Deploy to Render](https://render.com/images/render-deployment-badge.svg)](https://render.com)

### Production Setup

1. **Frontend (Netlify)**
   - Build: `npm run build`
   - Publish: `dist/`
   - Environment: Set `VITE_API_URL`

2. **Backend (Render/Heroku)**
   - Update environment variables
   - Point to production database
   - Set secure JWT secret

3. **Database (AWS RDS/GCP SQL)**
   - Create managed database instance
   - Import schema
   - Enable backups

**[See DEPLOYMENT.md for detailed instructions](DEPLOYMENT.md)**

## 🔒 Security

### Built-in Security Features
✅ **Password Hashing** - bcryptjs with salt rounds
✅ **JWT Authentication** - Secure token-based auth
✅ **Input Validation** - All inputs validated
✅ **SQL Injection Prevention** - Parameterized queries
✅ **CORS Protection** - Configured origins
✅ **Environment Variables** - Sensitive data secured
✅ **Error Handling** - Safe error messages
✅ **Database Constraints** - Referential integrity

### Security Checklist
- [ ] Change JWT_SECRET in production
- [ ] Use strong database password
- [ ] Enable HTTPS everywhere
- [ ] Set CORS to specific domain
- [ ] Enable database encryption
- [ ] Regular security audits
- [ ] Monitor access logs
- [ ] Keep dependencies updated

## 📊 Performance

- **Frontend**: Optimized with Vite (instant reload)
- **Backend**: Connection pooling for database
- **Database**: Indexed queries for fast retrieval
- **Caching**: Strategic header caching
- **Compression**: gzip enabled

## 🧪 Testing

### Manual Testing
1. Create account
2. Create task
3. Schedule meeting
4. Complete task
5. Check email notification

### Automated Testing
```bash
# Backend tests
npm test

# Frontend tests
npm test
```

## 📈 Future Enhancements

- [ ] Calendar view with drag-and-drop
- [ ] Recurring tasks and meetings
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] AI-powered suggestions
- [ ] Integration with Google Calendar
- [ ] Slack notifications
- [ ] Multi-language support

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
# Verify .env credentials
# Check database exists: gg_strategy
```

**Email Not Sending**
```bash
# Verify Gmail app password
# Check 2FA is enabled
# Check EMAIL_USER in .env
```

**CORS Errors**
```bash
# Check backend CORS configuration
# Verify FRONTEND_URL in backend .env
# Check API_URL in frontend .env
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

**[See QUICK_START.md for more troubleshooting](QUICK_START.md)**

## 📞 Support & Contact

### Getting Help
1. Check the documentation files
2. Review the troubleshooting guide
3. Check console for errors
4. Review backend logs

### Reporting Issues
- Document the issue clearly
- Include steps to reproduce
- Share error messages
- Check existing issues

## 👨‍💻 Development

### Code Style
- ES6+ JavaScript
- Functional React components
- Consistent naming conventions
- Comments for complex logic
- Clean code principles

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
```

## 📄 License

This project is proprietary and for authorized use only.

## 🎉 Credits

Built with attention to detail and modern best practices.

---

## 🚀 Get Started Now!

```bash
# Quick setup
cd "GG Strategy"
./setup.bat        # Windows
# or
./setup.sh         # Mac/Linux
```

Then visit: **http://localhost:5173**

---

**G.G Strategy - Master Your Life, One Task at a Time**

*Premium Productivity • Professional Design • Secure & Reliable*

**Version 1.0.0 | Production Ready | Fully Functional**
