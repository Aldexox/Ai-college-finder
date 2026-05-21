# Installation & Setup Guide

## ✅ Prerequisites

Before you begin, ensure you have:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** for version control
- **Grok API Key** from [x.ai](https://x.ai/)

## 🗂️ Project Structure

```
ai-chatbot-college/
├── backend/          # Express.js API server
├── frontend/         # React application
└── README.md
```

## 🔧 Backend Installation

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

### Step 4: Configure .env

Edit `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/college-chatbot
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-chatbot

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# AI Integration
GROK_API_KEY=your_grok_api_key_from_xai

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 5: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**OR use MongoDB Atlas** (cloud database - recommended):
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Use in MONGODB_URI

### Step 6: Start Backend Server

```bash
npm run dev
```

✅ Backend should start on `http://localhost:5000`

Check health: `http://localhost:5000/api/health`

## 🎨 Frontend Installation

### Step 1: Navigate to Frontend

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

✅ Frontend should open at `http://localhost:3000`

## 🚀 Running Both Servers

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using npm-run-all (if installed)

```bash
npm install -g npm-run-all
# From root directory
npm-run-all --parallel dev:backend dev:frontend
```

## 🔑 Getting Grok API Key

1. Visit [x.ai](https://x.ai/)
2. Create an account
3. Navigate to API section
4. Generate API key
5. Add to `.env` as `GROK_API_KEY`

## 🗄️ MongoDB Setup

### Local MongoDB

**Windows:**
```bash
# Install MongoDB Community Edition
# Then start MongoDB service
mongod
```

**macOS (with Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Create database user
5. Get connection string
6. Whitelist your IP
7. Use connection string in `MONGODB_URI`

**Example Atlas URI:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/college-chatbot?retryWrites=true&w=majority
```

## 📝 Database Seeding (Optional)

To populate colleges database:

1. Create file `backend/scripts/seedColleges.ts`
2. Run seeding script
3. Colleges will be added to MongoDB

## 🧪 Testing the Application

### 1. User Signup
- Go to http://localhost:3000
- Click "Sign Up"
- Enter email, password, name
- Submit

### 2. Create Profile
- Fill out all required fields
- Select course, marks, hobbies, goals
- Set budget and preferred states
- Submit

### 3. Chat with Bot
- Navigate to Chat page
- Ask questions like:
  - "Which colleges are best for me?"
  - "What are placement rates?"
  - "Suggest colleges under 15 lakhs"

### 4. Browse Colleges
- Go to Browse page
- Apply filters
- View college details
- Add to favorites

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect`

**Solution:**
1. Ensure MongoDB is running: `mongod`
2. Check connection string in `.env`
3. Verify MongoDB is accessible
4. Check firewall settings

### Grok API Error

**Error:** `401 Unauthorized`

**Solution:**
1. Verify Grok API key in `.env`
2. Check key hasn't expired
3. Regenerate key if needed
4. Ensure correct format

### Port Already in Use

**Error:** `Port 5000/3000 is already in use`

**Solution:**
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 3000 (Frontend)
npx kill-port 3000
```

### CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Ensure it matches frontend URL
3. Verify backend is running
4. Clear browser cache

## 📦 Build for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/` directory

## 📋 Environment Variables Checklist

- [ ] `PORT` - Backend port (default: 5000)
- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - Authentication secret (change this!)
- [ ] `GROK_API_KEY` - AI API key
- [ ] `NODE_ENV` - Environment (development/production)
- [ ] `CORS_ORIGIN` - Frontend URL

## 🔐 Security Notes

1. **Never commit .env file** - Add to .gitignore
2. **Change JWT_SECRET** - Use strong random string
3. **Use HTTPS in production** - Install SSL certificate
4. **Whitelist MongoDB IPs** - If using Atlas
5. **Rate limiting** - Add in production
6. **Input validation** - Already implemented
7. **CORS policy** - Restrict to your domain

## 📚 Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Install all dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check logs
npm logs

# Clear npm cache
npm cache clean --force
```

## 🆘 Getting Help

If you encounter issues:

1. Check error messages carefully
2. Review logs: `npm run dev` shows detailed logs
3. Check GitHub issues
4. Verify all prerequisites installed
5. Ensure correct Node.js version
6. Confirm all environment variables set

## ✨ Next Steps

After successful setup:

1. **Explore the app** - Navigate through all pages
2. **Test chat bot** - Ask various questions
3. **Add more colleges** - Extend colleges.ts
4. **Customize styling** - Modify Tailwind config
5. **Deploy** - Host on Vercel/Heroku
6. **Add features** - Contribute enhancements

## 🎉 Success!

If you see:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ No console errors
- ✅ Can login and use chat

Then you're all set! Happy coding! 🚀

