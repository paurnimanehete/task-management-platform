# Task & Team Management Platform

A full-stack, production-ready **Task & Team Management Platform** built with the MERN stack. Features JWT authentication, real-time dashboard analytics, full task CRUD with search/filter/sort, dark mode, pagination, and toast notifications.

---

## 🚀 Live Demo

| Environment | URL |
|-------------|-----|
| **Frontend** | https://task-management-platform-one.vercel.app/|
| **Backend API** | https://task-management-platform-ifsc.onrender.com |

---

## ✨ Features

### Core Features
- ✅ **Secure Authentication** — JWT with bcrypt hashing, Remember Me (30-day token), session/localStorage management
- ✅ **Protected Routes** — Unauthenticated users redirected to login
- ✅ **Dashboard** — Real-time statistics from MongoDB (total, pending, in-progress, completed, overdue, due-this-week)
- ✅ **Full Task CRUD** — Create, Read, Update, Delete with modals
- ✅ **Task Assignment** — Assign tasks to any registered team member
- ✅ **Search & Filters** — Filter by status, priority, scope; sort by date/title/priority; debounced search
- ✅ **Grid & Table View** — Toggle between card grid and sortable table view
- ✅ **Authorization** — Task edits restricted to creator/assignee/admin

### Bonus Features
- 🌙 **Dark Mode** — System-preference detection + persistent toggle
- 📄 **Pagination** — Server-side pagination with configurable page size
- 🔔 **Toast Notifications** — react-hot-toast for all CRUD feedback
- 📊 **Dashboard Charts** — Recharts PieChart (status), BarChart (priority), progress meter

### React Concepts Used
| Concept | Where Used |
|---------|-----------|
| `useState` | All form/modal/UI states |
| `useEffect` | Data fetching, token revalidation |
| `useMemo` | Chart data, pagination numbers, user initials |
| `useCallback` | Event handlers in TaskCard, TaskFilters |
| `React.memo` | TaskCard, TaskTable, TaskFilters, Badges |
| Custom Hooks | `useAuth`, `useTasks`, `useTheme`, `useDebounce` |
| Redux Toolkit | authSlice, taskSlice, themeSlice, userSlice |
| `React.lazy` | All 5 pages lazy-loaded |
| `Suspense` | Page-level fallback spinner |

---

## 🛠 Technology Stack

### Frontend
| Tech | Version |
|------|---------|
| React | 18.3 |
| Vite | 5.3 |
| React Router DOM | 6.24 |
| Redux Toolkit | 2.2 |
| Axios | 1.7 |
| Tailwind CSS | 3.4 |
| Recharts | 2.12 |
| react-hot-toast | 2.4 |
| date-fns | 3.6 |
| lucide-react | 0.408 |

### Backend
| Tech | Version |
|------|---------|
| Node.js | 18+ |
| Express.js | 4.19 |
| Mongoose | 8.5 |
| bcryptjs | 2.4 |
| jsonwebtoken | 9.0 |
| express-validator | 7.1 |
| cors | 2.8 |
| morgan | 1.10 |

---

## 📁 Project Structure

```
task-and-team-management-platform/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Sidebar, Modal, Badge, Pagination...
│   │   │   └── tasks/              # TaskCard, TaskTable, TaskFilters, TaskForm...
│   │   ├── features/
│   │   │   ├── auth/authSlice.js
│   │   │   ├── tasks/taskSlice.js
│   │   │   ├── theme/themeSlice.js
│   │   │   └── users/userSlice.js
│   │   ├── hooks/                  # useAuth, useTasks, useTheme, useDebounce
│   │   ├── layouts/                # AppLayout, ProtectedRoute, PublicRoute
│   │   ├── pages/                  # LoginPage, RegisterPage, DashboardPage, TasksPage, ProfilePage, NotFoundPage
│   │   ├── services/api.js          # Axios client with JWT interceptors
│   │   ├── store/index.js           # Redux store
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Client env (VITE_API_URL)
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # register, login, getMe, getAllUsers
│   │   └── taskController.js        # CRUD + stats + filtering
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect middleware
│   │   ├── validator.js             # express-validator rules
│   │   └── errorHandler.js          # Centralized error handler
│   ├── models/
│   │   ├── User.js                  # Mongoose User model
│   │   └── Task.js                  # Mongoose Task model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   ├── tests/api.test.js            # 19 automated API tests
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Server env (fill in MongoDB URI)
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                     # Root orchestration scripts
└── README.md
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js v18+
- npm v9+
- A MongoDB Atlas cluster (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/paurnimanehete/task-management-platform.git
cd task-management-platform

# Install all dependencies
npm run install:all
```

### 2. Configure Environment Variables

**Server** — Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
JWT_REMEMBER_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

**Client** — Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
# Terminal 1 — Start backend
npm run dev:server

# Terminal 2 — Start frontend
npm run dev:client
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

---

## 🔌 API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login (returns JWT) |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/health` | No | Server health check |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Auth Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "..."
  }
}
```

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Yes | List all team users for task assignment |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | Yes | List tasks with search/filter/sort/pagination |
| GET | `/api/tasks/stats` | Yes | Dashboard statistics |
| GET | `/api/tasks/:id` | Yes | Get single task |
| POST | `/api/tasks` | Yes | Create task |
| PUT | `/api/tasks/:id` | Yes | Update task (creator/assignee/admin) |
| DELETE | `/api/tasks/:id` | Yes | Delete task (creator/admin only) |

**GET /api/tasks Query Parameters:**
| Param | Values | Description |
|-------|--------|-------------|
| `search` | string | Search title/description |
| `status` | Pending \| In Progress \| Completed \| all | Filter by status |
| `priority` | Low \| Medium \| High \| all | Filter by priority |
| `filterScope` | all \| my_tasks \| assigned_to_me \| created_by_me | Scope filter |
| `sortBy` | dueDate \| createdAt \| title \| priority \| status | Sort field |
| `sortOrder` | asc \| desc | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 9) |

**Create Task Request:**
```json
{
  "title": "Implement authentication",
  "description": "Add JWT-based login and registration",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-10-01",
  "assignedUser": "64f1234567890abcdef12345"
}
```

### Authorization Header
All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🗃️ Database Schema

### User
```
name       String (required, 2-50 chars)
email      String (required, unique, indexed)
password   String (required, hashed with bcrypt)
avatar     String
role       String enum: [member, admin, lead]
createdAt  Date
updatedAt  Date
```

### Task
```
title        String (required, 3-100 chars, text-indexed)
description  String (required, max 2000 chars)
priority     String enum: [Low, Medium, High]
status       String enum: [Pending, In Progress, Completed]
dueDate      Date (required, indexed)
assignedUser ObjectId → User (required)
createdBy    ObjectId → User (required)
createdAt    Date
updatedAt    Date
```

---

## ☁️ Deployment

### MongoDB Atlas
1. Create a cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add a database user with read/write permissions
3. Whitelist `0.0.0.0/0` (allow from everywhere) for Render
4. Copy the connection string (replace `<username>`, `<password>`, `<dbname>`)

### Backend → Render
1. Push code to GitHub
2. Create a **Web Service** on [render.com](https://render.com)
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables in the Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_production_secret
   JWT_EXPIRE=7d
   JWT_REMEMBER_EXPIRE=30d
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```

### Frontend → Vercel
1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Set **Root Directory**: `client`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

> ⚠️ **NEVER commit your `.env` file.** It is already in `.gitignore`.

---

## 🧪 Running Tests

```bash
# Run all 19 backend API tests
cd server
npm test
```

Tests cover: health check, register, login, duplicate prevention, invalid inputs, JWT protection, task CRUD, search+filter, stats aggregation, delete — **all 19 pass**.

---

## 📸 Screenshots

> Add screenshots here after deployment

- [ ] Login Page
- [ ] Register Page
- [ ] Dashboard (light mode)
- [ ] Dashboard (dark mode)
- [ ] All Tasks (grid view)
- [ ] All Tasks (table view)
- [ ] Create Task Modal
- [ ] Task Detail Modal

---

## 🔐 Pre-seeded Test Credentials

For evaluation, the following pre-seeded test accounts are available and active in the database:

| Role | Email | Password |
|------|-------|----------|
| **Standard User** | `testuser@example.com` | `Test@1234` |
| **Admin User** | `admin@example.com` | `Admin@1234` |

> ℹ️ Registration is also fully open at `/register` if you'd like to create custom accounts.

---

## 📝 Checklist

- [x] User Registration & Login with JWT
- [x] bcrypt password hashing
- [x] Protected routes
- [x] Remember Me (30-day vs 7-day token)
- [x] Dashboard with real MongoDB metrics
- [x] Task CRUD (Create, Read, Update, Delete)
- [x] Task assignment to team members
- [x] Status & priority management
- [x] Search by title/description (debounced)
- [x] Filter by status, priority, scope
- [x] Sort by due date, title, priority, status
- [x] Grid & table view toggle
- [x] Pagination (server-side)
- [x] Dark mode (system-aware, persistent)
- [x] Toast notifications
- [x] Recharts dashboard charts
- [x] React.lazy + Suspense (code splitting)
- [x] Custom hooks (useAuth, useTasks, useTheme, useDebounce)
- [x] Redux Toolkit (4 slices)
- [x] Authorization checks (creator/assignee/admin)
- [x] CORS configured for production
- [x] 19 automated backend tests (all pass)
- [x] Deployment-ready config (Vercel + Render + MongoDB Atlas)

---

## 👤 Author

Full Stack Developer Intern — Technical Assessment Submission
