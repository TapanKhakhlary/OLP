# LitPlatform - Educational Reading Platform

## Project Overview
LitPlatform is a comprehensive educational reading platform designed for teachers, students, and parents. The platform facilitates classroom management, reading assignments, progress tracking, and achievement systems.

**Current Status**: Successfully migrated from Supabase to Replit's PostgreSQL environment with Drizzle ORM. Full-stack application running with authentication, database operations, and client-server communication.

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

## Recent Changes (July 2025 - Migration and Full Platform Implementation)
- **Successfully Migrated to Replit**: Completed full migration from Replit Agent to standard Replit environment with PostgreSQL database
- **Enhanced Assignment System**: Upgraded assignment creation with Google Classroom-style features including file uploads, YouTube links, topic categorization, and due dates
- **Fixed Class Join Bug**: Resolved critical issue where class joining didn't update frontend immediately - now properly invalidates cache and updates UI
- **Parent-Child Linking System**: Implemented robust student code generation and parent account linking with visual student code display in settings
- **SendGrid Email Integration**: Implemented secure forgot password workflow with professional HTML email templates and 1-hour token expiration
- **Live Class Integration**: Built comprehensive Jitsi Meet integration with teacher-initiated sessions, student notifications, and real-time polling
- **Notification System**: Created comprehensive notification center with real-time updates, priority levels, and user-specific filtering
- **Type Safety Improvements**: Fixed TypeScript errors across components ensuring robust type checking and better development experience
- **System Integration**: All features now work together seamlessly with proper authentication, authorization, and data flow
- **Production Ready**: Application is fully functional with all 7 requested Google Classroom-aligned features implemented and tested

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