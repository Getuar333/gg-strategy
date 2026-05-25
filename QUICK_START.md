# 🚀 Quick Start Guide - G.G Strategy TypeScript Refactor

## Step 1: Database Setup

```bash
# Open MySQL
mysql -u root -p

# Create database
CREATE DATABASE gg_strategy;
USE gg_strategy;

# Run migrations
source backend/database/migrations.sql;
```

## Step 2: Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Verify .env configuration
# Update database credentials in .env if needed

# Start backend server
npm run dev
# Expected output: Server running on http://localhost:3000
```

## Step 3: Frontend Installation

```bash
cd frontend

# Install dependencies
npm install

# Verify .env has VITE_API_URL
# Should be: VITE_API_URL=http://localhost:3000/api

# Start frontend server
npm run dev
# Expected output: Local: http://localhost:5173
```

## Step 4: Test the Application

1. **Open Browser**: http://localhost:5173
2. **Register**: Create a new account
3. **Login**: Use your credentials
4. **Verify Features**:
   - ✅ Dashboard displays with poppy background
   - ✅ Sidebar shows gradient colors
   - ✅ Buttons have vibrant gradients
   - ✅ Create/Edit/Delete tasks work
   - ✅ Create/Edit/Delete notes work
   - ✅ Settings page accessible
   - ✅ Logout clears cookies

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database Connection Error
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Ensure gg_strategy database exists

### CORS Errors
- Backend CORS should have `credentials: true`
- Frontend axios should have `withCredentials: true`
- Check FRONTEND_URL in backend .env

### TypeScript Errors
```bash
cd frontend
npm run type-check  # Check for type errors
npm run build       # Full build with type checking
```

### Token Expiry Issues
- Check JWT_SECRET and JWT_REFRESH_SECRET in .env
- Verify NODE_ENV (affects cookie security)
- Clear browser cookies and retry

## Build for Production

### Backend
```bash
# Already ES modules, just run with Node
node backend/server.js
```

### Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder with optimized build
```

## API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/me | Get current user |
| POST | /api/tasks | Create task |
| GET | /api/tasks | Get all tasks |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

**Version**: 1.0.0 TypeScript Refactor | **Status**: ✅ Ready

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option 2: Single Terminal (Windows)**

```batch
@echo off
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
```

## 📋 Complete Setup Checklist

- [ ] Database configured in MySQL
- [ ] `database/gg_strategy.sql` executed
- [ ] Backend `.env` file created with credentials
- [ ] Frontend `.env` file created
- [ ] `npm install` completed in both directories
- [ ] Gmail app password configured
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can create test account
- [ ] Can create test task
- [ ] Can schedule test meeting

## 🧪 Test Account

Use these credentials to test:

**Register:**
- Full Name: Test User
- Email: test@example.com
- Password: TestPassword123
- Confirm: TestPassword123

## 📊 Troubleshooting Commands

**Check if ports are in use:**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :3000
lsof -i :5173
```

**Kill process on Windows:**
```bash
taskkill /PID <PID> /F
```

**Clear npm cache:**
```bash
npm cache clean --force
```

**Reinstall dependencies:**
```bash
rm -r node_modules package-lock.json
npm install
```

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

## 📧 Email Setup

1. Visit: https://myaccount.google.com/apppasswords
2. Select: Mail and Windows Computer
3. Generate and copy password
4. Paste in backend `.env` as `EMAIL_PASS`

## 💾 Database Commands

**Connect to database:**
```bash
mysql -h localhost -u root -p
```

**Show tables:**
```sql
USE gg_strategy;
SHOW TABLES;
```

**Check users:**
```sql
SELECT id, full_name, email, created_at FROM users;
```

**Clear database (careful!):**
```sql
DROP DATABASE gg_strategy;
```

## 🐛 Debug Mode

Add to backend `.server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

Check browser DevTools:
1. Press F12
2. Go to Network tab
3. Make API calls
4. Check response

## 📈 Performance

**Check backend logs:**
```bash
npm run dev 2>&1 | tee backend.log
```

**Frontend build size:**
```bash
npm run build
```

## 🚀 Deployment Quick Commands

**Build Frontend:**
```bash
cd frontend
npm run build
# Output in: frontend/dist
```

**Build Backend:**
```bash
cd backend
npm run build
# Already ready, just run npm start
```

---

**Everything is ready to go! Happy coding! 🎉**
