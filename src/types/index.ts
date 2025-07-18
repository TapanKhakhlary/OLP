export type UserRole = 'student' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classCode?: string;
  parentCode?: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  score?: number;
  feedback?: string;
  teacherId: string;
  studentId: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  status: 'reading' | 'completed' | 'wishlist';
  progress: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  dateEarned?: Date;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  students: string[];
  createdAt: Date;
}