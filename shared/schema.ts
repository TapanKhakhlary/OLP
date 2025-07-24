import { pgTable, text, serial, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'parent']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['not-started', 'in-progress', 'submitted', 'graded']);
export const readingStatusEnum = pgEnum('reading_status', ['reading', 'completed', 'wishlist']);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  teacherId: uuid("teacher_id").references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const books = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  genre: text("genre").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  readingLevel: text("reading_level"),
  pages: integer("pages").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  bookId: uuid("book_id").references(() => books.id),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").references(() => profiles.id, { onDelete: "cascade" }),
  dueDate: timestamp("due_date").notNull(),
  maxScore: integer("max_score").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").references(() => assignments.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content"),
  status: assignmentStatusEnum("status").default('not-started'),
  score: integer("score"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").default('common'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const readingProgress = pgTable("reading_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  bookId: uuid("book_id").references(() => books.id, { onDelete: "cascade" }),
  status: readingStatusEnum("status").default('reading'),
  progress: integer("progress").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").references(() => profiles.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id").references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classEnrollments = pgTable("class_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  classId: uuid("class_id").references(() => classes.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").references(() => profiles.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

export const parentChildLinks = pgTable("parent_child_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references(() => profiles.id, { onDelete: "cascade" }),
  childId: uuid("child_id").references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  teacherClasses: many(classes),
  assignments: many(assignments),
  submissions: many(submissions),
  userAchievements: many(userAchievements),
  readingProgress: many(readingProgress),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "recipient" }),
  classEnrollments: many(classEnrollments),
  parentLinks: many(parentChildLinks, { relationName: "parent" }),
  childLinks: many(parentChildLinks, { relationName: "child" }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(profiles, {
    fields: [classes.teacherId],
    references: [profiles.id],
  }),
  assignments: many(assignments),
  enrollments: many(classEnrollments),
}));

export const booksRelations = relations(books, ({ many }) => ({
  assignments: many(assignments),
  readingProgress: many(readingProgress),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  book: one(books, {
    fields: [assignments.bookId],
    references: [books.id],
  }),
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  teacher: one(profiles, {
    fields: [assignments.teacherId],
    references: [profiles.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(profiles, {
    fields: [submissions.studentId],
    references: [profiles.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(profiles, {
    fields: [userAchievements.userId],
    references: [profiles.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(profiles, {
    fields: [readingProgress.userId],
    references: [profiles.id],
  }),
  book: one(books, {
    fields: [readingProgress.bookId],
    references: [books.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(profiles, {
    fields: [messages.senderId],
    references: [profiles.id],
    relationName: "sender",
  }),
  recipient: one(profiles, {
    fields: [messages.recipientId],
    references: [profiles.id],
    relationName: "recipient",
  }),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
  class: one(classes, {
    fields: [classEnrollments.classId],
    references: [classes.id],
  }),
  student: one(profiles, {
    fields: [classEnrollments.studentId],
    references: [profiles.id],
  }),
}));

export const parentChildLinksRelations = relations(parentChildLinks, ({ one }) => ({
  parent: one(profiles, {
    fields: [parentChildLinks.parentId],
    references: [profiles.id],
    relationName: "parent",
  }),
  child: one(profiles, {
    fields: [parentChildLinks.childId],
    references: [profiles.id],
    relationName: "child",
  }),
}));

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  startedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertParentChildLinkSchema = createInsertSchema(parentChildLinks).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertClassEnrollment = z.infer<typeof insertClassEnrollmentSchema>;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type InsertParentChildLink = z.infer<typeof insertParentChildLinkSchema>;
export type ParentChildLink = typeof parentChildLinks.$inferSelect;

// Legacy compatibility (keeping the old user table name for backward compatibility)
export const users = profiles;
export const insertUserSchema = insertProfileSchema;
export type InsertUser = InsertProfile;
export type User = Profile;
