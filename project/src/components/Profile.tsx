import React, { useState } from 'react';
import { User, Settings, Save, Trophy, Target, Clock, Star } from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    experience: 'intermediate',
    targetRoles: ['Frontend Developer', 'Full Stack Developer'],
    skillLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    preferredDifficulty: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  });

  const [newTargetRole, setNewTargetRole] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to a backend
    console.log('Saving profile:', profile);
  };

  const addTargetRole = () => {
    if (newTargetRole.trim() && !profile.targetRoles.includes(newTargetRole.trim())) {
      setProfile({
        ...profile,
        targetRoles: [...profile.targetRoles, newTargetRole.trim()]
      });
      setNewTargetRole('');
    }
  };

  const removeTargetRole = (role: string) => {
    setProfile({
      ...profile,
      targetRoles: profile.targetRoles.filter(r => r !== role)
    });
  };

  // Mock achievements data
  const achievements = [
    { id: 1, title: 'First Interview', description: 'Completed your first mock interview', icon: '🎯', completed: true },
    { id: 2, title: 'Star Performer', description: 'Used STAR method in 5 behavioral questions', icon: '⭐', completed: true },
    { id: 3, title: 'Technical Master', description: 'Scored 80+ on 3 technical interviews', icon: '💻', completed: false },
    { id: 4, title: 'Consistency Champion', description: 'Practiced for 7 consecutive days', icon: '🔥', completed: true },
    { id: 5, title: 'Improvement Expert', description: 'Improved score by 20+ points', icon: '📈', completed: false },
    { id: 6, title: 'Marathon Runner', description: 'Completed 50+ practice questions', icon: '🏃', completed: false }
  ];

  const stats = {
    totalSessions: 12,
    totalQuestions: 58,
    averageScore: 72,
    totalPracticeTime: 145, // minutes
    bestScore: 85,
    currentStreak: 5 // days
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Profile</h1>
        <p className="text-lg text-slate-600">Manage your interview preparation journey</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="p-3 bg-slate-50 rounded-lg">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="p-3 bg-slate-50 rounded-lg">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
            {isEditing ? (
              <select
                value={profile.skillLevel}
                onChange={(e) => setProfile({ ...profile, skillLevel: e.target.value as any })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
              </select>
            ) : (
              <p className="p-3 bg-slate-50 rounded-lg capitalize">{profile.skillLevel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Difficulty</label>
            {isEditing ? (
              <select
                value={profile.preferredDifficulty}
                onChange={(e) => setProfile({ ...profile, preferredDifficulty: e.target.value as any })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            ) : (
              <p className="p-3 bg-slate-50 rounded-lg capitalize">{profile.preferredDifficulty}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Target Roles</label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  placeholder="Add a target role..."
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addTargetRole()}
                />
                <button
                  onClick={addTargetRole}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.targetRoles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => removeTargetRole(role)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.targetRoles.map((role, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Your Progress</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.totalSessions}</p>
            <p className="text-sm text-slate-600">Sessions</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-2">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.averageScore}%</p>
            <p className="text-sm text-slate-600">Avg Score</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{Math.round(stats.totalPracticeTime / 60)}h</p>
            <p className="text-sm text-slate-600">Practice</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.bestScore}%</p>
            <p className="text-sm text-slate-600">Best Score</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-2">
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.currentStreak}</p>
            <p className="text-sm text-slate-600">Day Streak</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mx-auto mb-2">
              <span className="text-xl">❓</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.totalQuestions}</p>
            <p className="text-sm text-slate-600">Questions</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.completed ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    achievement.completed ? 'text-green-800' : 'text-slate-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.completed ? 'text-green-600' : 'text-slate-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.completed && (
                  <div className="text-green-500">
                    <Trophy className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;