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
- **Google Classroom-style Interface**: Create classes with unique 6-character codes
- **Assignment Manager**: Create, distribute and manage assignments to class students
- **Announcement Center**: Send announcements to students and parents (no incoming messages)
- **Class Management**: View enrolled students, track class progress
- **Library Integration**: Access books and assign reading materials

### For Students
- **Class Joining**: Join teacher classes using unique class codes
- **Assignment Dashboard**: View, complete and submit assignments with due dates
- **Progress Tracking**: Monitor reading progress and achievements
- **Announcement Feed**: Receive important updates from teachers
- **Interactive Library**: Access assigned books and reading materials

### For Parents
- **Child Linking System**: Link to children's accounts for monitoring
- **Comprehensive Progress View**: Detailed tracking of child's academic journey
- **Weekly Activity Charts**: Visual representation of reading habits
- **Achievement Monitoring**: Track earned badges and milestones
- **Announcement Reception**: Receive class updates from teachers
- **Grade Tracking**: Monitor assignment scores and teacher feedback

## Recent Changes (July 2025 - Comprehensive Educational Platform Implementation)
- **Google Classroom-like Features**: Implemented class creation with unique codes, student enrollment system
- **Announcement System**: Replaced messaging with teacher-to-student/parent announcements only
- **Assignment Distribution**: Created comprehensive assignment management for teachers and students
- **Parent Progress Tracking**: Built detailed child monitoring with reading progress, grades, achievements
- **Dashboard Integration**: Connected all three user dashboards with full interoperability
- **Authentication System**: Fixed role-based access and session management
- **Database Schema**: Enhanced with class enrollments, parent-child links, comprehensive assignments

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