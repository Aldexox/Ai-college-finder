# Backend - AI College Enquiry Chatbot API

Express.js backend server for the AI-powered college recommendation system.

## 📋 Features

- **RESTful API** with Express.js
- **MongoDB** integration with Mongoose
- **JWT Authentication** for secure endpoints
- **Grok AI Integration** for intelligent chatbot
- **Validation** with express-validator
- **Password Hashing** with bcryptjs
- **CORS** enabled for frontend

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Language**: TypeScript
- **Authentication**: JWT
- **API Version**: RESTful

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts        # Auth endpoints
│   │   ├── chatController.ts        # Chat with AI
│   │   ├── collegeController.ts     # College data
│   │   └── profileController.ts     # User profile
│   ├── middleware/
│   │   └── auth.ts                  # JWT verification
│   ├── models/
│   │   ├── User.ts                  # User schema
│   │   ├── StudentProfile.ts        # Profile schema
│   │   ├── College.ts               # College schema
│   │   ├── ChatMessage.ts           # Chat schema
│   │   └── FavoriteCollege.ts       # Favorites schema
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── chatRoutes.ts
│   │   ├── collegeRoutes.ts
│   │   └── profileRoutes.ts
│   ├── utils/
│   │   ├── jwt.ts                   # JWT utils
│   │   └── grokAI.ts                # AI integration
│   ├── data/
│   │   └── colleges.ts              # College database
│   ├── index.ts                     # Main server
│   ├── package.json
│   └── tsconfig.json
├── .env.example                     # Environment template
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-chatbot
JWT_SECRET=your_secret_key_here
GROK_API_KEY=your_grok_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Start Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response: {
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: {
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>

Response: {
  "id": "...",
  "name": "...",
  "email": "..."
}
```

### Student Profile

#### Save Profile
```
POST /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "course": "B.Tech CS",
  "class10Marks": 85,
  "class12Marks": 90,
  "hobbies": ["Coding", "Sports"],
  "goals": ["High Package Job"],
  "dreams": "To work at top tech company",
  "budget": 1500000,
  "preferredStates": ["Maharashtra", "Karnataka"]
}

Response: { ...profile_object... }
```

#### Get Profile
```
GET /api/profile
Authorization: Bearer <token>

Response: { ...profile_object... }
```

### Colleges

#### Get All Colleges (with filters)
```
GET /api/colleges?course=B.Tech%20CS&state=Maharashtra&budget=1500000
Authorization: Bearer <token>

Query Parameters:
- course: Course name (B.Tech CS, etc.)
- state: State name
- type: government or private
- budget: Maximum annual fees

Response: [ ...colleges_array... ]
```

#### Get College Details
```
GET /api/colleges/:id
Authorization: Bearer <token>

Response: { ...college_object... }
```

#### Add to Favorites
```
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "collegeId": "college_mongodb_id"
}

Response: { ...favorite_object... }
```

#### Remove from Favorites
```
DELETE /api/favorites/:collegeId
Authorization: Bearer <token>

Response: { "message": "Removed from favorites" }
```

#### Get Favorites
```
GET /api/favorites
Authorization: Bearer <token>

Response: [ ...favorites_array... ]
```

### Chat & AI

#### Send Message
```
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Which colleges are best for me?"
}

Response: {
  "message": "...",
  "response": "AI response here..."
}
```

#### Get Chat History
```
GET /api/chat/history
Authorization: Bearer <token>

Response: [ ...messages_array... ]
```

## 🔐 Authentication

### JWT Token
- Tokens expire in **7 days**
- Include in Authorization header: `Bearer <token>`
- Generated on signup/login

### Protected Routes
All routes except `/api/auth/signup` and `/api/auth/login` require JWT token.

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### StudentProfile
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  course: String,
  class10Marks: Number,
  class12Marks: Number,
  hobbies: [String],
  goals: [String],
  dreams: String,
  budget: Number,
  preferredStates: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### College
```javascript
{
  _id: ObjectId,
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

### ChatMessage
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  message: String,
  response: String,
  timestamp: Date
}
```

### FavoriteCollege
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  collegeId: ObjectId (ref: College),
  addedAt: Date
}
```

## 🤖 Grok AI Integration

The chatbot uses Grok AI API for intelligent responses.

### How it Works
1. User sends message
2. Student profile is retrieved
3. Grok AI generates personalized response
4. Message and response stored in database
5. Response sent to frontend

### Sample Grok Prompts
- College recommendations based on marks
- Placement statistics
- Fee information
- Career guidance

## 🧪 Testing Endpoints

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get colleges
curl -X GET "http://localhost:5000/api/colleges?state=Maharashtra" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import endpoints from `/api` routes
2. Set Authorization header with Bearer token
3. Send requests

## 🔧 Available Commands

```bash
# Development server
npm run dev

# Build TypeScript
npm run build

# Start production
npm start

# Run tests
npm test
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/college-chatbot |
| JWT_SECRET | Authentication secret | your_secret_key |
| GROK_API_KEY | Grok API key | grok_key_here |
| NODE_ENV | Environment | development |
| CORS_ORIGIN | Frontend URL | http://localhost:3000 |

## 🚨 Error Handling

Common errors:

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Add valid JWT token |
| 400 Bad Request | Missing fields | Check request body |
| 404 Not Found | Resource not found | Check ID/parameters |
| 500 Server Error | Server issue | Check logs, restart server |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt
- **JWT Tokens**: Secure token-based auth
- **Input Validation**: express-validator
- **CORS**: Restricted origins
- **Middleware**: Auth verification

## 📈 Scalability

- MongoDB for distributed data
- JWT stateless auth
- RESTful architecture
- Async/await for non-blocking
- Error handling throughout

## 🐛 Debugging

Enable detailed logs:
```bash
# Terminal
DEBUG=* npm run dev
```

View MongoDB:
```bash
# MongoDB shell
mongosh
use college-chatbot
db.users.find()
```

## 📚 Dependencies

```json
{
  "express": "API framework",
  "mongoose": "MongoDB ODM",
  "jsonwebtoken": "JWT auth",
  "bcryptjs": "Password hashing",
  "axios": "HTTP client",
  "cors": "CORS middleware",
  "dotenv": "Environment variables",
  "express-validator": "Input validation"
}
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Add tests
4. Submit pull request

## 📞 Support

For issues, create an issue in the repository.

---

**Happy Coding! 🚀**
