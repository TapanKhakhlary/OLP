import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertClassSchema, insertAssignmentSchema, insertSubmissionSchema, type User } from "@shared/schema";
import { z } from "zod";

// Extend the Request interface to include user and session
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Session {
      userId?: string;
    }
  }
}

// Auth middleware
const authenticateUser = async (req: Request, res: Response, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  
  req.user = user;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      
      // Remove password from response
      const { password, ...userResponse } = user;
      req.session!.userId = user.id;
      
      res.status(201).json({ user: userResponse });
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userResponse } = user;
      req.session!.userId = user.id;
      
      res.json({ user: userResponse });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticateUser, (req: Request, res: Response) => {
    const { password, ...userResponse } = req.user!;
    res.json({ user: userResponse });
  });

  // User routes
  app.get("/api/users/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Class routes
  app.get("/api/classes", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      let classes;
      
      if (user.role === 'teacher') {
        classes = await storage.getClassesByTeacher(user.id);
      } else if (user.role === 'student') {
        const enrollments = await storage.getStudentEnrollments(user.id);
        classes = await Promise.all(
          enrollments.map(enrollment => storage.getClass(enrollment.classId!))
        );
      } else {
        classes = [];
      }
      
      res.json(classes.filter(Boolean));
    } catch (error) {
      console.error("Get classes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/classes", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create classes" });
      }

      const validatedData = insertClassSchema.parse({
        ...req.body,
        teacherId: req.user!.id
      });
      
      const newClass = await storage.createClass(validatedData);
      res.status(201).json(newClass);
    } catch (error) {
      console.error("Create class error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/classes/:code/join", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'student') {
        return res.status(403).json({ message: "Only students can join classes" });
      }

      const classData = await storage.getClassByCode(req.params.code);
      if (!classData) {
        return res.status(404).json({ message: "Invalid class code" });
      }

      const enrollment = await storage.enrollStudent({
        classId: classData.id,
        studentId: req.user!.id
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Join class error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Book routes
  app.get("/api/books", authenticateUser, async (req: Request, res: Response) => {
    try {
      const books = await storage.getAllBooks();
      res.json(books);
    } catch (error) {
      console.error("Get books error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assignment routes
  app.get("/api/assignments", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      let assignments;
      
      if (user.role === 'teacher') {
        assignments = await storage.getAssignmentsByTeacher(user.id);
      } else if (user.role === 'student') {
        const enrollments = await storage.getStudentEnrollments(user.id);
        const allAssignments = await Promise.all(
          enrollments.map(enrollment => storage.getAssignmentsByClass(enrollment.classId!))
        );
        assignments = allAssignments.flat();
      } else {
        assignments = [];
      }
      
      res.json(assignments);
    } catch (error) {
      console.error("Get assignments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/assignments", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create assignments" });
      }

      const validatedData = insertAssignmentSchema.parse({
        ...req.body,
        teacherId: req.user!.id
      });
      
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submission routes
  app.get("/api/submissions", authenticateUser, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      let submissions;
      
      if (user.role === 'student') {
        submissions = await storage.getSubmissionsByStudent(user.id);
      } else if (user.role === 'teacher') {
        const assignments = await storage.getAssignmentsByTeacher(user.id);
        const allSubmissions = await Promise.all(
          assignments.map(assignment => storage.getSubmissionsByAssignment(assignment.id))
        );
        submissions = allSubmissions.flat();
      } else {
        submissions = [];
      }
      
      res.json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/submissions", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'student') {
        return res.status(403).json({ message: "Only students can create submissions" });
      }

      const validatedData = insertSubmissionSchema.parse({
        ...req.body,
        studentId: req.user!.id
      });
      
      const submission = await storage.createSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Create submission error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reading progress routes
  app.get("/api/reading-progress", authenticateUser, async (req: Request, res: Response) => {
    try {
      const progress = await storage.getUserReadingProgress(req.user!.id);
      res.json(progress);
    } catch (error) {
      console.error("Get reading progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/reading-progress/:bookId", authenticateUser, async (req: Request, res: Response) => {
    try {
      const progress = await storage.updateReadingProgress(
        req.user!.id,
        req.params.bookId,
        req.body
      );
      res.json(progress);
    } catch (error) {
      console.error("Update reading progress error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", authenticateUser, async (req: Request, res: Response) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user-achievements", authenticateUser, async (req: Request, res: Response) => {
    try {
      const userAchievements = await storage.getUserAchievements(req.user!.id);
      res.json(userAchievements);
    } catch (error) {
      console.error("Get user achievements error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
