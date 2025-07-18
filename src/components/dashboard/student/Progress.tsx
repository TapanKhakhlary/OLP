import React from 'react';
import { TrendingUp, BookOpen, Target, Clock } from 'lucide-react';

const Progress: React.FC = () => {
  const stats = [
    {
      title: 'Books Read This Month',
      value: '3',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Reading Streak',
      value: '12 days',
      icon: Target,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Reading Time',
      value: '24 hours',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Average Score',
      value: '87%',
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const readingTimeData = [
    { day: 'Mon', time: 45 },
    { day: 'Tue', time: 60 },
    { day: 'Wed', time: 30 },
    { day: 'Thu', time: 75 },
    { day: 'Fri', time: 90 },
    { day: 'Sat', time: 120 },
    { day: 'Sun', time: 85 }
  ];

  const monthlyBooks = [
    { month: 'Sep', books: 2 },
    { month: 'Oct', books: 3 },
    { month: 'Nov', books: 4 },
    { month: 'Dec', books: 3 },
    { month: 'Jan', books: 3 }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
        <p className="text-gray-600">Monitor your reading journey and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Time Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Time This Week</h3>
          <div className="space-y-3">
            {readingTimeData.map((data, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{data.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(data.time / 120) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{data.time}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Books Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Books Finished Per Month</h3>
          <div className="space-y-3">
            {monthlyBooks.map((data, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{data.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(data.books / 5) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{data.books} books</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;