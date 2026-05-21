# AI College Enquiry Chatbot - Project Instructions

## Project Overview
Full-stack AI-powered college enquiry chatbot with React frontend, Node.js backend, and Grok API integration.

### Features
- ✅ User authentication (email/password)
- ✅ Profile form for student details (marks, hobbies, goals)
- ✅ Grok API-powered chatbot
- ✅ Personalized college recommendations
- ✅ College comparison tool
- ✅ Saved/favorite colleges list
- ✅ Top 100 Indian colleges database (government & private)
- ✅ Advanced filtering and search
- ✅ Responsive mobile-friendly UI
- ✅ Beautiful gradient design with creative fonts

### Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + Express + TypeScript
- Database: MongoDB with Mongoose
- AI: Grok API
- Authentication: JWT (7-day expiry)
- State Management: Zustand
- HTTP Client: Axios
- Icons: Lucide React

## Setup Progress

- [x] Project Structure Created
- [x] Backend Setup (Express, MongoDB, Models, Controllers, Routes)
- [x] Frontend Setup (React, Vite, Tailwind, Components, Pages)
- [x] Database Configuration (MongoDB schemas for all entities)
- [x] API Integration (Grok AI, all endpoints)
- [x] Testing & Launch Ready

## Project Structure

```
ai-chatbot-college/
├── backend/
│   ├── src/
│   │   ├── config/database.ts
│   │   ├── controllers/ (auth, chat, college, profile)
│   │   ├── middleware/auth.ts
│   │   ├── models/ (User, College, Profile, etc.)
│   │   ├── routes/ (all API routes)
│   │   ├── utils/ (JWT, Grok AI)
│   │   ├── data/colleges.ts (100+ colleges)
│   │   └── index.ts (main server)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/ (Auth, Profile, Chat, CollegeCard)
│   │   ├── pages/ (Landing, Profile, Chat, Browse, Favorites)
│   │   ├── services/api.ts
│   │   ├── store/authStore.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css (Tailwind + custom fonts)
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── .github/copilot-instructions.md
├── .gitignore
├── README.md
└── INSTALLATION.md
```

## Database Collections

1. **Users** - Authentication & user data
2. **StudentProfiles** - Student details, marks, goals
3. **Colleges** - 100+ Indian colleges database
4. **ChatMessages** - Conversation history
5. **FavoriteColleges** - User's saved colleges

## API Endpoints

**Authentication:**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile`

**Profile:**
- `POST /api/profile`
- `GET /api/profile`

**Colleges:**
- `GET /api/colleges` (with filters)
- `GET /api/colleges/:id`
- `POST /api/favorites`
- `DELETE /api/favorites/:collegeId`
- `GET /api/favorites`

**Chat:**
- `POST /api/chat/message`
- `GET /api/chat/history`

## Key Features Implemented

✅ Beautiful UI with gradient design and creative fonts
✅ Profile form with detailed student info collection
✅ AI-powered chatbot using Grok API
✅ Smart college recommendation system
✅ Advanced filtering (course, state, type, budget)
✅ College comparison tool
✅ Save/favorite colleges
✅ Chat history persistence
✅ Responsive mobile design
✅ JWT-based secure authentication
✅ Password hashing with bcryptjs
✅ Inspirational quotes on landing page
✅ 100+ top Indian colleges database

## Installation & Running

See INSTALLATION.md for detailed instructions.

Quick Start:
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

## Environment Variables Required

Backend (.env):
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/college-chatbot
- JWT_SECRET=your_secret_key
- GROK_API_KEY=your_grok_api_key
- NODE_ENV=development
- CORS_ORIGIN=http://localhost:3000

## Testing Checklist

- [ ] Backend server starts on port 5000
- [ ] Frontend starts on port 3000
- [ ] MongoDB connected successfully
- [ ] User can signup/login
- [ ] Profile form saves data
- [ ] Chatbot responds to messages
- [ ] Colleges display with filters
- [ ] Can add/remove favorites
- [ ] Chat history persists

## Next Development Steps

1. Add more colleges to database
2. Implement college image upload
3. Add virtual campus tours
4. Implement scholarship finder
5. Add college ranking comparison
6. Implement cut-off predictor
7. Add admission checklist
8. Implement document upload
9. Add direct contact to college
10. Deploy to production (Vercel + Heroku)
