import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
  isProfileSetup?: boolean;
  onProfileSubmit?: (profile: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, isProfileSetup, onProfileSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [majorSubject, setMajorSubject] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
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

  return (
    <div className="min-h-screen bg-mint-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md glass border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-mint-500 px-8 py-10 text-white text-center">
          <h2 className="text-3xl font-black mb-2">{isProfileSetup ? 'Final Step' : 'Welcome Back'}</h2>
          <p className="text-mint-50 text-sm font-medium opacity-80">
            {isProfileSetup ? 'Let\'s personalize your experience.' : 'Log in to continue your journey.'}
          </p>
        </div>

        {!isProfileSetup ? (
          <form onSubmit={handleAuth} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-mint-200 focus:border-mint-400 outline-none transition"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-mint-200 focus:border-mint-400 outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="w-full py-4 bg-mint-500 text-white font-bold rounded-2xl shadow-lg shadow-mint-100 hover:bg-mint-600 transition-all active:scale-95">
              Secure Login
            </button>
            <p className="text-center text-xs text-slate-400">
              Demo access: Any email/password will work.
            </p>
          </form>
        ) : (
          <form onSubmit={handleProfile} className="p-8 space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
              <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-mint-200 focus:border-mint-400 transition" placeholder="e.g. Alex" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Edu Level</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-mint-200 transition bg-white" value={educationLevel} onChange={e => setEducationLevel(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Middle School">Middle</option>
                  <option value="High School">High/GSCE</option>
                  <option value="Undergraduate">Undergrad</option>
                  <option value="Postgraduate">Postgrad</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Difficulty</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-mint-200 transition bg-white" value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Inter</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Primary Subject</label>
              <input type="text" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-mint-200 transition" placeholder="e.g. Astrophysics" value={majorSubject} onChange={e => setMajorSubject(e.target.value)} />
            </div>
            <button className="w-full py-4 bg-mint-500 text-white font-bold rounded-2xl shadow-lg shadow-mint-100 hover:bg-mint-600 transition-all active:scale-95">
              Launch Session
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;