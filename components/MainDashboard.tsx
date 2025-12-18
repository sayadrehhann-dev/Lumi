import React from 'react';
import { UserProfile, ConceptMastery } from '../types';

interface MainDashboardProps {
  profile: UserProfile;
  history: ConceptMastery[];
  onAction: (action: string) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ profile, history, onAction }) => {
  const avgMastery = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.mastery, 0) / history.length) 
    : 0;

  const masteredCount = history.filter(h => h.mastery >= 80).length;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-slide-up">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-1">Welcome back, {profile.name}!</h2>
            <p className="text-slate-500 font-medium">You're making great progress in <span className="text-mint-600 font-bold">{profile.majorSubject}</span>.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onAction('chat')}
              className="px-6 py-3 bg-mint-500 text-white font-bold rounded-2xl shadow-xl shadow-mint-100 hover:bg-mint-600 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.521 1.282.188 2.228 1.311 2.228 2.599 0 4.31-.692 8.455-1.983 12.332a.75.75 0 01-1.054.437l-4.226-2.02a.75.75 0 01-.41-.754l.32-3.795a.75.75 0 00-.614-.806 28.528 28.528 0 00-6.83 0 .75.75 0 00-.614.806l.32 3.795a.75.75 0 01-.41.754l-4.226 2.02a.75.75 0 01-1.054-.437A49.145 49.145 0 012.62 5.37c0-1.288.946-2.411 2.228-2.599z" clipRule="evenodd" /></svg>
              Start Session
            </button>
            <button 
              onClick={() => onAction('viva')}
              className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 3.5A1.5 1.5 0 018.5 2h7A1.5 1.5 0 0117 3.5v17a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 20.5v-17z" /><path d="M4.5 4.5A1.5 1.5 0 016 3h12a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-15z" /></svg>
              AI Viva
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            title="Knowledge Coverage" 
            value={`${avgMastery}%`} 
            subtitle={`${history.length} Concepts Tracked`} 
            color="mint"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
          />
          <StatCard 
            title="Focus Areas" 
            value={`${history.filter(h => h.mastery < 50).length}`} 
            subtitle="Immediate Attention Required" 
            color="amber"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
          <StatCard 
            title="ELI Prediction" 
            value="Strong" 
            subtitle="72h Retention Stability" 
            color="teal"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>}
          />
        </div>

        {/* Next Actions & Recent Mastery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass border border-white/50 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Suggested Learning Path</h3>
            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium italic">
                  Complete your first session to generate a path.
                </div>
              ) : (
                history.filter(h => h.mastery < 80).slice(0, 3).map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-mint-200 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-mint-600 font-bold">{idx + 1}</div>
                      <div>
                        <div className="font-bold text-slate-800">{h.concept}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Priority: High</div>
                      </div>
                    </div>
                    <button onClick={() => onAction('chat')} className="p-2 rounded-lg bg-mint-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass border border-white/50 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Retention Overview</h3>
            <div className="flex flex-col items-center justify-center h-full pb-8">
              {history.length === 0 ? (
                <div className="text-slate-300 text-4xl mb-4 italic">No Data</div>
              ) : (
                <div className="w-full space-y-6">
                  {history.slice(0, 5).map((h, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        <span>{h.concept}</span>
                        <span>{h.mastery}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-mint-500 transition-all duration-1000" style={{ width: `${h.mastery}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color, icon }: any) => {
  const colorMap: any = {
    mint: 'bg-mint-50 text-mint-600 border-mint-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="glass border border-white/50 rounded-[2.5rem] p-8 shadow-sm flex items-center gap-6 hover:-translate-y-1 transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</div>
        <div className="text-3xl font-black text-slate-900 leading-none">{value}</div>
        <div className="text-xs text-slate-400 font-medium mt-1">{subtitle}</div>
      </div>
    </div>
  );
};

export default MainDashboard;