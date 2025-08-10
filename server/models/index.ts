import mongoose from 'mongoose';
import { userSchema } from './user';
import { classSchema } from './class';
import { bookSchema } from './book';
import { assignmentSchema } from './assignment';
import { submissionSchema } from './submission';
import { achievementSchema } from './achievement';
import { userAchievementSchema } from './userAchievement';
import { readingProgressSchema } from './readingProgress';
import { messageSchema } from './message';
import { classEnrollmentSchema } from './classEnrollment';
import { parentChildLinkSchema } from './parentChildLink';

// Export all models
export const User = mongoose.model('User', userSchema);
export const Class = mongoose.model('Class', classSchema);
export const Book = mongoose.model('Book', bookSchema);
export const Assignment = mongoose.model('Assignment', assignmentSchema);
export const Submission = mongoose.model('Submission', submissionSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
export const ReadingProgress = mongoose.model('ReadingProgress', readingProgressSchema);
export const Message = mongoose.model('Message', messageSchema);
export const ClassEnrollment = mongoose.model('ClassEnrollment', classEnrollmentSchema);
export const ParentChildLink = mongoose.model('ParentChildLink', parentChildLinkSchema);