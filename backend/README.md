# G.G Strategy - Backend

Premium Productivity & Planning Web Application Backend API
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database
1. Open MySQL Workbench
2. Run the SQL schema
3. This will create all tables automatically


### 4. Start Development Server
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Available Scripts

### `npm run dev`
Start the development server with auto-reload

### `npm start`
Start the production server

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js  # MySQL connection
│   └── email.js     # Email service
├── controllers/      # Request handlers
├── routes/          # API routes
├── middleware/      # Custom middleware
├── models/          # Data models
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json
└── .env             # Environment variables
```

## API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/upcoming` - Get upcoming tasks
- `PATCH /api/tasks/:id/complete` - Mark task complete

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `GET /api/meetings/upcoming` - Get upcoming meetings

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Stats
- `GET /api/stats/today` - Get today's stats
- `GET /api/stats/range` - Get stats for date range

## Technologies Used

- Node.js
- Express.js
- MySQL2
- JWT
- bcryptjs
- Nodemailer
- CORS

## Email Notifications

Emails are automatically sent for:
- Task reminders
- Meeting reminders
- Task deadlines
- Meeting notifications

Scheduled to run every minute.
