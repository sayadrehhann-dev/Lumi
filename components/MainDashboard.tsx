import React, { useState, useEffect } from 'react';
import { UserProfile, ConceptMastery } from '../types';

interface MainDashboardProps {
  profile: UserProfile;
  history: ConceptMastery[];
  onAction: (action: string) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ profile, history, onAction }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const avgMastery = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.mastery, 0) / history.length) 
    : 0;

  return (
    <div className="h-full overflow-y-auto bg-lumi-slate-50 dark:bg-lumi-slate-950 p-4 sm:p-8 lg:p-12 scrollbar-hide text-slate-900 dark:text-white transition-all">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 animate-slide-up">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse shadow-lg"></div>
               <span className="text-[10px] font-black text-mint-600 dark:text-mint-400 uppercase tracking-widest">Lumi is Active</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Hi, <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-900 dark:from-white to-slate-400">{profile.name}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <span>Goal: {profile.learningGoal}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
              <span>Focus: {profile.majorSubject}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <div className="p-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] flex gap-1.5 w-full sm:w-auto shadow-xl">
                <HubBtn 
                  onClick={() => onAction('chat')} 
                  label="Chat Helper" 
                  active 
                />
                <HubBtn 
                  onClick={() => onAction('viva')} 
                  label="Talk to Lumi" 
                />
             </div>
             <button 
                onClick={() => onAction('infographic')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black uppercase tracking-widest rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Create Images
              </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          <StatBox 
            title="Clarity Score" 
            value={`${avgMastery}%`} 
            desc="Your understanding level"
            color="mint"
            icon="✨"
          />
          <StatBox 
            title="Things to Review" 
            value={`${history.filter(h => h.mastery < 60).length}`} 
            desc="Topics that need work"
            color="amber"
            icon="🔍"
          />
          <StatBox 
            title="Study Progress" 
            value={avgMastery >= 60 ? "GREAT" : "STABLE"} 
            desc="Your current pace"
            color="blue"
            icon="🚀"
          />
        </div>

        {/* Action List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 sm:p-10 shadow-xl space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
              <h3 className="text-sm font-black text-mint-600 dark:text-mint-400 uppercase tracking-widest">Recommended Topics</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Start Here</span>
            </div>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic font-bold">Ask Lumi a question to start!</div>
              ) : (
                history.filter(h => h.mastery < 85).slice(0, 4).map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[2rem] hover:scale-[1.02] transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-mint-500 rounded-xl flex items-center justify-center text-slate-950 font-black">{idx + 1}</div>
                      <div>
                        <div className="font-black text-slate-900 dark:text-white text-xl tracking-tight">{h.concept}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.mastery}% Clear</div>
                      </div>
                    </div>
                    <button onClick={() => onAction('chat')} className="p-3 bg-mint-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 sm:p-10 shadow-xl flex flex-col justify-center items-center text-center space-y-6">
             <div className="text-5xl">🎨</div>
             <h3 className="text-2xl font-black tracking-tight">Image Study Tool</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">Turn your notes into easy diagrams and pictures with Lumi's smart image engine.</p>
             <button onClick={() => onAction('infographic')} className="px-10 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-mint-500 transition-all">
                Open Image Lab
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HubBtn = ({ onClick, label, active }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 px-6 rounded-[1.75rem] font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${
      active ? 'bg-mint-500 text-slate-950 shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
    }`}
  >
    {label}
  </button>
);

const StatBox = ({ title, value, desc, color, icon }: any) => {
  const colors: any = {
    mint: 'bg-mint-500/10 text-mint-600 border-mint-500/20',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-xl flex items-center gap-8 group hover:-translate-y-1 transition-all">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 transition-transform group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</div>
        <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{desc}</div>
      </div>
    </div>
  );
};

export default MainDashboard;