# 🚀 Quick Start Guide

Get your AI College Chatbot running in 5 minutes!

## ⚡ Prerequisites Check

```bash
# Check Node.js installation
node --version  # Should be v16 or higher

# Check npm installation
npm --version
```

If not installed, download from https://nodejs.org/

## 📦 Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend (in new terminal):**
```bash
cd frontend
npm install
```

## 🔑 Step 2: Setup Environment

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-chatbot
JWT_SECRET=your_super_secret_key_12345
GROK_API_KEY=your_grok_api_key_from_xai
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🗄️ Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace `MONGODB_URI` in .env

## 🎯 Step 4: Get Grok API Key

1. Visit https://x.ai/
2. Create account
3. Generate API key
4. Paste in `.env` as `GROK_API_KEY`

## 🚀 Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for: ✅ `Server is running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: ✅ `Local: http://localhost:3000/`

## ✨ Step 6: Test the App

1. Open browser: http://localhost:3000
2. Click "Sign Up"
3. Fill in email, password, name
4. Click "Sign Up"
5. Fill detailed profile (marks, hobbies, etc.)
6. Click "Save Profile & Continue"
7. Chat with the bot!
8. Browse colleges
9. Save favorites

## 🎓 Demo Credentials (Optional)

You can test with:
- Email: `student@example.com`
- Password: `password123`
- Name: `John Doe`

## 📝 Test Queries for Chatbot

Try asking the bot:
- "Which colleges are best for my profile?"
- "What's the placement rate at IIT Bombay?"
- "Suggest CS colleges under 15 lakhs"
- "What are the fees at VIT?"
- "Compare BITS and NIT Trichy"

## 🔍 Check Everything Works

**Backend Check:**
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

**Frontend Check:**
```
Open http://localhost:3000 in browser
Should load the landing page
```

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### MongoDB Connection Error
```bash
# Ensure MongoDB is running
mongod

# OR use MongoDB Atlas with cloud connection string
```

### Grok API Error
- Verify API key is correct
- Check key hasn't expired
- Ensure GROK_API_KEY is in .env

### CORS Error
- Ensure frontend is on http://localhost:3000
- Ensure CORS_ORIGIN in .env matches

## 📚 Project Files

```
backend/src/
├── config/database.ts      - MongoDB setup
├── controllers/            - Business logic
│   ├── authController.ts
│   ├── chatController.ts
│   ├── collegeController.ts
│   └── profileController.ts
├── models/                 - Database schemas
├── routes/                 - API endpoints
├── utils/
│   ├── jwt.ts             - Authentication
│   └── grokAI.ts          - Chatbot AI
├── data/colleges.ts       - 100+ colleges
└── index.ts               - Main server

frontend/src/
├── components/            - React components
│   ├── AuthForm.tsx
│   ├── ProfileForm.tsx
│   ├── ChatBot.tsx
│   └── CollegeCard.tsx
├── pages/                 - Full pages
│   ├── LandingPage.tsx
│   ├── ProfilePage.tsx
│   ├── CollegeBrowserPage.tsx
│   └── FavoritesPage.tsx
├── services/api.ts        - API calls
├── store/authStore.ts     - State management
├── App.tsx                - Main app
└── main.tsx               - Entry point
```

## 🎨 UI Customization

**Change Colors:** `frontend/tailwind.config.js`
**Change Fonts:** `frontend/src/index.css`
**Add Logo:** Replace text with image in `frontend/src/App.tsx`

## 📱 Test on Mobile

```bash
# Find your computer IP
ipconfig getifaddr en0  # macOS
ipconfig                # Windows

# On phone, visit
http://YOUR_IP:3000
```

## 🌐 Colleges Database

The app comes with 24 sample colleges. Add more in:
```
backend/src/data/colleges.ts
```

Format:
```typescript
{
  name: "College Name",
  type: "government" | "private",
  state: "State Name",
  city: "City Name",
  courses: ["B.Tech CS", "B.Tech ME"],
  avgFees: 200000,
  placementRate: 99,
  avgPackage: 1200000,
  ranking: 1,
  established: 1958,
  affiliatedUniversity: "Autonomous",
  website: "https://...",
  cutoff: 95
}
```

## ✅ Success Checklist

- [ ] Node.js installed (v16+)
- [ ] Both npm installs completed
- [ ] .env files created and filled
- [ ] MongoDB running
- [ ] Backend started (port 5000)
- [ ] Frontend started (port 3000)
- [ ] Can sign up
- [ ] Can fill profile
- [ ] Chat bot responds
- [ ] Can browse colleges
- [ ] Can save favorites

## 🎯 What's Next?

- Explore all pages
- Test chatbot thoroughly
- Add more colleges
- Customize UI colors
- Deploy to production
- Add more features

## 🆘 Need Help?

1. Check terminal error messages
2. Verify all prerequisites
3. Review INSTALLATION.md
4. Check .env variables
5. Ensure ports not in use
6. Verify API keys

## 🎉 You're All Set!

Start using your college recommendation chatbot now!

Happy coding! 🚀✨

---

**Backend:** http://localhost:5000
**Frontend:** http://localhost:3000
