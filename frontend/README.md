# G.G Strategy - Frontend

Premium Productivity & Planning Web Application

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:3000/api
```

## Available Scripts

### `npm run dev`
Start the development server on http://localhost:5173

### `npm run build`
Build the project for production

### `npm run preview`
Preview the production build

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── context/          # React Context (Auth)
│   ├── assets/           # Static assets
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies
```

## Components

- **Button**: Reusable button component with variants
- **Modal**: Dialog component for forms and confirmations
- **StatCard**: Dashboard statistics card
- **TaskCard**: Task display component
- **MeetingCard**: Meeting display component
- **NotificationItem**: Notification display
- **ProtectedRoute**: Route protection for authenticated users

## Technologies Used

- React 18.2
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion
- React Icons
