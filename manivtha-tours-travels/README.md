# Manivtha Tours & Travels

A modern, professional, fully responsive AI-powered travel website for **Manivtha Tours & Travels** (Hyderabad, India) with an integrated AI Travel FAQ Chatbot.

## Project Structure

```
/manivtha-tours-travels
├── backend/            # Express, Mongoose & Gemini AI API
└── frontend/           # React, Vite, Tailwind CSS & Framer Motion
```

## Features

- **Home Page**: Interactive stats counters, core services grid, fleet highlights, customer reviews slider.
- **About Page**: Mission, vision, core values, and team chauffeurs showcase.
- **Services Page**: Comprehensive listing of packages (Airport, Outstation, Corporate, Wedding) with hover cards.
- **Fleet Page**: Real-time category filtering (Sedan, SUV, Innova, Tempo Traveller) and details.
- **Contact Page**: Modern booking enquiry form.
- **AI FAQ Chatbot**: Floating assistant & full dashboard page with voice input, chat history, transcript export, and ratings feedback.
- **Admin Dashboard**: Live metrics for chat requests, visitor trends, average ratings, and enquiries log list.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or runs via local JSON files fallback)
- Gemini API Key (obtained from Google AI Studio)

### Installation
1. Install dependencies for all components:
   ```bash
   npm run install-all
   ```

2. Set up environment variables in both `/backend/.env` and `/frontend/.env` based on the `.env.example` templates.

### Running Locally
To launch both backend (on port 5000) and frontend (on port 5173) concurrently:
```bash
npm run dev
```

## Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/manivtha
GEMINI_API_KEY=AIzaSy...
ADMIN_PASSCODE=admin123
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

## Deployment

### Backend (e.g., Render)
1. Deploy from the `/backend` directory or root workspace.
2. In Render dashboard, set **Build Command** to `npm install` (under the backend root directory context).
3. Set **Start Command** to `node src/server.js`.
4. Configure all environment variables (`MONGODB_URI`, `GEMINI_API_KEY`, `ADMIN_PASSCODE`).

### Frontend (e.g., Vercel)
1. Deploy using `/frontend` as the Root Directory.
2. Set **Build Command** to `npm run build`.
3. Set **Output Directory** to `dist`.
4. Configure `VITE_API_URL` environment variable pointing to your deployed backend URL.
