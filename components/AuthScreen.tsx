import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
  isProfileSetup?: boolean;
  onProfileSubmit?: (profile: UserProfile) => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, isProfileSetup, onProfileSubmit, onToggleTheme, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [majorSubject, setMajorSubject] = useState('');
  const [learningGoal, setLearningGoal] = useState('Understand Deeply');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthSuccess?.();
  };

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && educationLevel && majorSubject) {
      onProfileSubmit?.({ name, educationLevel, majorSubject, learningGoal, difficultyLevel });
    }
  };

  const GOALS = [
    'Understand Deeply',
    'Prepare for Exams',
    'Quick Review',
    'Master the Topic',
    'Fix Confusion'
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-all">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up relative z-10 border border-slate-100 dark:border-white/5">
        <div className="bg-mint-500 px-8 py-10 text-slate-950 text-center">
          <h2 className="text-3xl font-black mb-1 uppercase tracking-tight italic">
            {isProfileSetup ? 'Create Profile' : 'Sign In'}
          </h2>
          <p className="text-slate-950/60 text-[10px] font-black uppercase tracking-widest">
            {isProfileSetup ? 'Tell us about your learning' : 'Welcome to Lumi'}
          </p>
        </div>

        {!isProfileSetup ? (
          <form onSubmit={handleAuth} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-mint-500 outline-none transition font-bold"
                  placeholder="name@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-mint-500 outline-none transition font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="w-full py-5 bg-mint-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-mint-400 active:scale-95 transition-all">
              Log In
            </button>
          </form>
        ) : (
          <form onSubmit={handleProfile} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">What's your name?</label>
              <input type="text" required className="auth-input" placeholder="Alex" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">School Level</label>
                <select className="auth-input appearance-none cursor-pointer" value={educationLevel} onChange={e => setEducationLevel(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                  <option value="Expert">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Difficulty</label>
                <select className="auth-input appearance-none cursor-pointer" value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)}>
                  <option value="Beginner">Easy</option>
                  <option value="Intermediate">Normal</option>
                  <option value="Advanced">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">What are you studying?</label>
              <input type="text" required className="auth-input" placeholder="Physics, Art, etc." value={majorSubject} onChange={e => setMajorSubject(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Main Goal</label>
              <select className="auth-input appearance-none cursor-pointer" value={learningGoal} onChange={e => setLearningGoal(e.target.value)}>
                {GOALS.map(goal => <option key={goal} value={goal}>{goal}</option>)}
              </select>
            </div>
            <button className="w-full py-5 bg-mint-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-lg hover:bg-mint-400 transition-all active:scale-95">
              Start Learning
            </button>
          </form>
        )}
      </div>
      <style>{`
        .auth-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          outline: none;
          font-weight: 700;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .dark .auth-input {
          background: #020617;
          border-color: #1e293b;
          color: white;
        }
        .auth-input:focus {
          border-color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;