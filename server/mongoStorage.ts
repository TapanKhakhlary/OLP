import { IStorage } from './storage';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  User, Class, Book, Assignment, Submission, Achievement,
  UserAchievement, ReadingProgress, Message, ClassEnrollment, ParentChildLink
} from './models/index';
import mongoose from 'mongoose';
import { InsertUser, InsertClass, InsertBook, InsertAssignment, InsertSubmission, 
  InsertAchievement, InsertUserAchievement, InsertReadingProgress, 
  InsertMessage, InsertClassEnrollment, InsertParentChildLink } from '@shared/schema';

export class MongoDBStorage implements IStorage {
  // Helper method to generate a unique student code
  private async generateStudentCode(): Promise<string> {
    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const existingUser = await User.findOne({ studentCode: code });
    if (existingUser) {
      return this.generateStudentCode(); // Try again if code already exists
    }
    return code;
  }

  // User/Profile methods
  async getUser(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await User.findById(id).lean();
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    return await User.findOne({ email }).lean();
  }

  async getUserByStudentCode(studentCode: string): Promise<any | undefined> {
    return await User.findOne({ studentCode }).lean();
  }

  async createUser(user: InsertUser): Promise<any> {
    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Generate student code for students
    let studentCode = null;
    if (user.role === 'student') {
      studentCode = await this.generateStudentCode();
    }
    
    // Create new user
    const newUser = new User({
      ...user,
      password: hashedPassword,
      studentCode
    });
    
    await newUser.save();
    return newUser.toObject();
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    
    // Hash password if it's being updated
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true }
    ).lean();
    
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  // Authentication methods
  async authenticateUser(email: string, password: string): Promise<any | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    return user.toObject();
  }

  // Class methods
  async getClass(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Class.findById(id).lean();
  }

  async getClassByCode(code: string): Promise<any | undefined> {
    return await Class.findOne({ code }).lean();
  }

  async getClassesByTeacher(teacherId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) return [];
    return await Class.find({ teacherId }).lean();
  }

  async createClass(classData: InsertClass): Promise<any> {
    const newClass = new Class(classData);
    await newClass.save();
    return newClass.toObject();
  }

  async updateClass(id: string, classData: Partial<InsertClass>): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Class.findByIdAndUpdate(id, { $set: classData }, { new: true }).lean();
  }

  async deleteClass(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Class.findByIdAndDelete(id);
    return !!result;
  }

  // Book methods
  async getBook(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Book.findById(id).lean();
  }

  async getAllBooks(): Promise<any[]> {
    return await Book.find().lean();
  }

  async getBooksByGenre(genre: string): Promise<any[]> {
    return await Book.find({ genre }).lean();
  }

  async createBook(book: InsertBook): Promise<any> {
    const newBook = new Book(book);
    await newBook.save();
    return newBook.toObject();
  }

  async updateBook(id: string, book: Partial<InsertBook>): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Book.findByIdAndUpdate(id, { $set: book }, { new: true }).lean();
  }

  async deleteBook(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Book.findByIdAndDelete(id);
    return !!result;
  }

  // Assignment methods
  async getAssignment(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Assignment.findById(id).lean();
  }

  async getAssignmentsByClass(classId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(classId)) return [];
    return await Assignment.find({ classId }).lean();
  }

  async getAssignmentsByTeacher(teacherId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(teacherId)) return [];
    return await Assignment.find({ teacherId }).lean();
  }

  async createAssignment(assignment: InsertAssignment): Promise<any> {
    const newAssignment = new Assignment(assignment);
    await newAssignment.save();
    return newAssignment.toObject();
  }

  async updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Assignment.findByIdAndUpdate(id, { $set: assignment }, { new: true }).lean();
  }

  async deleteAssignment(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Assignment.findByIdAndDelete(id);
    return !!result;
  }

  // Submission methods
  async getSubmission(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Submission.findById(id).lean();
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) return [];
    return await Submission.find({ assignmentId }).lean();
  }

  async getSubmissionsByStudent(studentId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];
    return await Submission.find({ studentId }).lean();
  }

  async getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(assignmentId) || !mongoose.Types.ObjectId.isValid(studentId)) return undefined;
    return await Submission.findOne({ assignmentId, studentId }).lean();
  }

  async createSubmission(submission: InsertSubmission): Promise<any> {
    const newSubmission = new Submission(submission);
    await newSubmission.save();
    return newSubmission.toObject();
  }

  async updateSubmission(id: string, submission: Partial<InsertSubmission>): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Submission.findByIdAndUpdate(id, { $set: submission }, { new: true }).lean();
  }

  async deleteSubmission(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Submission.findByIdAndDelete(id);
    return !!result;
  }

  // Achievement methods
  async getAchievement(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Achievement.findById(id).lean();
  }

  async getAllAchievements(): Promise<any[]> {
    return await Achievement.find().lean();
  }

  async createAchievement(achievement: InsertAchievement): Promise<any> {
    const newAchievement = new Achievement(achievement);
    await newAchievement.save();
    return newAchievement.toObject();
  }

  // User Achievement methods
  async getUserAchievements(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await UserAchievement.find({ userId }).populate('achievementId').lean();
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<any> {
    const newUserAchievement = new UserAchievement(userAchievement);
    await newUserAchievement.save();
    return newUserAchievement.toObject();
  }

  // Reading Progress methods
  async getReadingProgress(userId: string, bookId: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) return undefined;
    return await ReadingProgress.findOne({ userId, bookId }).lean();
  }

  async getUserReadingProgress(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await ReadingProgress.find({ userId }).populate('bookId').lean();
  }

  async updateReadingProgress(userId: string, bookId: string, progress: Partial<InsertReadingProgress>): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error('Invalid userId or bookId');
    }
    
    const existingProgress = await ReadingProgress.findOne({ userId, bookId });
    
    if (existingProgress) {
      return await ReadingProgress.findByIdAndUpdate(
        existingProgress._id,
        { $set: progress },
        { new: true }
      ).lean();
    } else {
      const newProgress = new ReadingProgress({
        userId,
        bookId,
        ...progress
      });
      await newProgress.save();
      return newProgress.toObject();
    }
  }

  // Message methods
  async getMessage(id: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    return await Message.findById(id).lean();
  }

  async getMessagesBetweenUsers(senderId: string, recipientId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientId)) return [];
    return await Message.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).sort({ createdAt: 1 }).lean();
  }

  async getUserMessages(userId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    return await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    }).sort({ createdAt: -1 }).lean();
  }

  async getMessagesBySender(senderId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(senderId)) return [];
    return await Message.find({ senderId }).sort({ createdAt: -1 }).lean();
  }

  async getAllMessages(): Promise<any[]> {
    return await Message.find().sort({ createdAt: -1 }).lean();
  }

  async createMessage(message: InsertMessage): Promise<any> {
    const newMessage = new Message(message);
    await newMessage.save();
    return newMessage.toObject();
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Message.findByIdAndUpdate(id, {
      $set: { isRead: true, readAt: new Date() }
    });
    return !!result;
  }

  // Class Enrollment methods
  async enrollStudent(enrollment: InsertClassEnrollment): Promise<any> {
    return this.createClassEnrollment(enrollment);
  }

  async createClassEnrollment(enrollment: InsertClassEnrollment): Promise<any> {
    const newEnrollment = new ClassEnrollment(enrollment);
    await newEnrollment.save();
    return newEnrollment.toObject();
  }

  async getClassEnrollment(classId: string, studentId: string): Promise<any | undefined> {
    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) return undefined;
    return await ClassEnrollment.findOne({ classId, studentId }).lean();
  }

  async getStudentEnrollments(studentId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];
    return await ClassEnrollment.find({ studentId }).populate('classId').lean();
  }

  async getClassEnrollments(classId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(classId)) return [];
    return await ClassEnrollment.find({ classId }).populate('studentId').lean();
  }

  async unenrollStudent(classId: string, studentId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) return false;
    const result = await ClassEnrollment.findOneAndDelete({ classId, studentId });
    return !!result;
  }

  // Parent-Child Link methods
  async linkParentChild(link: InsertParentChildLink): Promise<any> {
    const newLink = new ParentChildLink(link);
    await newLink.save();
    return newLink.toObject();
  }

  async getParentChildren(parentId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(parentId)) return [];
    return await ParentChildLink.find({ parentId }).populate('childId').lean();
  }

  async getChildParents(childId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(childId)) return [];
    return await ParentChildLink.find({ childId }).populate('parentId').lean();
  }

  // Parent signup with child code
  async linkParentWithChildCode(parentId: string, childCode: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parentId');
    }
    
    const child = await User.findOne({ studentCode: childCode });
    if (!child) {
      throw new Error('Child not found with the provided code');
    }
    
    // Check if link already exists
    const existingLink = await ParentChildLink.findOne({ parentId, childId: child._id });
    if (existingLink) {
      return existingLink.toObject();
    }
    
    // Create new link
    const newLink = new ParentChildLink({
      parentId,
      childId: child._id
    });
    
    await newLink.save();
    return newLink.toObject();
  }
}