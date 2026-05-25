# ⚡ G.G Strategy - 5-Minute Quick Start

## 🎯 TL;DR - Get Running in 5 Minutes

### Prerequisites
- Node.js (v16+)
- MySQL running
- Two terminal windows

---

## Step 1️⃣: Database (1 minute)

```bash
# MySQL Workbench:
# 1. Open MySQL Workbench
# 2. File → Open SQL Script
# 3. Select: database/gg_strategy.sql
# 4. Execute (click ⚡)
# Done!
```

---

## Step 2️⃣: Backend (2 minutes)

```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env

# IMPORTANT: Edit .env file
# Update: DB_HOST, DB_USER, DB_PASSWORD
# Update: EMAIL_USER, EMAIL_PASS (optional for emails)

npm run dev
# Wait for: ✅ Database connected successfully
```

---

## Step 3️⃣: Frontend (2 minutes)

```bash
# Terminal 2 - Frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Automatically opens http://localhost:5173
```

---

## 🎮 Test It!

### Register
- Go to: http://localhost:5173/register
- Email: test@example.com
- Password: TestPassword123

### Login
- Go to: http://localhost:5173/login
- Use the credentials you just created

### Try Features
1. Create a task ➕
2. Schedule a meeting 📅
3. Complete a task ✓
4. Check stats 📊

---

## 🔧 Environment Variables

### Backend `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gg_strategy
JWT_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📁 Directory Structure

```
GG Strategy/
├── frontend/          ← npm run dev here (port 5173)
├── backend/           ← npm run dev here (port 3000)
├── database/          ← Import gg_strategy.sql
└── README.md          ← Full documentation
```

---

## 🚨 Troubleshooting

### "Cannot connect to database"
```
✓ MySQL is running?
✓ Username/password correct?
✓ Database exists: gg_strategy?
```

### "Port 3000/5173 already in use"
```bash
# Windows: Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID 12345 /F
```

### "Email not sending"
```
✓ Did you add EMAIL_USER and EMAIL_PASS?
✓ Did you restart backend after updating .env?
✓ Gmail app password correct? (16 chars, spaces removed)
```

---

## 📚 Full Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Full project overview |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment |
| [backend/README.md](backend/README.md) | API documentation |
| [frontend/README.md](frontend/README.md) | Frontend details |

---

## 🎯 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React App |
| Backend | http://localhost:3000 | API Server |
| API Docs | http://localhost:3000/api | Check health |

---

## 💡 Tips

- **Auto-reload**: Changes automatically refresh
- **Clear browser cache** if styles don't update
- **Check console** (F12) for errors
- **Backend logs** show what's happening
- **Email**: Check spam folder!

---

## ✅ You're Done!

When you see these messages:

**Backend:**
```
🚀 G.G Strategy Backend Server running on http://localhost:3000
✅ Database connected successfully
```

**Frontend:**
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
```

**You're ready to go! 🎉**

---

## 🚀 Next: Production

When ready to deploy:

1. Frontend → Netlify (`npm run build`)
2. Backend → Render/Heroku
3. Database → AWS RDS / GCP SQL
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for details

---

**G.G Strategy - Ready to Master Your Productivity! 🎯**
