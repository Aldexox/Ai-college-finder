# AI College Enquiry Chatbot

A comprehensive full-stack AI-powered college recommendation system that helps Indian students find the perfect college based on their academic profile, interests, and career goals.

## 🌟 Features

### 1. **User Authentication**
- Email/password signup and login
- Secure JWT-based authentication
- Profile persistence

### 2. **Smart Profile Form**
Students fill out detailed profiles including:
- Course preference (B.Tech CS, EC, ME, Civil, etc.)
- Class 10th and 12th marks (percentage)
- Hobbies and interests
- Career goals and aspirations
- Budget constraints
- Preferred states/regions

### 3. **AI-Powered Chatbot**
- Conversational AI using Grok API
- Personalized college recommendations
- Answers questions about:
  - Placement statistics
  - Fee structures
  - Cut-off marks
  - Course curriculum
  - Campus facilities
  - Career opportunities

### 4. **College Browser**
- Browse 100+ top colleges (government & private)
- Advanced filtering by:
  - Course
  - State/Region
  - College type (government/private)
  - Budget
- Detailed college information cards

### 5. **College Comparison Tool**
- Save favorite colleges
- Compare multiple colleges side-by-side
- View placement rates, fees, rankings

### 6. **Top 100 Colleges Database**
- IITs (7 top institutions)
- NITs (15+ institutes)
- Private universities (BITS, VIT, Manipal, SRM, etc.)
- State engineering colleges

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **AI Integration**: Grok API
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Database
- **MongoDB** - NoSQL database for user data, profiles, and favorites

## 📁 Project Structure

```
ai-chatbot-college/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Auth logic
│   │   │   ├── chatController.ts    # Chat handler
│   │   │   ├── collegeController.ts # College operations
│   │   │   └── profileController.ts # Profile management
│   │   ├── middleware/
│   │   │   └── auth.ts              # JWT verification
│   │   ├── models/
│   │   │   ├── User.ts              # User schema
│   │   │   ├── StudentProfile.ts    # Profile schema
│   │   │   ├── College.ts           # College schema
│   │   │   ├── ChatMessage.ts       # Chat schema
│   │   │   └── FavoriteCollege.ts   # Favorites schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── profileRoutes.ts
│   │   │   ├── collegeRoutes.ts
│   │   │   └── chatRoutes.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts               # Token utils
│   │   │   └── grokAI.ts            # Grok API integration
│   │   ├── data/
│   │   │   └── colleges.ts          # College database
│   │   └── index.ts                 # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.tsx         # Login/Signup
│   │   │   ├── ProfileForm.tsx      # Student profile
│   │   │   ├── ChatBot.tsx          # AI chatbot
│   │   │   └── CollegeCard.tsx      # College display
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Home page
│   │   │   ├── ProfilePage.tsx      # Profile setup
│   │   │   ├── CollegeBrowserPage.tsx # Browse colleges
│   │   │   └── FavoritesPage.tsx    # Saved colleges
│   │   ├── services/
│   │   │   └── api.ts               # API calls
│   │   ├── store/
│   │   │   └── authStore.ts         # Auth state
│   │   ├── App.tsx                  # Main app
│   │   ├── main.tsx                 # React entry
│   │   └── index.css                # Styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Grok API key (from x.ai)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/college-chatbot
   JWT_SECRET=your_secret_key_here
   GROK_API_KEY=your_grok_api_key
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will open at `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Profile
- `POST /api/profile` - Save/update student profile
- `GET /api/profile` - Get student profile

### Colleges
- `GET /api/colleges` - Get colleges (with filters)
- `GET /api/colleges/:id` - Get college details
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:collegeId` - Remove from favorites
- `GET /api/favorites` - Get saved colleges

### Chat
- `POST /api/chat/message` - Send message to bot
- `GET /api/chat/history` - Get chat history

## 💻 Usage

1. **Sign Up/Login**
   - Create account or login with email
   - Secure password with bcrypt

2. **Fill Profile**
   - Select course and enter marks
   - Add hobbies, goals, and dreams
   - Set budget and preferred states

3. **Chat with AI Bot**
   - Ask questions about colleges
   - Get personalized recommendations
   - Discuss career options

4. **Browse Colleges**
   - View top 100 colleges
   - Apply filters based on preferences
   - View detailed information

5. **Save Favorites**
   - Heart icon to add colleges to favorites
   - Compare selected colleges
   - Create a shortlist

## 🎨 UI/UX Features

- **Creative Fonts**: Playfair Display for headings, Poppins for body
- **Inspirational Quotes**: Featured on landing page
- **Gradient Design**: Blue-to-Purple theme throughout
- **Responsive Layout**: Mobile-first design
- **Glass Morphism**: Modern frosted glass effects
- **Smooth Animations**: Hover effects and transitions
- **Icons**: Lucide React for consistent UI

## 📊 Database Schema

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### StudentProfile Collection
```javascript
{
  userId: ObjectId (ref: User),
  course: String,
  class10Marks: Number (0-100),
  class12Marks: Number (0-100),
  hobbies: [String],
  goals: [String],
  dreams: String,
  budget: Number,
  preferredStates: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### College Collection
```javascript
{
  name: String,
  type: String (government|private),
  state: String,
  city: String,
  courses: [String],
  avgFees: Number,
  placementRate: Number,
  avgPackage: Number,
  ranking: Number,
  established: Number,
  affiliatedUniversity: String,
  website: String,
  cutoff: Number
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: 7-day expiration
- **CORS Protection**: Configured origins
- **Input Validation**: express-validator
- **Middleware Authentication**: Protected routes

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Optimized images and assets

## 🎯 College Data Coverage

### Government Colleges
- IITs: Bombay, Delhi, Madras, Kanpur, Kharagpur, Roorkee, Guwahati, BHU
- NITs: Trichy, Surathkal, Warangal, Rourkela
- State universities and engineering colleges

### Private Colleges
- BITS Pilani
- Manipal Institute of Technology
- VIT University
- SRM Institute of Science and Technology
- Amrita Vishwa Vidyapeetham
- Shiv Nadar University
- And 20+ more

## 🔄 Future Enhancements

- [ ] Multi-language support
- [ ] Virtual campus tours
- [ ] Direct admission portal integration
- [ ] Scholarship finder
- [ ] Alumni network
- [ ] Placement records
- [ ] Cut-off prediction
- [ ] NTA rank converter

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy College Hunting! 🎓**
