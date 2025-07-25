import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertClassSchema, insertAssignmentSchema, insertSubmissionSchema, type User } from "@shared/schema";
import { z } from "zod";
import crypto from "crypto";

// Utility functions
function generateStudentCode(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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
      if ((error as any).code === '23505') {
        return res.status(400).json({ message: "User with this email already exists" });
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
      let classes: any[];
      
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
        teacherId: req.user!.id,
        code: 'temp' // This will be overridden by createClass
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

  // Join class route with proper implementation
  app.post("/api/classes/join", authenticateUser, async (req: Request, res: Response) => {
    try {
      console.log("User attempting to join class:", req.user);
      if (req.user!.role !== 'student') {
        console.log("User role check failed. Role:", req.user!.role);
        return res.status(403).json({ message: "Only students can join classes" });
      }

      const { classCode } = req.body;
      if (!classCode) {
        return res.status(400).json({ message: "Class code is required" });
      }

      const classToJoin = await storage.getClassByCode(classCode);
      if (!classToJoin) {
        return res.status(404).json({ message: "Invalid class code" });
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getClassEnrollment(classToJoin.id, req.user!.id);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this class" });
      }

      const enrollment = await storage.createClassEnrollment({
        classId: classToJoin.id,
        studentId: req.user!.id
      });
      
      res.status(201).json({ message: "Successfully joined class", enrollment, class: classToJoin });
    } catch (error) {
      console.error("Join class error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Announcements/Messages routes for teachers to send to students and parents
  app.post("/api/announcements", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create announcements" });
      }

      const { content, classId, type = 'announcement' } = req.body;
      if (!content || !classId) {
        return res.status(400).json({ message: "Content and class ID are required" });
      }

      // Verify teacher owns the class
      const classData = await storage.getClass(classId);
      if (!classData || classData.teacherId !== req.user!.id) {
        return res.status(403).json({ message: "You can only create announcements for your own classes" });
      }

      const announcement = await storage.createMessage({
        senderId: req.user!.id,
        recipientId: classId, // Use classId as recipientId for announcements
        content,
        classId
      });
      
      res.status(201).json(announcement);
    } catch (error) {
      console.error("Create announcement error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/announcements", authenticateUser, async (req: Request, res: Response) => {
    try {
      const { classId } = req.query;
      let announcements: any[];
      
      if (req.user!.role === 'teacher') {
        announcements = await storage.getMessagesBySender(req.user!.id);
        if (classId) {
          announcements = announcements.filter(a => a.classId === classId);
        }
      } else if (req.user!.role === 'student') {
        const enrollments = await storage.getStudentEnrollments(req.user!.id);
        const classIds = enrollments.map(e => e.classId!);
        const allMessages = await storage.getAllMessages();
        announcements = allMessages.filter(m => 
          !m.recipientId // Announcements have no specific recipient
        );
      } else if (req.user!.role === 'parent') {
        // Parents see announcements for their children's classes
        // This would need proper parent-child linking implementation
        announcements = [];
      } else {
        announcements = [];
      }
      
      res.json(announcements);
    } catch (error) {
      console.error("Get announcements error:", error);
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
      let assignments: any[];
      
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
      let submissions: any[];
      
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

  // Student assignments route - get assignments for enrolled classes
  app.get("/api/student/assignments", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'student') {
        return res.status(403).json({ message: "Only students can view their assignments" });
      }

      const enrollments = await storage.getStudentEnrollments(req.user!.id);
      const classIds = enrollments.map(e => e.classId!);
      
      if (classIds.length === 0) {
        return res.json([]);
      }

      // Get all assignments for enrolled classes with submission status
      const allAssignments = await storage.getAssignmentsByTeacher(req.user!.id); // This will be replaced with proper method
      const assignments = [];
      
      for (const classId of classIds) {
        const classAssignments = await storage.getAssignmentsByClass(classId);
        for (const assignment of classAssignments) {
          const submission = await storage.getSubmissionByAssignmentAndStudent(assignment.id, req.user!.id);
          const classInfo = await storage.getClass(assignment.classId!);
          assignments.push({
            ...assignment,
            class: classInfo,
            submission
          });
        }
      }
      
      res.json(assignments);
    } catch (error) {
      console.error("Get student assignments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Student classes route - get enrolled classes with details
  app.get("/api/student/classes", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'student') {
        return res.status(403).json({ message: "Only students can view their classes" });
      }

      const enrollments = await storage.getStudentEnrollments(req.user!.id);
      
      // Get class details for each enrollment
      const classesWithDetails = await Promise.all(
        enrollments.map(async (enrollment) => {
          const classInfo = await storage.getClass(enrollment.classId!);
          const teacher = classInfo && classInfo.teacherId ? await storage.getUser(classInfo.teacherId) : null;
          
          return {
            ...enrollment,
            class: classInfo,
            teacher: teacher ? { id: teacher.id, name: teacher.name, email: teacher.email } : null
          };
        })
      );
      
      res.json(classesWithDetails);
    } catch (error) {
      console.error("Get student classes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Parent linking routes
  app.post("/api/parent/link-child", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can link to children" });
      }

      const { childCode } = req.body;
      if (!childCode) {
        return res.status(400).json({ message: "Child code is required" });
      }

      const link = await storage.linkParentWithChildCode(req.user!.id, childCode);
      res.status(201).json(link);
    } catch (error: any) {
      console.error("Link parent-child error:", error);
      res.status(400).json({ message: error.message || "Failed to link child" });
    }
  });

  app.get("/api/parent/children", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can view their children" });
      }

      const links = await storage.getParentChildren(req.user!.id);
      const childrenWithDetails = await Promise.all(
        links.map(async (link) => {
          const child = await storage.getUser(link.childId);
          const enrollments = child ? await storage.getStudentEnrollments(child.id) : [];
          return {
            ...link,
            child: child ? {
              ...child,
              password: undefined, // Don't expose password
              enrollments
            } : null
          };
        })
      );

      res.json(childrenWithDetails);
    } catch (error) {
      console.error("Get parent children error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/parent/unlink-child/:childId", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can unlink children" });
      }

      // Implementation would need to be added to storage
      res.status(501).json({ message: "Unlink functionality not implemented yet" });
    } catch (error) {
      console.error("Unlink child error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile picture routes
  app.put("/api/profile/picture", authenticateUser, async (req: Request, res: Response) => {
    try {
      const { profilePicture } = req.body;
      
      const updatedUser = await storage.updateUser(req.user!.id, { profilePicture });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile picture updated successfully", profilePicture });
    } catch (error) {
      console.error("Update profile picture error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/profile/picture", authenticateUser, async (req: Request, res: Response) => {
    try {
      const updatedUser = await storage.updateUser(req.user!.id, { profilePicture: null });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile picture removed successfully" });
    } catch (error) {
      console.error("Remove profile picture error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Live sessions routes
  app.post("/api/live-sessions", authenticateUser, async (req: Request, res: Response) => {
    try {
      if (req.user!.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can start live sessions" });
      }

      const { classId, meetingUrl, platform = 'jitsi' } = req.body;
      
      // Verify teacher owns the class
      const classData = await storage.getClass(classId);
      if (!classData || classData.teacherId !== req.user!.id) {
        return res.status(403).json({ message: "You can only start sessions for your own classes" });
      }

      // For now, we'll create a simple live session object
      // In production, this would be stored in the database
      const session = {
        id: crypto.randomUUID(),
        classId,
        meetingUrl,
        platform,
        isActive: true,
        startedAt: new Date().toISOString(),
        teacherId: req.user!.id
      };

      res.status(201).json(session);
    } catch (error) {
      console.error("Start live session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/live-sessions", authenticateUser, async (req: Request, res: Response) => {
    try {
      // For now, return empty array
      // In production, this would fetch from database
      res.json([]);
    } catch (error) {
      console.error("Get live sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/live-sessions/active", authenticateUser, async (req: Request, res: Response) => {
    try {
      // For now, return empty array
      // In production, this would fetch active sessions from database
      res.json([]);
    } catch (error) {
      console.error("Get active live sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/live-sessions/:sessionId/end", authenticateUser, async (req: Request, res: Response) => {
    try {
      // For now, just return success
      // In production, this would update the session in database
      res.json({ message: "Live session ended successfully" });
    } catch (error) {
      console.error("End live session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google Auth routes
  app.post("/api/auth/google-user", async (req: Request, res: Response) => {
    try {
      const { googleId, email } = req.body;
      
      // Check if user exists with this Google ID or email
      const existingUser = await storage.getUserByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = existingUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Google user lookup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/complete-google-signup", async (req: Request, res: Response) => {
    try {
      const { googleId, email, name, profilePicture, role } = req.body;
      
      if (!googleId || !email || !name || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user with Google data
      const userData = {
        name,
        email,
        password: '', // No password for Google users
        role,
        profilePicture,
        googleId,
        isEmailVerified: true, // Google accounts are verified
        ...(role === 'student' && { studentCode: generateStudentCode() })
      };

      const newUser = await storage.createUser(userData);
      
      // Create session
      req.session!.userId = newUser.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Complete Google signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset token validation route
  app.post("/api/auth/validate-reset-token", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Find user with this reset token that hasn't expired
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      res.json({ message: "Token is valid" });
    } catch (error) {
      console.error("Validate reset token error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Find user with this reset token that hasn't expired
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, newPassword);
      await storage.updateUser(user.id, {
        passwordResetToken: null,
        passwordResetExpires: null
      });

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset routes
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "If an account with that email exists, password reset instructions have been sent." });
      }

      // Generate a secure reset token
      const resetToken = generateResetToken();
      const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with reset token
      await storage.updateUser(user.id, {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      });

      // In production, send email with reset link using SendGrid
      console.log(`Password reset requested for: ${email}`);
      console.log(`Reset token: ${resetToken}`);
      console.log(`Reset link: ${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://your-domain.com'}/auth/reset-password?token=${resetToken}`);
      
      res.json({ message: "Password reset instructions have been sent to your email." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", authenticateUser, async (req: Request, res: Response) => {
    try {
      // For now, return empty array with proper typing
      // In production, this would fetch user-specific notifications from database
      const mockNotifications: any[] = [];
      
      // Add some sample notifications based on user role
      if (req.user!.role === 'student') {
        // In production, this would query actual assignments
        mockNotifications.push({
          id: 'sample-notification',
          type: 'assignment',
          title: 'Welcome to LitPlatform',
          message: 'Complete your profile to get started',
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'medium'
        });
      }

      res.json(mockNotifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/notifications/:id/read", authenticateUser, async (req: Request, res: Response) => {
    try {
      // In production, update notification read status in database
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/notifications/read-all", authenticateUser, async (req: Request, res: Response) => {
    try {
      // In production, mark all user notifications as read
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Mark all notifications read error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/notifications/:id", authenticateUser, async (req: Request, res: Response) => {
    try {
      // In production, delete notification from database
      res.json({ message: "Notification deleted" });
    } catch (error) {
      console.error("Delete notification error:", error);
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
