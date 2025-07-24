# LitPlatform - Educational Reading Platform

## Project Overview
LitPlatform is a comprehensive educational reading platform designed for teachers, students, and parents. The platform facilitates classroom management, reading assignments, progress tracking, and achievement systems.

**Current Status**: Successfully migrated from Supabase to Replit's PostgreSQL environment with Drizzle ORM.

## Architecture

### Backend (Node.js + Express)
- **Server**: Express.js application with session-based authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: DatabaseStorage implementation for all CRUD operations
- **Routes**: RESTful API endpoints for all platform functionality

### Frontend (React + Vite)
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Authentication**: Custom AuthContext with session-based auth

### Database Schema
- **profiles**: User accounts (students, teachers, parents)
- **classes**: Teacher-created classrooms with unique codes
- **books**: Available reading materials with metadata
- **assignments**: Teacher-created reading assignments
- **submissions**: Student assignment submissions and grading
- **achievements**: Gamification system with different rarities
- **user_achievements**: Tracking of user-earned achievements
- **reading_progress**: Student reading progress tracking
- **messages**: Communication system (announcements, messaging)
- **class_enrollments**: Student-class relationships
- **parent_child_links**: Parent-child account connections

## Key Features

### For Teachers
- Create and manage classes with unique join codes
- Assign reading materials and track student progress
- Grade assignments and provide feedback
- Send announcements to students and parents

### For Students
- Join classes using class codes
- Access assigned readings and submit work
- Track reading progress and earn achievements
- View grades and teacher feedback

### For Parents
- Link to children's accounts
- Monitor child's reading progress
- Receive announcements from teachers

## Recent Changes (Migration from Supabase to Replit PostgreSQL)
- **Database Migration**: Ported Supabase schema to Drizzle with PostgreSQL
- **Authentication**: Replaced Supabase Auth with session-based authentication
- **API Layer**: Implemented Express routes replacing Supabase Edge Functions
- **Client Updates**: Updated frontend to use custom API client instead of Supabase client
- **Security**: Implemented proper server-side security and validation
- **Sample Data**: Populated database with books and achievements

## Development Guidelines

### Running the Project
```bash
npm run dev  # Starts both frontend and backend
npm run db:push  # Pushes schema changes to database
```

### Key Files
- `shared/schema.ts`: Database schema and types (source of truth)
- `server/storage.ts`: Database operations interface and implementation
- `server/routes.ts`: API routes and authentication
- `client/src/contexts/AuthContext.tsx`: Authentication context
- `client/src/lib/api.ts`: API client for frontend-backend communication

### Architecture Decisions
- **Client/Server Separation**: Backend handles all data operations and authentication
- **Type Safety**: Shared schema ensures consistency between frontend and backend
- **Security**: Session-based authentication with proper CSRF protection
- **Database**: PostgreSQL with Drizzle for type-safe database operations

## User Preferences
- Language: English
- Communication Style: Clear, technical explanations when needed
- Code Style: TypeScript with proper type safety, consistent formatting

## Deployment Status
The application is running successfully on Replit with:
- PostgreSQL database properly configured
- All API endpoints functional
- Frontend connecting correctly to backend
- Sample data populated for testing

Ready for continued development and feature additions.