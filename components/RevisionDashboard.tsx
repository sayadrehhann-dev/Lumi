import React, { useState, useMemo, useEffect } from 'react';
import { ConceptMastery, ActivityEvent, VivaSession } from '../types';

interface RevisionDashboardProps {
  history: ConceptMastery[];
  activityLog: ActivityEvent[];
  vivaLogs: VivaSession[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const RevisionDashboard: React.FC<RevisionDashboardProps> = ({ history, activityLog, vivaLogs, isOpen, onClose, onClear }) => {
  const [activeTab, setActiveTab] = useState<'mastery' | 'timeline' | 'graph' | 'viva'>('mastery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedViva, setSelectedViva] = useState<VivaSession | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end transition-all">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-slide-up transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-mint-500 text-slate-950 relative">
          <h2 className="text-3xl font-black tracking-tight mb-1">Study Map</h2>
          <p className="text-slate-950/60 text-[10px] font-black uppercase tracking-widest">See how topics connect</p>
          <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/20 rounded-xl transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 m-6 rounded-2xl border border-slate-200 dark:border-white/5 shrink-0 overflow-x-auto no-scrollbar">
          <TabBtn active={activeTab === 'mastery'} onClick={() => setActiveTab('mastery')}>Topic Scores</TabBtn>
          <TabBtn active={activeTab === 'graph'} onClick={() => setActiveTab('graph')}>Map</TabBtn>
          <TabBtn active={activeTab === 'viva'} onClick={() => setActiveTab('viva')}>Voice Logs</TabBtn>
          <TabBtn active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>History</TabBtn>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
          {activeTab === 'mastery' && (
            <div className="space-y-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a topic..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-mint-500 font-bold"
              />

              {history.length === 0 ? <div className="text-center py-20 text-slate-300 italic font-bold">Nothing here yet!</div> : 
                history.filter(h => h.concept.toLowerCase().includes(searchQuery.toLowerCase())).map((h, i) => (
                  <TopicItem key={i} h={h} />
                ))
              }
            </div>
          )}
          
          {activeTab === 'graph' && (
             <div className="h-full py-8 text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-10">How your topics flow</p>
                {history.length === 0 ? <div className="text-slate-300 py-20 italic">No connections yet.</div> : 
                  <div className="space-y-8">
                     {history.map((n, idx) => (
                       <div key={idx} className={`p-6 rounded-2xl border-2 transition-all ${n.mastery > 70 ? 'bg-mint-50 dark:bg-mint-500/10 border-mint-200 text-mint-700' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-600'}`}>
                          <div className="text-lg font-black">{n.concept}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest">{n.mastery}% Understood</div>
                       </div>
                     ))}
                  </div>
                }
             </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-6">
              {selectedViva ? (
                <div className="space-y-6">
                   <button onClick={() => setSelectedViva(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-mint-500">
                      ← Back to Logs
                   </button>
                   <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 space-y-6">
                      <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                        <h3 className="font-black text-xl">{selectedViva.subject}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {selectedViva.difficulty} • {new Date(selectedViva.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                         {selectedViva.transcript.map((turn, i) => (
                            <div key={i} className={`flex flex-col ${turn.role === 'me' ? 'items-end' : 'items-start'}`}>
                               <div className={`text-[8px] font-black uppercase tracking-widest mb-1 ${turn.role === 'me' ? 'text-slate-400' : 'text-mint-600'}`}>{turn.role}</div>
                               <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-xs ${turn.role === 'me' ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5' : 'bg-mint-500 text-slate-950 font-bold'}`}>
                                  {turn.text}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              ) : (
                <>
                  {vivaLogs.length === 0 ? <div className="text-center py-20 text-slate-300 italic font-bold">No verbal exams yet.</div> : 
                    vivaLogs.map((log) => (
                      <div key={log.id} onClick={() => setSelectedViva(log)} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:border-mint-500/30 cursor-pointer transition-all">
                        <div className="flex justify-between items-start">
                           <div>
                              <h4 className="font-black text-lg">{log.subject}</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{log.difficulty} Session</p>
                           </div>
                           <span className="text-[9px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  }
                </>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {activityLog.length === 0 ? <div className="text-center py-20 text-slate-300 italic font-bold">No history yet!</div> : 
                activityLog.map((e) => <LogItem key={e.id} e={e} />)
              }
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50">
          <button onClick={onClear} className="w-full py-4 text-[10px] font-black text-red-500 uppercase tracking-widest border-2 border-red-50 dark:border-red-900/20 rounded-2xl hover:bg-red-50 transition-all">
            Delete My Data
          </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, children, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${active ? 'bg-white dark:bg-slate-800 text-mint-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{children}</button>
);

const TopicItem = ({ h }: any) => (
  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm group transition-all hover:border-mint-500/30">
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{h.concept}</h4>
      <span className="px-3 py-1 bg-mint-500 text-white text-[10px] font-black rounded-lg">{h.mastery}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div className="h-full bg-mint-500 transition-all duration-1000" style={{ width: `${h.mastery}%` }}></div>
    </div>
  </div>
);

const LogItem = ({ e }: any) => (
  <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-bold text-sm">{e.concept}</h4>
      <span className="text-[9px] text-slate-400 uppercase font-black">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className="text-[10px] font-bold text-slate-500">
      Score changed to <span className={e.type === 'gain' ? 'text-mint-600' : 'text-red-500'}>{e.newMastery}%</span>
    </div>
  </div>
);

export default RevisionDashboard;
