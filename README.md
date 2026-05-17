# Car Rental System

A full-stack car rental web application with modern responsive UI and secure authentication.

## Features

- **User Authentication** - Email/password and Google login via Firebase Authentication
- **JWT Authorization** - HTTP-only cookies for secure session management
- **Car Management** - CRUD operations for car listings
- **Booking System** - Book, cancel, and modify rental dates
- **Search & Filter** - Search by model/location, sort by price/date/popularity
- **Grid/List View** - Toggle between grid and list views for cars
- **Real-time Updates** - UI updates instantly after CRUD operations
- **Responsive Design** - Fully responsive for mobile, tablet, and desktop
- **Dark Mode** - Light/dark theme toggle
- **Loading/Error/Empty States** - Proper handling of all UI states

## Tech Stack

### Frontend
- React 19
- React Router 7
- Tailwind CSS 4 + DaisyUI 5
- Axios
- Firebase Authentication
- Framer Motion
- React Hot Toast
- TanStack React Query
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- cookie-parser

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Firebase project

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd car-rental-system
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI and JWT secret.

3. **Client Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env
   ```
   Edit `.env` with your Firebase config values.

4. **Run the application**
   ```bash
   # Terminal 1 - Server
   cd server
   npm start

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

5. Open http://localhost:5173 in your browser.

## Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/car-rental
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login with email/password |
| POST | /api/auth/google-login | Login with Google |
| POST | /api/auth/logout | Logout and clear cookie |
| GET | /api/auth/me | Get current user (protected) |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cars | Get all cars (with search/sort) |
| GET | /api/cars/my/list | Get user's cars (protected) |
| GET | /api/cars/:id | Get single car |
| POST | /api/cars | Add car (protected) |
| PUT | /api/cars/:id | Update car (protected, owner) |
| DELETE | /api/cars/:id | Delete car (protected, owner) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings/my | Get user's bookings (protected) |
| POST | /api/bookings | Create booking (protected) |
| PATCH | /api/bookings/:id/cancel | Cancel booking (protected) |
| PATCH | /api/bookings/:id/modify | Modify booking dates (protected) |

## Project Structure

```
car-rental-system/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── api/               # Axios instance
│       ├── components/
│       │   ├── common/        # CarCard, LoadingSpinner
│       │   ├── footer/
│       │   └── navbar/
│       ├── context/           # AuthContext
│       ├── firebase/          # Firebase config
│       ├── layouts/           # MainLayout
│       ├── pages/
│       │   ├── auth/          # Login, Register
│       │   ├── bookings/      # MyBookings
│       │   ├── cars/          # AvailableCars, CarDetails, AddCar, MyCars
│       │   └── home/          # Home
│       └── routes/            # Router
├── server/                    # Express backend
│   ├── middleware/            # verifyToken
│   ├── models/               # User, Car, Booking
│   └── routes/               # auth, cars, bookings
└── README.md
```

## Deployment

### Option 1: Deploy as a single app (recommended) — Render / Railway

This option serves the built React frontend directly from Express, so you only deploy one service.

**Steps:**

1. **Update server/index.js** — Add this before your API routes:

```js
const path = require("path");
// ... after cookieParser(), before routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}
```

2. **Set up environment variables** on the platform:
   - `MONGODB_URI` — your MongoDB connection string
   - `JWT_SECRET` — a secure random string
   - `CLIENT_URL` — your deployed URL (e.g. `https://your-app.onrender.com`)
   - `NODE_ENV` — `production`
   - Firebase config variables prefixed with `VITE_`

3. **Build the client**:
   ```bash
   cd client && npm install && npm run build
   ```

4. **Platform-specific setup**:

   **Render.com:**
   - Create a new Web Service
   - Root Directory: leave blank
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && node index.js`
   - Add all env vars in Render dashboard

   **Railway.app:**
   - Create a new project from GitHub
   - Add all env vars in Railway dashboard
   - Start Command: `cd server && node index.js`

### Option 2: Deploy separately (frontend + backend)

**Frontend → Vercel / Netlify**
- Connect your GitHub repo
- Set root directory to `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add env vars (VITE_*)

**Backend → Render / Railway**
- Set root directory to `server`
- Start command: `node index.js`
- Add env vars (MONGODB_URI, JWT_SECRET, etc.)
- Update `CLIENT_URL` to your frontend URL
- Update `VITE_API_URL` in frontend to your backend URL

### Important for production:
- Set `sameSite: "none"` and `secure: true` in cookie options (server/routes/auth.js)
- Use a strong `JWT_SECRET`
- Whitelist your deployment IP in MongoDB Atlas
