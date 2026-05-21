# Frontend - AI College Enquiry Chatbot

React + TypeScript frontend for the AI-powered college recommendation system.

## 📋 Features

- Beautiful responsive UI with Tailwind CSS
- React Router for navigation
- Zustand for state management
- Axios for API calls
- Form validation
- Real-time chat interface
- College browser with filters
- Favorites management

## 🛠️ Tech Stack

- **React** 18 with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** v6 for navigation
- **Zustand** for state management
- **Axios** for HTTP requests
- **Lucide React** for icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AuthForm.tsx         # Sign in/Sign up
│   │   ├── ProfileForm.tsx      # Student profile
│   │   ├── ChatBot.tsx          # Chat interface
│   │   └── CollegeCard.tsx      # College display
│   ├── pages/
│   │   ├── LandingPage.tsx      # Home page
│   │   ├── ProfilePage.tsx      # Profile setup
│   │   ├── CollegeBrowserPage.tsx # Browse colleges
│   │   └── FavoritesPage.tsx    # Saved colleges
│   ├── services/
│   │   └── api.ts               # API client
│   ├── store/
│   │   └── authStore.ts         # Auth state
│   ├── App.tsx                  # Main component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Styles
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Installation

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

Application runs on: `http://localhost:3000`

## 📄 Pages

### Landing Page
- Welcome with inspirational quotes
- Statistics (colleges, courses, placements)
- Authentication forms (Sign Up / Sign In)

### Profile Page
- Course selection
- Enter Class 10 & 12 marks
- Select hobbies and goals
- Write dreams and aspirations
- Set budget
- Choose preferred states

### Chat Bot Page
- Real-time chat interface
- Chat history
- AI responses based on profile
- Ask questions about colleges

### College Browser
- View all colleges (100+)
- Filter by:
  - Course
  - State
  - Type (Government/Private)
  - Budget
- Detailed college information
- Save to favorites

### Favorites Page
- View saved colleges
- Remove from favorites
- Quick access to shortlist

## 🎨 UI Components

### AuthForm
Login and signup component
```tsx
<AuthForm isSignup={true} onSuccess={() => {}} />
```

### ProfileForm
Student profile creation
```tsx
<ProfileForm onSuccess={() => {}} />
```

### ChatBot
Chat interface
```tsx
<ChatBot />
```

### CollegeCard
College information display
```tsx
<CollegeCard
  college={collegeData}
  onFavorite={handleFavorite}
  isFavorite={true}
/>
```

## 🎯 App Flow

1. **Landing Page** → Sign Up / Login
2. **Profile Page** → Fill student details
3. **Chat Bot** → Interact with AI
4. **Browse Colleges** → Find colleges
5. **Favorites** → Save and review

## 🔐 State Management

Using Zustand for authentication:

```tsx
const { user, token, isLoggedIn, login, logout } = useAuthStore();
```

User data persisted in localStorage.

## 📡 API Integration

All API calls through Axios:

```tsx
// Authentication
authService.signup(email, password, name)
authService.login(email, password)

// Profile
profileService.saveProfile(data)
profileService.getProfile()

// Colleges
collegeService.getColleges(filters)
collegeService.addFavorite(collegeId)
collegeService.getFavorites()

// Chat
chatService.sendMessage(message)
chatService.getChatHistory()
```

## 🎨 Styling

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Purple (#9333EA)
- Accent: Pink (#EC4899)

### Fonts
- Headings: Playfair Display
- Body: Poppins
- Monospace: Open Sans

### Custom Classes
```css
.gradient-text /* Blue to pink gradient */
.quote-card /* Styled quote container */
.btn-primary /* Primary button */
.btn-secondary /* Secondary button */
.glass-effect /* Frosted glass effect */
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Touch-friendly interfaces
- Optimized images

## 🧪 Testing

### User Signup
1. Navigate to home
2. Enter email, password, name
3. Submit
4. Should redirect to profile

### Profile Creation
1. Fill course, marks, hobbies
2. Add budget and states
3. Submit
4. Should redirect to chat

### Chatbot
1. Ask college recommendations
2. Chat history displays
3. Messages persist

### College Browser
1. Apply filters
2. View filtered results
3. Add to favorites
4. Remove favorites

## 🔧 Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run linter
npm run lint
```

## 📦 Dependencies

```json
{
  "react": "UI library",
  "react-dom": "DOM rendering",
  "react-router-dom": "Navigation",
  "axios": "HTTP client",
  "zustand": "State management",
  "tailwindcss": "Utility CSS",
  "vite": "Build tool"
}
```

## 🔗 Environment Variables

Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Production Build

```bash
npm run build
```

Output: `dist/` directory

Deploy to Vercel, Netlify, or any static host.

## 🎯 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Common Issues

### CORS Error
- Ensure backend is running on port 5000
- Check CORS_ORIGIN in backend .env

### Page Not Loading
- Clear browser cache
- Check Console for errors
- Verify backend API endpoint

### Chat Not Responding
- Check Grok API key
- Verify backend has profile data
- Check network tab for errors

## 📚 Project Structure Explanation

**components/** - Reusable React components
**pages/** - Full page components with routing
**services/** - API client functions
**store/** - Zustand state management
**index.css** - Global styles and Tailwind

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#3B82F6',
  secondary: '#9333EA'
}
```

### Add New Page
1. Create component in `pages/`
2. Add route in `App.tsx`
3. Update navigation

### Add New Feature
1. Create components
2. Add API calls in `services/api.ts`
3. Update store if needed
4. Add pages and routes

## 📞 Support

For issues, check:
1. Console errors
2. Network tab
3. API responses
4. Environment variables

---

**Happy Coding! 🎨✨**
