import { 
  profiles, classes, books, assignments, submissions, achievements, 
  userAchievements, readingProgress, messages, classEnrollments, parentChildLinks,
  type Profile, type InsertProfile, type Class, type InsertClass, 
  type Book, type InsertBook, type Assignment, type InsertAssignment,
  type Submission, type InsertSubmission, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement, type ReadingProgress, 
  type InsertReadingProgress, type Message, type InsertMessage,
  type ClassEnrollment, type InsertClassEnrollment, type ParentChildLink,
  type InsertParentChildLink, type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Storage interface with all CRUD methods needed for the LitPlatform
export interface IStorage {
  // User/Profile methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Authentication methods
  authenticateUser(email: string, password: string): Promise<User | null>;
  
  // Class methods
  getClass(id: string): Promise<Class | undefined>;
  getClassByCode(code: string): Promise<Class | undefined>;
  getClassesByTeacher(teacherId: string): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined>;
  deleteClass(id: string): Promise<boolean>;
  
  // Book methods
  getBook(id: string): Promise<Book | undefined>;
  getAllBooks(): Promise<Book[]>;
  getBooksByGenre(genre: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: string): Promise<boolean>;
  
  // Assignment methods
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAssignmentsByClass(classId: string): Promise<Assignment[]>;
  getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
  
  // Submission methods
  getSubmission(id: string): Promise<Submission | undefined>;
  getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]>;
  getSubmissionsByStudent(studentId: string): Promise<Submission[]>;
  getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmission(id: string, submission: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: string): Promise<boolean>;
  
  // Achievement methods
  getAchievement(id: string): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User Achievement methods
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Reading Progress methods
  getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | undefined>;
  getUserReadingProgress(userId: string): Promise<ReadingProgress[]>;
  updateReadingProgress(userId: string, bookId: string, progress: Partial<InsertReadingProgress>): Promise<ReadingProgress>;
  
  // Message methods
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesBetweenUsers(senderId: string, recipientId: string): Promise<Message[]>;
  getUserMessages(userId: string): Promise<Message[]>;
  getMessagesBySender(senderId: string): Promise<Message[]>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<boolean>;
  
  // Class Enrollment methods
  enrollStudent(enrollment: InsertClassEnrollment): Promise<ClassEnrollment>;
  createClassEnrollment(enrollment: InsertClassEnrollment): Promise<ClassEnrollment>;
  getClassEnrollment(classId: string, studentId: string): Promise<ClassEnrollment | undefined>;
  getStudentEnrollments(studentId: string): Promise<ClassEnrollment[]>;
  getClassEnrollments(classId: string): Promise<ClassEnrollment[]>;
  unenrollStudent(classId: string, studentId: string): Promise<boolean>;
  
  // Parent-Child Link methods
  linkParentChild(link: InsertParentChildLink): Promise<ParentChildLink>;
  getParentChildren(parentId: string): Promise<ParentChildLink[]>;
  getChildParents(childId: string): Promise<ParentChildLink[]>;
}

export class DatabaseStorage implements IStorage {
  // User/Profile methods
  async getUser(id: string): Promise<User | undefined> {
    const user = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return user[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return user[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await db.insert(profiles).values({
      ...user,
      password: hashedPassword,
      id: crypto.randomUUID(),
    }).returning();
    return newUser[0];
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const updated = await db.update(profiles)
      .set(userData)
      .where(eq(profiles.id, id))
      .returning();
    return updated[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(profiles).where(eq(profiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? user : null;
  }

  // Class methods
  async getClass(id: string): Promise<Class | undefined> {
    const classData = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
    return classData[0];
  }

  async getClassByCode(code: string): Promise<Class | undefined> {
    const classData = await db.select().from(classes).where(eq(classes.code, code)).limit(1);
    return classData[0];
  }

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.teacherId, teacherId));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    // Generate a unique class code
    const generateClassCode = (): string => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    
    let classCode = generateClassCode();
    // Ensure the code is unique
    let existingClass = await this.getClassByCode(classCode);
    while (existingClass) {
      classCode = generateClassCode();
      existingClass = await this.getClassByCode(classCode);
    }
    
    const newClass = await db.insert(classes).values({
      ...classData,
      code: classCode,
      id: crypto.randomUUID(),
    }).returning();
    return newClass[0];
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<Class | undefined> {
    const updated = await db.update(classes)
      .set(classData)
      .where(eq(classes.id, id))
      .returning();
    return updated[0];
  }

  async deleteClass(id: string): Promise<boolean> {
    const result = await db.delete(classes).where(eq(classes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Book methods
  async getBook(id: string): Promise<Book | undefined> {
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return book[0];
  }

  async getAllBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBooksByGenre(genre: string): Promise<Book[]> {
    return await db.select().from(books).where(eq(books.genre, genre));
  }

  async createBook(book: InsertBook): Promise<Book> {
    const newBook = await db.insert(books).values({
      ...book,
      id: crypto.randomUUID(),
    }).returning();
    return newBook[0];
  }

  async updateBook(id: string, book: Partial<InsertBook>): Promise<Book | undefined> {
    const updated = await db.update(books)
      .set(book)
      .where(eq(books.id, id))
      .returning();
    return updated[0];
  }

  async deleteBook(id: string): Promise<boolean> {
    const result = await db.delete(books).where(eq(books.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Assignment methods
  async getAssignment(id: string): Promise<Assignment | undefined> {
    const assignment = await db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
    return assignment[0];
  }

  async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.classId, classId));
  }

  async getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.teacherId, teacherId));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const newAssignment = await db.insert(assignments).values({
      ...assignment,
      id: crypto.randomUUID(),
    }).returning();
    return newAssignment[0];
  }

  async updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const updated = await db.update(assignments)
      .set(assignment)
      .where(eq(assignments.id, id))
      .returning();
    return updated[0];
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await db.delete(assignments).where(eq(assignments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Submission methods
  async getSubmission(id: string): Promise<Submission | undefined> {
    const submission = await db.select().from(submissions).where(eq(submissions.id, id)).limit(1);
    return submission[0];
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
  }

  async getSubmissionsByStudent(studentId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.studentId, studentId));
  }

  async getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<Submission | undefined> {
    const submission = await db.select().from(submissions)
      .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)))
      .limit(1);
    return submission[0];
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const newSubmission = await db.insert(submissions).values({
      ...submission,
      id: crypto.randomUUID(),
    }).returning();
    return newSubmission[0];
  }

  async updateSubmission(id: string, submission: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const updated = await db.update(submissions)
      .set(submission)
      .where(eq(submissions.id, id))
      .returning();
    return updated[0];
  }

  async deleteSubmission(id: string): Promise<boolean> {
    const result = await db.delete(submissions).where(eq(submissions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Achievement methods
  async getAchievement(id: string): Promise<Achievement | undefined> {
    const achievement = await db.select().from(achievements).where(eq(achievements.id, id)).limit(1);
    return achievement[0];
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const newAchievement = await db.insert(achievements).values({
      ...achievement,
      id: crypto.randomUUID(),
    }).returning();
    return newAchievement[0];
  }

  // User Achievement methods
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const newUserAchievement = await db.insert(userAchievements).values({
      ...userAchievement,
      id: crypto.randomUUID(),
    }).returning();
    return newUserAchievement[0];
  }

  // Reading Progress methods
  async getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | undefined> {
    const progress = await db.select().from(readingProgress)
      .where(and(eq(readingProgress.userId, userId), eq(readingProgress.bookId, bookId)))
      .limit(1);
    return progress[0];
  }

  async getUserReadingProgress(userId: string): Promise<ReadingProgress[]> {
    return await db.select().from(readingProgress).where(eq(readingProgress.userId, userId));
  }

  async updateReadingProgress(userId: string, bookId: string, progress: Partial<InsertReadingProgress>): Promise<ReadingProgress> {
    const existing = await this.getReadingProgress(userId, bookId);
    if (existing) {
      const updated = await db.update(readingProgress)
        .set(progress)
        .where(and(eq(readingProgress.userId, userId), eq(readingProgress.bookId, bookId)))
        .returning();
      return updated[0];
    } else {
      const newProgress = await db.insert(readingProgress).values({
        ...progress,
        userId,
        bookId,
        id: crypto.randomUUID(),
      }).returning();
      return newProgress[0];
    }
  }

  // Message methods
  async getMessage(id: string): Promise<Message | undefined> {
    const message = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return message[0];
  }

  async getMessagesBetweenUsers(senderId: string, recipientId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(and(eq(messages.senderId, senderId), eq(messages.recipientId, recipientId)));
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.recipientId, userId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage = await db.insert(messages).values({
      ...message,
      id: crypto.randomUUID(),
    }).returning();
    return newMessage[0];
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db.update(messages)
      .set({ read: true })
      .where(eq(messages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getMessagesBySender(senderId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.senderId, senderId));
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  // Class Enrollment methods
  async enrollStudent(enrollment: InsertClassEnrollment): Promise<ClassEnrollment> {
    const newEnrollment = await db.insert(classEnrollments).values({
      ...enrollment,
      id: crypto.randomUUID(),
    }).returning();
    return newEnrollment[0];
  }

  async createClassEnrollment(enrollment: InsertClassEnrollment): Promise<ClassEnrollment> {
    return this.enrollStudent(enrollment);
  }

  async getClassEnrollment(classId: string, studentId: string): Promise<ClassEnrollment | undefined> {
    const enrollment = await db.select().from(classEnrollments)
      .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)))
      .limit(1);
    return enrollment[0];
  }

  async getStudentEnrollments(studentId: string): Promise<ClassEnrollment[]> {
    return await db.select().from(classEnrollments).where(eq(classEnrollments.studentId, studentId));
  }

  async getClassEnrollments(classId: string): Promise<ClassEnrollment[]> {
    return await db.select().from(classEnrollments).where(eq(classEnrollments.classId, classId));
  }

  async unenrollStudent(classId: string, studentId: string): Promise<boolean> {
    const result = await db.delete(classEnrollments)
      .where(and(eq(classEnrollments.classId, classId), eq(classEnrollments.studentId, studentId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Parent-Child Link methods
  async linkParentChild(link: InsertParentChildLink): Promise<ParentChildLink> {
    const newLink = await db.insert(parentChildLinks).values({
      ...link,
      id: crypto.randomUUID(),
    }).returning();
    return newLink[0];
  }

  async getParentChildren(parentId: string): Promise<ParentChildLink[]> {
    return await db.select().from(parentChildLinks).where(eq(parentChildLinks.parentId, parentId));
  }

  async getChildParents(childId: string): Promise<ParentChildLink[]> {
    return await db.select().from(parentChildLinks).where(eq(parentChildLinks.childId, childId));
  }
}

// Legacy MemStorage for backward compatibility
export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Stub implementations for other methods
  async updateUser(): Promise<User | undefined> { throw new Error("Not implemented in MemStorage"); }
  async deleteUser(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async authenticateUser(): Promise<User | null> { throw new Error("Not implemented in MemStorage"); }
  async getClass(): Promise<Class | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getClassByCode(): Promise<Class | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getClassesByTeacher(): Promise<Class[]> { throw new Error("Not implemented in MemStorage"); }
  async createClass(): Promise<Class> { throw new Error("Not implemented in MemStorage"); }
  async updateClass(): Promise<Class | undefined> { throw new Error("Not implemented in MemStorage"); }
  async deleteClass(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async getBook(): Promise<Book | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getAllBooks(): Promise<Book[]> { throw new Error("Not implemented in MemStorage"); }
  async getBooksByGenre(): Promise<Book[]> { throw new Error("Not implemented in MemStorage"); }
  async createBook(): Promise<Book> { throw new Error("Not implemented in MemStorage"); }
  async updateBook(): Promise<Book | undefined> { throw new Error("Not implemented in MemStorage"); }
  async deleteBook(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async getAssignment(): Promise<Assignment | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getAssignmentsByClass(): Promise<Assignment[]> { throw new Error("Not implemented in MemStorage"); }
  async getAssignmentsByTeacher(): Promise<Assignment[]> { throw new Error("Not implemented in MemStorage"); }
  async createAssignment(): Promise<Assignment> { throw new Error("Not implemented in MemStorage"); }
  async updateAssignment(): Promise<Assignment | undefined> { throw new Error("Not implemented in MemStorage"); }
  async deleteAssignment(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async getSubmission(): Promise<Submission | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getSubmissionsByAssignment(): Promise<Submission[]> { throw new Error("Not implemented in MemStorage"); }
  async getSubmissionsByStudent(): Promise<Submission[]> { throw new Error("Not implemented in MemStorage"); }
  async getSubmissionByAssignmentAndStudent(): Promise<Submission | undefined> { throw new Error("Not implemented in MemStorage"); }
  async createSubmission(): Promise<Submission> { throw new Error("Not implemented in MemStorage"); }
  async updateSubmission(): Promise<Submission | undefined> { throw new Error("Not implemented in MemStorage"); }
  async deleteSubmission(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async getAchievement(): Promise<Achievement | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getAllAchievements(): Promise<Achievement[]> { throw new Error("Not implemented in MemStorage"); }
  async createAchievement(): Promise<Achievement> { throw new Error("Not implemented in MemStorage"); }
  async getUserAchievements(): Promise<UserAchievement[]> { throw new Error("Not implemented in MemStorage"); }
  async awardAchievement(): Promise<UserAchievement> { throw new Error("Not implemented in MemStorage"); }
  async getReadingProgress(): Promise<ReadingProgress | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getUserReadingProgress(): Promise<ReadingProgress[]> { throw new Error("Not implemented in MemStorage"); }
  async updateReadingProgress(): Promise<ReadingProgress> { throw new Error("Not implemented in MemStorage"); }
  async getMessage(): Promise<Message | undefined> { throw new Error("Not implemented in MemStorage"); }
  async getMessagesBetweenUsers(): Promise<Message[]> { throw new Error("Not implemented in MemStorage"); }
  async getUserMessages(): Promise<Message[]> { throw new Error("Not implemented in MemStorage"); }
  async createMessage(): Promise<Message> { throw new Error("Not implemented in MemStorage"); }
  async markMessageAsRead(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async enrollStudent(): Promise<ClassEnrollment> { throw new Error("Not implemented in MemStorage"); }
  async getStudentEnrollments(): Promise<ClassEnrollment[]> { throw new Error("Not implemented in MemStorage"); }
  async getClassEnrollments(): Promise<ClassEnrollment[]> { throw new Error("Not implemented in MemStorage"); }
  async unenrollStudent(): Promise<boolean> { throw new Error("Not implemented in MemStorage"); }
  async linkParentChild(): Promise<ParentChildLink> { throw new Error("Not implemented in MemStorage"); }
  async getParentChildren(): Promise<ParentChildLink[]> { throw new Error("Not implemented in MemStorage"); }
  async getChildParents(): Promise<ParentChildLink[]> { throw new Error("Not implemented in MemStorage"); }
  async getMessagesBySender(): Promise<Message[]> { throw new Error("Not implemented in MemStorage"); }
  async getAllMessages(): Promise<Message[]> { throw new Error("Not implemented in MemStorage"); }
  async createClassEnrollment(): Promise<ClassEnrollment> { throw new Error("Not implemented in MemStorage"); }
  async getClassEnrollment(): Promise<ClassEnrollment | undefined> { throw new Error("Not implemented in MemStorage"); }
}

export const storage = new DatabaseStorage();
