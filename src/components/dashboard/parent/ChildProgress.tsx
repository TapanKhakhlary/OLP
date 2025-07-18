import React from 'react';
import { BookOpen, Award, Clock, TrendingUp, Star } from 'lucide-react';

const ChildProgress: React.FC = () => {
  const childData = {
    name: 'Emma Johnson',
    grade: 'Grade 10',
    currentBook: 'To Kill a Mockingbird',
    progress: 68,
    readingStreak: 12,
    booksCompleted: 3,
    avgScore: 89
  };

  const upcomingDeadlines = [
    {
      assignment: 'Character Analysis Essay',
      book: 'To Kill a Mockingbird',
      dueDate: '2025-01-15',
      status: 'in-progress'
    },
    {
      assignment: 'Reading Quiz',
      book: 'The Great Gatsby',
      dueDate: '2025-01-20',
      status: 'not-started'
    }
  ];

  const recentAchievements = [
    {
      name: 'Bookworm',
      description: 'Read 10 books in a month',
      earned: '2025-01-05'
    },
    {
      name: 'Speed Reader',
      description: 'Complete a book in under 3 days',
      earned: '2024-12-28'
    }
  ];

  const favoriteGenres = [
    { genre: 'Classic Literature', count: 5 },
    { genre: 'Mystery', count: 3 },
    { genre: 'Science Fiction', count: 2 },
    { genre: 'Romance', count: 1 }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{childData.name}'s Progress</h1>
        <p className="text-gray-600">Monitor your child's reading journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{childData.booksCompleted}</h3>
          <p className="text-gray-600 text-sm">Books Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{childData.readingStreak}</h3>
          <p className="text-gray-600 text-sm">Day Reading Streak</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{childData.avgScore}%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{recentAchievements.length}</h3>
          <p className="text-gray-600 text-sm">Recent Achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Current Reading */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Reading</h3>
          <div className="flex items-center space-x-4">
            <img
              src="https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt={childData.currentBook}
              className="w-16 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{childData.currentBook}</h4>
              <p className="text-sm text-gray-600 mb-2">Harper Lee</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${childData.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{childData.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{deadline.assignment}</h4>
                  <p className="text-sm text-gray-600">{deadline.book}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(deadline.dueDate).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    deadline.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {deadline.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Earned on {new Date(achievement.earned).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Genres</h3>
          <div className="space-y-3">
            {favoriteGenres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{genre.genre}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(genre.count / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{genre.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildProgress;