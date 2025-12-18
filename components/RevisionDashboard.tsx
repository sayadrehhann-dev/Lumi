import React, { useState, useMemo } from 'react';
import { ConceptMastery, ActivityEvent } from '../types';

interface RevisionDashboardProps {
  history: ConceptMastery[];
  activityLog: ActivityEvent[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const RevisionDashboard: React.FC<RevisionDashboardProps> = ({ history, activityLog, isOpen, onClose, onClear }) => {
  const [activeTab, setActiveTab] = useState<'mastery' | 'timeline' | 'graph'>('mastery');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-10 border-b border-slate-100 bg-mint-500 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">Knowledge Graph</h2>
            <p className="text-mint-50 text-sm font-medium opacity-80 uppercase tracking-widest">Structural Dependency Analysis</p>
          </div>
          <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-2xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-mint-400/30 rounded-full blur-2xl"></div>
        </div>

        <div className="flex bg-slate-50 p-2 m-6 rounded-2xl shrink-0">
          <TabBtn active={activeTab === 'mastery'} onClick={() => setActiveTab('mastery')}>Mastery</TabBtn>
          <TabBtn active={activeTab === 'graph'} onClick={() => setActiveTab('graph')}>Structure</TabBtn>
          <TabBtn active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>Timeline</TabBtn>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {activeTab === 'mastery' && (
            <div className="space-y-6">
              {history.length === 0 ? <EmptyS /> : history.sort((a,b) => b.mastery - a.mastery).map((h, i) => <CItem key={i} h={h} allConcepts={history} />)}
            </div>
          )}
          
          {activeTab === 'graph' && (
             <div className="h-full min-h-[400px]">
                {history.length === 0 ? <EmptyS /> : <DependencyGraph history={history} />}
             </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {activityLog.length === 0 ? <EmptyS /> : activityLog.map((e, i) => <TItem key={e.id} e={e} />)}
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button onClick={onClear} className="w-full py-4 text-xs font-black text-red-500 uppercase tracking-widest border border-red-200 rounded-2xl hover:bg-red-50 transition-all">
            Purge Intelligence Data
          </button>
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, children, onClick }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${active ? 'bg-white text-mint-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
    {children}
  </button>
);

const DependencyGraph = ({ history }: { history: ConceptMastery[] }) => {
  // Simple layout logic: Layer concepts based on prerequisite depth
  const layers = useMemo(() => {
    const conceptMap = new Map<string, ConceptMastery>();
    history.forEach(h => conceptMap.set(h.concept.toLowerCase(), h));

    const getDepth = (concept: string, visited = new Set<string>()): number => {
      const c = conceptMap.get(concept.toLowerCase());
      if (!c || !c.prerequisites || c.prerequisites.length === 0) return 0;
      if (visited.has(concept.toLowerCase())) return 0; // Prevent cycles
      visited.add(concept.toLowerCase());
      return 1 + Math.max(...c.prerequisites.map(p => getDepth(p, new Set(visited))));
    };

    const nodes = history.map(h => ({
      ...h,
      depth: getDepth(h.concept)
    }));

    const depthMap: Record<number, typeof nodes> = {};
    nodes.forEach(n => {
      if (!depthMap[n.depth]) depthMap[n.depth] = [];
      depthMap[n.depth].push(n);
    });

    return Object.entries(depthMap).sort(([a], [b]) => Number(a) - Number(b));
  }, [history]);

  return (
    <div className="flex flex-col gap-12 py-8 items-center">
      {layers.map(([depth, nodes], layerIdx) => (
        <div key={depth} className="flex flex-wrap justify-center gap-6 relative w-full">
          {nodes.map((n, nodeIdx) => (
            <div key={nodeIdx} className="group relative">
              <div className={`
                w-32 p-4 rounded-2xl border-2 transition-all duration-500 text-center shadow-sm hover:shadow-md hover:-translate-y-1
                ${n.mastery >= 80 ? 'bg-mint-50 border-mint-200 text-mint-700' : 
                  n.mastery >= 40 ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                  'bg-white border-slate-100 text-slate-600'}
              `}>
                <div className="text-[10px] font-black uppercase tracking-tighter mb-1 truncate">{n.concept}</div>
                <div className="text-lg font-black leading-none">{n.mastery}%</div>
              </div>
              
              {/* Connector lines to prerequisites in the layer above (lower depth) */}
              {n.prerequisites?.map((prereq, pIdx) => (
                 <div key={pIdx} className="absolute -top-6 left-1/2 w-0.5 h-6 bg-slate-100 -z-10 group-hover:bg-mint-200 transition-colors" />
              ))}
            </div>
          ))}
          {layerIdx < layers.length - 1 && (
            <div className="absolute -bottom-8 left-0 right-0 h-px bg-slate-50 -z-10" />
          )}
        </div>
      ))}
      <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          The map above represents your structural learning hierarchy. <br/> 
          Focus on Mastering bottom layers to unlock complex concepts.
        </p>
      </div>
    </div>
  );
};

const CItem = ({ h, allConcepts }: { h: ConceptMastery, allConcepts: ConceptMastery[] }) => (
  <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-bold text-slate-800 text-lg leading-none mb-1">{h.concept}</h4>
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Retention Stability: {Math.round((h.retentionProbability || 0)*100)}%</div>
      </div>
      <div className="px-3 py-1 bg-mint-50 text-mint-600 text-[10px] font-black rounded-full">{h.mastery}%</div>
    </div>
    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
      <div className="h-full bg-mint-500 transition-all duration-1000" style={{ width: `${h.mastery}%` }}></div>
    </div>

    {h.prerequisites?.length ? (
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-full mb-1">Prerequisites</span>
        {h.prerequisites.map((p, i) => {
          const matched = allConcepts.find(c => c.concept.toLowerCase() === p.toLowerCase());
          const isMastered = matched ? matched.mastery >= 80 : false;
          return (
            <div key={i} className={`text-[9px] px-2 py-1 rounded-lg border font-bold flex items-center gap-1.5 ${isMastered ? 'bg-mint-50 border-mint-100 text-mint-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              {isMastered && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              )}
              {p}
            </div>
          );
        })}
      </div>
    ) : null}

    {h.misconceptions?.length ? (
      <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
        {h.misconceptions.map((m, i) => (
          <div key={i} className="text-[10px] bg-red-50/50 text-red-600 px-3 py-1.5 rounded-xl border border-red-100/20 font-medium">Warning: {m}</div>
        ))}
      </div>
    ) : null}
  </div>
);

const TItem = ({ e }: { e: ActivityEvent }) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm mt-1 group-hover:scale-125 transition-transform ${e.type === 'gain' ? 'bg-mint-500' : 'bg-red-500'}`}></div>
      <div className="flex-1 w-0.5 bg-slate-100 group-last:bg-transparent"></div>
    </div>
    <div className="pb-8">
      <div className="text-[10px] text-slate-400 font-bold mb-1">{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <h5 className="font-bold text-slate-800 mb-1">{e.concept}</h5>
      <div className="flex items-center gap-2 text-[10px] font-black">
        <span className="text-slate-300">{e.previousMastery}%</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-slate-200"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
        <span className={e.type === 'gain' ? 'text-mint-600' : 'text-red-600'}>{e.newMastery}%</span>
      </div>
    </div>
  </div>
);

const EmptyS = () => (
  <div className="text-center py-24 text-slate-300 px-12 italic text-sm">Initializing knowledge graph. Await further session data...</div>
);

export default RevisionDashboard;
