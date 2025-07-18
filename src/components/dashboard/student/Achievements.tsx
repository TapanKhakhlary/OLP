import React from 'react';
import { Award, BookOpen, Target, Zap, Star, Trophy } from 'lucide-react';

const Achievements: React.FC = () => {
  const achievements = [
    {
      id: 1,
      name: 'Bookworm',
      description: 'Read 10 books in a month',
      icon: BookOpen,
      earned: true,
      dateEarned: '2024-12-15',
      rarity: 'common'
    },
    {
      id: 2,
      name: 'Speed Reader',
      description: 'Complete a book in under 3 days',
      icon: Zap,
      earned: true,
      dateEarned: '2024-12-20',
      rarity: 'rare'
    },
    {
      id: 3,
      name: 'Genre Explorer',
      description: 'Read books from 5 different genres',
      icon: Target,
      earned: true,
      dateEarned: '2025-01-02',
      rarity: 'uncommon'
    },
    {
      id: 4,
      name: 'Perfect Score',
      description: 'Get 100% on an assignment',
      icon: Star,
      earned: false,
      dateEarned: null,
      rarity: 'epic'
    },
    {
      id: 5,
      name: 'Reading Streak',
      description: 'Read for 30 consecutive days',
      icon: Trophy,
      earned: false,
      dateEarned: null,
      rarity: 'legendary'
    },
    {
      id: 6,
      name: 'Essay Master',
      description: 'Submit 5 essays with A grades',
      icon: Award,
      earned: true,
      dateEarned: '2025-01-05',
      rarity: 'rare'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'uncommon':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearned = achievements.filter(a => !a.earned);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Celebrate your reading milestones and unlock rewards</p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{earnedAchievements.length}</h3>
          <p className="text-gray-600 text-sm">Achievements Earned</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Target className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{achievements.length}</h3>
          <p className="text-gray-600 text-sm">Total Achievements</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round((earnedAchievements.length / achievements.length) * 100)}%
          </h3>
          <p className="text-gray-600 text-sm">Completion Rate</p>
        </div>
      </div>

      {/* Earned Achievements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Earned Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <achievement.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
              <p className="text-green-600 text-xs font-medium">
                Earned on {new Date(achievement.dateEarned!).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Unearned Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Locked Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unearned.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300 opacity-75">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-full bg-gray-100 text-gray-400">
                  <achievement.icon className="h-6 w-6" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
              <p className="text-gray-400 text-xs font-medium">Not yet earned</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;