import React from 'react';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const classData = [
    { name: 'English Literature - Grade 10', students: 28, avgScore: 87, completion: 92 },
    { name: 'Advanced Reading - Grade 11', students: 22, avgScore: 91, completion: 89 },
    { name: 'Creative Writing - Grade 9', students: 25, avgScore: 84, completion: 95 }
  ];

  const weeklyData = [
    { day: 'Mon', submissions: 12, avgScore: 85 },
    { day: 'Tue', submissions: 15, avgScore: 88 },
    { day: 'Wed', submissions: 8, avgScore: 82 },
    { day: 'Thu', submissions: 18, avgScore: 90 },
    { day: 'Fri', submissions: 22, avgScore: 87 },
    { day: 'Sat', submissions: 5, avgScore: 85 },
    { day: 'Sun', submissions: 3, avgScore: 89 }
  ];

  const topPerformers = [
    { name: 'Alice Johnson', class: 'Grade 10', avgScore: 96 },
    { name: 'Emma Brown', class: 'Grade 11', avgScore: 94 },
    { name: 'David Wilson', class: 'Grade 9', avgScore: 92 },
    { name: 'Carol Davis', class: 'Grade 10', avgScore: 91 },
    { name: 'Bob Smith', class: 'Grade 11', avgScore: 90 }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Analytics</h1>
        <p className="text-gray-600">Monitor student performance and engagement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">75</h3>
          <p className="text-gray-600 text-sm">Total Students</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">87%</h3>
          <p className="text-gray-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">92%</h3>
          <p className="text-gray-600 text-sm">Completion Rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">83</h3>
          <p className="text-gray-600 text-sm">Assignments This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="space-y-3">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-8">{data.day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 w-32">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${(data.submissions / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{data.submissions}</span>
                  <span className="text-xs text-gray-500 ml-2">{data.avgScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.class}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">{student.avgScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Class</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Completion Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {classData.map((cls, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{cls.name}</td>
                  <td className="py-3 px-4 text-gray-600">{cls.students}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">{cls.avgScore}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${cls.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{cls.completion}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;