# ProjectHub - Project Management System

A project management platform with role-based access control, built with NestJS and Next.js.

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL database running
- npm or yarn

### 1. Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE cloudeflex_db;
```

### 2. Environment Configuration
Create a `.env` file in root directory (copy from `env.template`):
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=cloudeflex_db
JWT_SECRET=your_secret_key
PORT=4001
NEXT_PUBLIC_API_URL=http://localhost:4001
```

**Important**: All environment variables are required. Do not use default/hardcoded values in production.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Application
```bash
npm run dev
```

This starts:
- Backend: `http://localhost:4001`
- Frontend: `http://localhost:3000`

## Features

### User Management
- Register with email/password (passwords hashed with bcrypt)
- JWT authentication
- Global roles: admin, member

### Project Management
- CRUD operations for projects
- Role-based access control (RBAC)
- Multi-tenancy (client-based isolation)

### User Assignment
- Assign users to projects with roles: owner, developer, viewer
- Only owners/admins can manage project assignments

## Database Schema

**Clients**: Company/organization records
- `id`, `name`, `created_at`, `updated_at`

**Users**: System users
- `id`, `email`, `password_hash`, `role`, `client_id`, `created_at`, `updated_at`

**Projects**: Project records
- `id`, `name`, `description`, `client_id`, `created_at`, `updated_at`

**ProjectUsers**: User-project assignments
- `id`, `project_id`, `user_id`, `role`, `created_at`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (admin/owner only)
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (owner/admin only)
- `DELETE /api/projects/:id` - Delete project (owner/admin only)

### Project Users
- `POST /api/projects/:id/users` - Assign user (owner/admin only)
- `PUT /api/projects/:id/users/:userId` - Update user role (owner/admin only)
- `DELETE /api/projects/:id/users/:userId` - Remove user (owner/admin only)
- `GET /api/projects/:id/users` - List project users

## Tech Stack

**Backend**
- NestJS
- TypeORM
- PostgreSQL
- JWT (Passport)
- bcrypt

**Frontend**
- Next.js 14 (App Router)
- React
- TailwindCSS
- Axios

## Project Structure

```
├── backend/          # NestJS backend
│   └── src/
│       ├── auth/     # Authentication & JWT
│       ├── projects/ # Project management
│       ├── users/    # User management
│       └── clients/  # Client management
├── frontend/         # Next.js frontend
│   └── src/
│       ├── app/      # Pages (login, register, dashboard, projects)
│       ├── components/
│       ├── lib/      # API client
│       └── utils/
└── .env              # Environment variables
```

## Authorization Rules

| Action | Admin | Project Owner | Developer | Viewer |
|--------|-------|---------------|-----------|--------|
| Create Project | ✅ | ✅ | ❌ | ❌ |
| Edit Project | ✅ | ✅ | ❌ | ❌ |
| Delete Project | ✅ | ✅ | ❌ | ❌ |
| Assign Users | ✅ | ✅ | ❌ | ❌ |
| View Project | ✅ | ✅ | ✅ | ✅ |

## Notes

- Database tables are auto-created on first run (TypeORM synchronize mode)
- First registered user gets assigned to a demo client automatically
- JWT tokens are stored in localStorage
- All passwords are hashed with bcrypt (10 rounds)
- Multi-tenancy ensures data isolation between clients

