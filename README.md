# SecureAuth

A full-stack authentication system built with React, Express, Prisma, and PostgreSQL. The project demonstrates secure user authentication with JWT-based sessions stored in HTTP-only cookies, protected client routes, and role-based access control for admin-only features.

## Overview

SecureAuth is designed as a clean reference project for implementing modern authentication in a web application. It includes a React frontend for registration, login, and dashboard access, along with an Express backend that manages authentication, authorization, and user records in PostgreSQL.

## Key Features

- User registration and login
- JWT authentication with HTTP-only cookies
- Protected frontend routes
- Role-based access control for admin users
- Admin panel for viewing and deleting users
- Password hashing with `bcrypt`
- PostgreSQL database integration via Prisma
- Responsive UI built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- shadcn/ui

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- cookie-parser
- CORS

## Project Structure

```text
Secure-Auth/
|- src/                    # Frontend application
|  |- components/          # Shared and UI components
|  |- lib/                 # API client and utilities
|  |- pages/               # Login, Register, Dashboard, Admin
|  |- App.tsx              # App routes
|  `- main.tsx             # Frontend entry point
|- server/                 # Express backend
|  |- prisma/              # Prisma schema and migrations
|  `- src/
|     |- middleware/       # Auth and role guards
|     |- routes/           # Authentication routes
|     `- index.ts          # Server entry point
|- .env.example            # Frontend environment example
|- .env.local              # Frontend local environment
`- package.json            # Root scripts
```

## Authentication Flow

1. A user registers or logs in from the frontend.
2. The backend validates credentials and creates a JWT.
3. The JWT is stored in an HTTP-only cookie named `authToken`.
4. Protected routes call `/api/auth/me` to verify the current session.
5. Admin-only routes require the authenticated user to have the `ADMIN` role.

## Available Routes

### Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in to an existing account |
| `/register` | Public | Create a new account |
| `/dashboard` | Authenticated users | View account details |
| `/admin` | Admin only | Manage registered users |

### API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Log in and set auth cookie |
| `POST` | `/auth/logout` | Authenticated | Clear auth cookie |
| `GET` | `/auth/me` | Authenticated | Get current user |
| `GET` | `/auth/admin/users` | Admin only | List all users |
| `DELETE` | `/auth/admin/users/:id` | Admin only | Delete a user |
| `GET` | `/health` | Public | Health check endpoint |

## Environment Variables

### Frontend

Create or update `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

Create `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secure_auth
JWT_SECRET=your-strong-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Local Setup

### 1. Install dependencies

From the project root:

```bash
npm install
```

From the `server` directory:

```bash
cd server
npm install
```

### 2. Configure PostgreSQL

Create a database named `secure_auth`, or update `DATABASE_URL` to point to an existing PostgreSQL database.

### 3. Generate Prisma client and sync the database

From the `server` directory:

```bash
npm run prisma:generate
npm run prisma:migrate
```

If you only want to push the schema in development:

```bash
npm run prisma:push
```

### 4. Start the application

From the project root:

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Build Commands

From the project root:

```bash
npm run build
```

Useful additional commands:

- `npm run dev:frontend` - run only the frontend
- `npm run dev:backend` - run only the backend
- `npm run preview` - preview the frontend production build

## Database Model

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

## Security Notes

- Passwords are hashed with `bcrypt` before storage.
- Authentication tokens are stored in HTTP-only cookies.
- Cookies use `SameSite=Strict`.
- Secure cookies are enabled automatically in production mode.
- Admin routes are protected on both the client and server.
- Users cannot delete their own account from the admin panel.

## Demo Checklist

To test the full flow locally:

1. Register a user account.
2. Log in and verify access to `/dashboard`.
3. Promote a user to `ADMIN` directly in the database.
4. Sign in as that admin user.
5. Open `/admin` and verify user management actions.

To promote a user manually:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

## Why This Project Matters

This project is a strong reference for learning or showcasing:

- secure authentication fundamentals
- cookie-based session handling with JWT
- route protection in React
- backend authorization middleware
- Prisma and PostgreSQL integration in a real full-stack app

## License

This project is available for educational and portfolio use unless your repository specifies another license.
