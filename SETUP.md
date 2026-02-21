# Secure Auth System - Complete Setup Guide

A production-ready authentication system built with React (Vite), Express.js, Prisma, and PostgreSQL.

## Features

✅ User Registration & Login
✅ JWT Authentication with HTTP-only Cookies  
✅ Role-Based Access Control (RBAC)
✅ Password Hashing with bcrypt (10 salt rounds)
✅ Protected Routes
✅ Admin Panel for User Management
✅ Responsive UI with shadcn/ui
✅ Production-Ready Security

---

## Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

---

## Project Structure

```
Secure-Auth/
├── server/                          # Express.js Backend
│   ├── src/
│   │   ├── index.ts                # Server entry point
│   │   ├── routes/
│   │   │   └── auth.routes.ts      # Auth endpoints
│   │   └── middleware/
│   │       └── auth.middleware.ts  # JWT & role verification
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                        # Server environment variables
├── src/                             # React Frontend
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   ├── Dashboard.tsx           # User dashboard
│   │   └── Admin.tsx               # Admin panel
│   ├── components/
│   │   ├── ProtectedRoute.tsx      # Route protection
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   └── api.ts                  # API client (Axios)
│   └── App.tsx                     # Main app with routing
├── package.json                     # Frontend dependencies
├── .env.local                       # Frontend environment variables
└── index.html

```

---

## Installation

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Setup PostgreSQL Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE secure_auth;
```

### 4. Configure Environment Variables

**Backend (.env files already created)**

Edit `server/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secure_auth
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local already created)**

File: `.env.local`
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Setup Prisma & Database

From the `server/` directory:

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration and apply to database
npm run prisma:migrate

# Or push schema directly (for development)
npm run prisma:push
```

---

## Running the Application

### Option 1: Run Both Frontend & Backend Together

From the root directory:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Option 2: Run Separately

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
cd server
npm run dev
```

---

## Building for Production

```bash
npm run build
```

This will:
- Build the React frontend
- Build the Express backend
- Generate optimized bundles

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| GET | `/me` | Get current user | ✅ |
| GET | `/admin/users` | List all users | ✅ ADMIN |
| DELETE | `/admin/users/:id` | Delete user | ✅ ADMIN |

### Request/Response Examples

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### Get Current User
```bash
GET /api/auth/me
Cookie: authToken=jwt_token_here

Response (200):
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2024-02-21T10:00:00.000Z"
}
```

---

## Security Features

### Password Security
- **Bcrypt Hashing**: Passwords hashed with 10 salt rounds
- **No plaintext**: Passwords never returned in responses
- **Validation**: Minimum 6 characters enforced

### JWT Authentication
- **Expiration**: 1 day (86400 seconds)
- **Secret**: Stored in environment variables
- **Payload**: Contains user ID and role
- **Tamper-proof**: Signed and verified on every request

### Cookie Security
- **HttpOnly**: Cannot be accessed via JavaScript
- **Secure**: Only sent over HTTPS in production
- **SameSite**: Set to "strict" to prevent CSRF attacks
- **Expiry**: Matches JWT expiration (1 day)

### RBAC (Role-Based Access Control)
- **USER**: Default role, access to own data
- **ADMIN**: Full access to user management endpoints
- **Middleware**: Enforced on protected routes

### Other Security Measures
- **CORS**: Configured for frontend origin only
- **Environment Variables**: Sensitive data in .env files
- **Error Handling**: Generic error messages to prevent info leakage
- **Input Validation**: Required fields checked on backend

---

## Database Schema

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

---

## Frontend Features

### Pages

1. **Login Page** (`/login`)
   - Email and password fields
   - Error handling and feedback
   - Link to registration
   - Redirects to dashboard on success

2. **Register Page** (`/register`)
   - Full name, email, password fields
   - Password confirmation
   - Validation (email format, password length)
   - Link to login page

3. **Dashboard** (`/dashboard`)
   - Protected route (requires login)
   - Shows user profile information
   - Logout button
   - Link to admin panel (if ADMIN)

4. **Admin Panel** (`/admin`)
   - Protected route (requires ADMIN role)
   - List all users in a table
   - Delete user functionality
   - Confirmation dialog

### Components

- **ProtectedRoute**: Wraps routes that require authentication
- **shadcn/ui Components**: Button, Input, Card, Dialog, etc.
- **Axios API Client**: Handles all backend communication

---

## Testing the System

### 1. Create a Test User

Go to http://localhost:5173/register

```
Name: Test Admin
Email: admin@example.com
Password: admin123456
```

### 2. Make Admin User (Manual Step)

Connect to PostgreSQL and update the role:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### 3. Login and Test

- Login with admin credentials
- Access dashboard
- Click "Go to Admin Panel" to manage users
- Create additional test users and delete them

### 4. Test Protected Routes

- Try accessing `/admin` without admin role (should redirect to login)
- Try accessing `/dashboard` without logging in (should redirect to login)

---

## Environment Variables Reference

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
```

---

## Production Deployment

### Before Deploying:

1. **Change JWT_SECRET** to a strong, random string
2. **Update DATABASE_URL** to your production database
3. **Set NODE_ENV=production**
4. **Update FRONTEND_URL** to your production domain
5. **Enable HTTPS** in production (secure cookies require it)
6. **Use environment variable manager** (e.g., AWS Secrets Manager, Vercel Env)
7. **Run migrations** on production database
8. **Set strong passwords** for database users

### Deployment Platforms

**Frontend**: Vercel, Netlify, GitHub Pages
**Backend**: Render, Railway, Heroku, AWS EC2, DigitalOcean
**Database**: Neon, Supabase, AWS RDS, Azure Database

---

## Troubleshooting

### Connection Refused (Backend)
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify port 5000 is not in use

### 401 Unauthorized
- Check if authToken cookie is present
- Verify JWT_SECRET matches between requests
- Check token expiration (1 day)

### CORS Errors
- Verify FRONTEND_URL in server .env
- Check `credentials: true` in Axios instance
- Headers include authToken cookie

### Database Issues
- Run `npm run prisma:migrate` in server directory
- Check PostgreSQL credentials
- Ensure database exists

### Frontend Not Loading
- Verify frontend dependencies installed: `npm install`
- Check Vite port 5173 is free
- Clear browser cache

---

## Tech Stack Details

### Frontend
- **React 18**: UI library
- **Vite**: Build tool (fast, modern)
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **shadcn/ui**: Accessible component library
- **Lucide React**: Icons

### Backend
- **Express.js**: Web framework
- **Node.js**: Runtime
- **TypeScript**: Type safety
- **Prisma**: ORM
- **PostgreSQL**: Database
- **bcrypt**: Password hashing
- **JWT**: Token-based auth
- **cookie-parser**: Cookie middleware
- **CORS**: Cross-origin support

---

## License

MIT

---

## Support

For issues or questions, check the GitHub repository or contact the development team.

Happy coding! 🚀
