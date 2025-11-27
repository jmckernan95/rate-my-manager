# RateMyManager - Manager Rating Platform

A proof-of-concept web application that allows employees to anonymously rate and review their managers, with employment verification to ensure authentic feedback.

## Features

- **Manager Search** - Find managers by name or company
- **Detailed Profiles** - View overall ratings, rating breakdowns, and individual reviews
- **Multi-Dimensional Ratings** - Rate managers on communication, fairness, growth support, and work-life balance
- **Anonymous Reviews** - Share honest feedback without fear of retaliation
- **Employment Verification** - Verify your employment via work email to add credibility to your review
- **User Dashboard** - Track your reviews and verifications

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Tailwind CSS
- TanStack Query (React Query)
- Zustand for state management
- Lucide React icons

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- JWT for authentication
- bcrypt for password hashing
- express-validator for input validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone or download the project:
```bash
cd manager-ratings
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Database Setup

The database is automatically created and seeded when you start the backend server. To manually seed the database:

```bash
cd backend
npm run seed
```

This creates 10 managers, 31 reviews, and 5 test users.

### Running the Application

1. Start the backend server (from the `backend` directory):
```bash
npm run dev
```
The API will be available at `http://localhost:3001`

2. In a new terminal, start the frontend (from the `frontend` directory):
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Test Credentials

Use these credentials to test the application:

| Email | Password |
|-------|----------|
| user1@example.com | password123 |
| user2@example.com | password123 |
| user3@example.com | password123 |
| user4@example.com | password123 |
| user5@example.com | password123 |

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create a new account |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/auth/logout` | POST | Logout (client-side) |

### Managers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/managers/search` | GET | Search managers by name/company |
| `/api/managers/trending` | GET | Get trending managers |
| `/api/managers/companies` | GET | Get list of companies |
| `/api/managers/:id` | GET | Get manager details |
| `/api/managers` | POST | Create new manager (auth required) |

### Reviews

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reviews/manager/:id` | GET | Get reviews for a manager |
| `/api/reviews` | POST | Submit a review (auth required) |

### Verification

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/verification/request` | POST | Request verification code |
| `/api/verification/confirm` | POST | Confirm verification code |

### User

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/dashboard` | GET | Get user dashboard data |
| `/api/user/me` | GET | Get current user |

## Project Structure

```
manager-ratings/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── ui/         # Base components (Button, Card, etc.)
│   │   │   └── ...         # Domain components (StarRating, ReviewCard, etc.)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── stores/         # Zustand stores
│   │   └── utils/          # Helper functions
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Auth & validation middleware
│   │   └── services/       # Business logic
│   ├── database/
│   │   ├── schema.sql      # Database schema
│   │   └── seed.js         # Seed script
│   └── package.json
├── database/
│   └── manager-ratings.db  # SQLite database
└── README.md
```

## Seed Data

The database is seeded with:

- **10 Managers** across 5 companies:
  - TechCorp Inc (3 managers)
  - StartupXYZ (2 managers)
  - MegaBank Financial (2 managers)
  - HealthFirst Medical (2 managers)
  - Creative Agency Co (1 manager)

- **31 Reviews** with varied ratings and text feedback

- **5 Test Users** for authentication testing

## Known Limitations (POC)

- **SQLite**: Uses SQLite for simplicity; not suitable for production scale
- **JWT in localStorage**: Token stored in localStorage; consider httpOnly cookies for production
- **Mock Email**: Verification emails are mocked (code displayed in console/UI)
- **No Rate Limiting**: No protection against abuse
- **No Password Reset**: Password reset flow is not implemented

## License

This is a proof-of-concept project for demonstration purposes.
