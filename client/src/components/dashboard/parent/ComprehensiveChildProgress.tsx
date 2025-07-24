import React, { useState } from 'react';
import { 
  BookOpen, Award, Clock, TrendingUp, Star, Calendar, 
  FileText, CheckCircle, AlertCircle, BarChart3, Users,
  Target, Activity, BookMarked
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';

const ComprehensiveChildProgress: React.FC = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string>('');

  // Mock data for comprehensive child progress - replace with real API calls
  const { data: linkedChildren = [] } = useQuery({
    queryKey: ['/parent-children'],
    enabled: !!user && user.role === 'parent',
  });

  const { data: childProgress = null } = useQuery({
    queryKey: ['/child-progress', selectedChild],
    enabled: !!selectedChild,
  });

  const mockChildProgress = {
    child: {
      name: 'Emma Johnson',
      grade: '4th Grade',
      avatar: 'EJ'
    },
    overview: {
      totalBooksRead: 12,
      currentStreak: 7,
      averageScore: 89,
      totalAchievements: 8
    },
    currentReading: [
      {
        id: '1',
        title: 'Charlotte\'s Web',
        author: 'E.B. White',
        progress: 65,
        status: 'reading',
        dueDate: '2024-02-15'
      },
      {
        id: '2',
        title: 'The Magic Tree House',
        author: 'Mary Pope Osborne',
        progress: 100,
        status: 'completed',
        completedDate: '2024-01-20'
      }
    ],
    assignments: [
      {
        id: '1',
        title: 'Book Report: Charlotte\'s Web',
        subject: 'English',
        status: 'in-progress',
        dueDate: '2024-02-20',
        score: null
      },
      {
        id: '2',
        title: 'Reading Comprehension Quiz',
        subject: 'English',
        status: 'graded',
        dueDate: '2024-01-25',
        score: 92,
        maxScore: 100
      }
    ],
    recentAchievements: [
      {
        id: '1',
        name: 'Speed Reader',
        description: 'Completed 5 books in a month',
        icon: '📚',
        earnedDate: '2024-01-15'
      },
      {
        id: '2',
        name: 'Quiz Master',
        description: 'Scored 90+ on 3 consecutive quizzes',
        icon: '🏆',
        earnedDate: '2024-01-10'
      }
    ],
    weeklyActivity: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 30 },
      { day: 'Wed', minutes: 60 },
      { day: 'Thu', minutes: 25 },
      { day: 'Fri', minutes: 40 },
      { day: 'Sat', minutes: 55 },
      { day: 'Sun', minutes: 35 }
    ],
    classProgress: [
      {
        className: 'Mrs. Smith\'s 4th Grade',
        teacher: 'Mrs. Smith',
        assignmentsCompleted: 8,
        totalAssignments: 10,
        averageGrade: 'A-'
      }
    ]
  };

  const progress = childProgress || mockChildProgress;

  if (linkedChildren.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Child's Progress</h1>
          <p className="text-gray-600">Monitor your child's complete reading journey</p>
        </div>

        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No children linked yet</h3>
          <p className="text-gray-600 mb-4">Link your child's account to see their comprehensive progress</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Link Child Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Child's Progress</h1>
        <p className="text-gray-600">Complete overview of your child's academic journey</p>
      </div>

      {linkedChildren.length > 1 && (
        <div className="mb-6">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a child</option>
            {linkedChildren.map((child: any) => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Child Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
            {progress.child.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{progress.child.name}</h2>
            <p className="text-purple-100">{progress.child.grade}</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress.overview.totalBooksRead}</p>
              <p className="text-sm text-gray-600">Books Read</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress.overview.currentStreak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress.overview.averageScore}%</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress.overview.totalAchievements}</p>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Reading & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Current Reading */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BookMarked className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Current Reading</h3>
          </div>

          <div className="space-y-4">
            {progress.currentReading.map((book: any) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {book.status === 'completed' ? 'Completed' : 'Reading'}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{book.progress}% complete</span>
                  {book.status === 'reading' && (
                    <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                  )}
                  {book.status === 'completed' && (
                    <span>Completed: {new Date(book.completedDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Assignments</h3>
          </div>

          <div className="space-y-4">
            {progress.assignments.map((assignment: any) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {assignment.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  {assignment.score !== null && (
                    <span className="font-medium text-green-600">
                      Score: {assignment.score}/{assignment.maxScore}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Reading Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-orange-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Weekly Activity</h3>
          </div>

          <div className="space-y-3">
            {progress.weeklyActivity.map((day: any) => (
              <div key={day.day} className="flex items-center">
                <span className="w-12 text-sm text-gray-600">{day.day}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full" 
                      style={{ width: `${(day.minutes / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{day.minutes} min</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Achievements</h3>
          </div>

          <div className="space-y-4">
            {progress.recentAchievements.map((achievement: any) => (
              <div key={achievement.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <div className="text-2xl mr-3">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Class Progress</h3>
        </div>

        <div className="space-y-4">
          {progress.classProgress.map((classInfo: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{classInfo.className}</h4>
                  <p className="text-sm text-gray-600">Teacher: {classInfo.teacher}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{classInfo.averageGrade}</p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Assignments: {classInfo.assignmentsCompleted}/{classInfo.totalAssignments} completed
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(classInfo.assignmentsCompleted / classInfo.totalAssignments) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveChildProgress;