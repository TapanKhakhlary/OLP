# LitPlatform - Educational Reading Platform

## Overview

LitPlatform is a comprehensive educational reading platform designed to connect students, teachers, and parents in a collaborative learning environment. The application is built as a full-stack web application with a React frontend and Express.js backend, using PostgreSQL for data persistence and featuring role-based dashboards for different user types.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication and global state
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with role-based access control
- **Development**: Hot reload with Vite middleware integration

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with websocket support for serverless environments

## Key Components

### Authentication System
- Session-based authentication with secure HTTP-only cookies
- Role-based access control (student, teacher, parent)
- Password hashing with bcrypt
- User registration with role-specific onboarding flows

### User Roles & Dashboards
- **Students**: Access library, complete assignments, track progress, join classes
- **Teachers**: Manage classes, create assignments, view student progress, communicate with parents
- **Parents**: Monitor child's progress, view results, communicate with teachers

### Database Schema
Core entities include:
- **Profiles**: User accounts with role-based permissions
- **Classes**: Teacher-managed learning groups with unique join codes
- **Books**: Digital library with metadata and reading levels
- **Assignments**: Teacher-created tasks with due dates and grading
- **Submissions**: Student work with file uploads and status tracking
- **Reading Progress**: Individual book progress and status
- **Achievements**: Gamification system for student engagement

### File Upload System
- Support for multiple file formats (PDF, DOC, images)
- Drag-and-drop interface with progress indicators
- File validation and size limits

## Data Flow

### Authentication Flow
1. User registers with role selection and validation
2. Session created with secure cookie storage
3. Role-based dashboard routing and component rendering
4. Middleware validates authentication on protected routes

### Class Management Flow
1. Teachers create classes with auto-generated codes
2. Students join classes using codes
3. Parents link to children's accounts for monitoring
4. Real-time enrollment and progress tracking

### Assignment Workflow
1. Teachers create assignments with books and due dates
2. Students receive assignments in their dashboard
3. File submissions with status tracking
4. Teacher grading and feedback system
5. Parent notifications of results

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **express-session**: Session management middleware
- **bcrypt**: Password hashing and validation
- **zod**: Runtime type validation and schema parsing

### UI Dependencies
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent UI elements

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Type safety and developer experience
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express middleware integration for API routes
- Environment-based configuration with fallbacks
- Replit-specific plugins for cloud development

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Migration system ensures schema consistency
- Environment variables for database and session configuration

### Database Provisioning
- Requires `DATABASE_URL` environment variable
- Automatic connection pooling and websocket configuration
- Schema migrations handled through Drizzle Kit
- Support for both development and production database environments

### Security Considerations
- Session secrets configurable via environment variables
- Password hashing with industry-standard algorithms
- CSRF protection through session validation
- Role-based access control on all API endpoints
- Secure cookie configuration for production environments