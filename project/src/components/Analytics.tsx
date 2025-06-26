import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Star, Target, Award, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Mock data - in a real app, this would come from a backend
  const mockData = {
    totalSessions: 12,
    totalQuestions: 58,
    averageScore: 72,
    totalPracticeTime: 145, // minutes
    improvementRate: 15, // percentage
    strongestCategories: ['Technical', 'Problem Solving'],
    weakestCategories: ['Behavioral', 'Communication'],
    recentSessions: [
      { date: '2024-01-15', type: 'Technical', score: 78, duration: 25 },
      { date: '2024-01-14', type: 'Behavioral', score: 65, duration: 18 },
      { date: '2024-01-12', type: 'Mixed', score: 82, duration: 35 },
      { date: '2024-01-10', type: 'HR', score: 68, duration: 15 },
      { date: '2024-01-08', type: 'Technical', score: 75, duration: 28 },
    ],
    scoresByCategory: {
      'Technical': [65, 70, 75, 78, 80],
      'Behavioral': [55, 58, 62, 65, 68],
      'HR': [70, 72, 68, 71, 74],
      'Design': [60, 65, 68, 70, 72]
    },
    monthlyProgress: [
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 68 },
      { month: 'Dec', score: 71 },
      { month: 'Jan', score: 72 }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getImprovementColor = (rate: number) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Performance Analytics</h1>
          <p className="text-lg text-slate-600">Track your interview preparation progress</p>
        </div>
        
        <div className="flex space-x-2">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range === 'all' ? 'All Time' : `Last ${range}`}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Sessions</p>
              <p className="text-2xl font-bold text-slate-800">{mockData.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Average Score</p>
              <p className="text-2xl font-bold text-slate-800">{mockData.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Practice Time</p>
              <p className="text-2xl font-bold text-slate-800">{Math.round(mockData.totalPracticeTime / 60)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Improvement</p>
              <p className={`text-2xl font-bold ${getImprovementColor(mockData.improvementRate)}`}>
                +{mockData.improvementRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Progress Over Time</h2>
        <div className="h-64 flex items-end justify-between space-x-4">
          {mockData.monthlyProgress.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(data.score / 100) * 200}px` }}
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-slate-700">{data.month}</p>
                <p className="text-xs text-slate-500">{data.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {Object.entries(mockData.scoresByCategory).map(([category, scores]) => {
              const latestScore = scores[scores.length - 1];
              const improvement = scores[scores.length - 1] - scores[0];
              
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-700">{category}</p>
                    <p className="text-sm text-slate-500">
                      {improvement > 0 ? '+' : ''}{improvement}% improvement
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(latestScore)}`}>
                    {latestScore}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {mockData.recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-700">{session.type}</p>
                    <p className="text-sm text-slate-500">{session.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getScoreColor(session.score).split(' ')[0]}`}>
                    {session.score}%
                  </p>
                  <p className="text-sm text-slate-500">{session.duration}m</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-slate-800">Strongest Areas</h3>
          </div>
          <div className="space-y-2">
            {mockData.strongestCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-700">{category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-slate-800">Areas for Improvement</h3>
          </div>
          <div className="space-y-2">
            {mockData.weakestCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-slate-700">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Personalized Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-2">Focus Areas</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Practice more behavioral questions using the STAR method</li>
              <li>• Work on communication clarity and structure</li>
              <li>• Prepare specific examples for teamwork scenarios</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-2">Next Steps</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Schedule 3 practice sessions this week</li>
              <li>• Review your weakest category questions</li>
              <li>• Practice with a mock interviewer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;