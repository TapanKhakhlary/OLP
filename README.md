# Online Learning Platform (OLP)

## Overview
This is an online learning platform designed for students, teachers, and parents to manage educational content, assignments, and track reading progress.

## Features
- User authentication (students, teachers, parents)
- Class management
- Book library and reading progress tracking
- Assignment creation and submission
- Achievement system
- Messaging between users
- Parent-child linking

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: Session-based authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd OLP
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file and add your MongoDB connection string and other required variables.

4. Start the development server
```bash
npm run dev
```

### MongoDB Setup

1. Install MongoDB locally or create a MongoDB Atlas account
2. For local installation:
   - Start MongoDB service
   - Create a database named 'olp'
3. For MongoDB Atlas:
   - Create a new cluster
   - Create a database named 'olp'
   - Create a database user
   - Get your connection string and add it to the .env file

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and schemas
- `/server/models` - MongoDB models