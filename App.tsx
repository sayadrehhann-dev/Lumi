import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message, ConceptMastery, ActivityEvent, AppView } from './types';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import MainDashboard from './components/MainDashboard';
import ChatInterface from './components/ChatInterface';
import RevisionDashboard from './components/RevisionDashboard';
import { initializeChat, sendMessage, resetChat } from './services/geminiService';

const STORAGE_KEYS = {
  PROFILE: 'ai_student_profile',
  HISTORY: 'ai_student_history',
  LOG: 'ai_student_activity_log',
  AUTH: 'ai_student_auth'
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [revisionHistory, setRevisionHistory] = useState<ConceptMastery[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedLog = localStorage.getItem(STORAGE_KEYS.LOG);

    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setView('dashboard');
        
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const log = savedLog ? JSON.parse(savedLog) : [];
        setRevisionHistory(history);
        setActivityLog(log);
        initializeChat(parsedProfile, history);
      } else {
        setView('auth'); // Need profile setup
      }
    }
  }, []);

  useEffect(() => {
    if (revisionHistory.length > 0) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(revisionHistory));
    if (activityLog.length > 0) localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(activityLog));
  }, [revisionHistory, activityLog]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    if (profile) setView('dashboard');
    else setView('auth'); // Navigate to profile creation step
  };

  const handleProfileSubmit = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    setView('dashboard');
    resetChat();
    initializeChat(newProfile, revisionHistory);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAuthenticated(false);
    setView('landing');
  };

  const updateMastery = (data: Partial<ConceptMastery> & { concept: string, mastery: number }) => {
    setRevisionHistory(prev => {
      const existing = prev.find(h => h.concept.toLowerCase() === data.concept.toLowerCase());
      const now = Date.now();
      const calculateRetention = (m: number) => Math.min(1, (m / 100) * 1.2);

      const event: ActivityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        concept: data.concept,
        previousMastery: existing?.mastery || 0,
        newMastery: data.mastery,
        timestamp: now,
        type: (data.mastery > (existing?.mastery || 0)) ? 'gain' : 'loss'
      };

      setActivityLog(prevLog => [event, ...prevLog].slice(0, 50));
      if (event.type === 'gain') {
        setNotification(`ELI Engine: Mastery Gain in ${data.concept}`);
        setTimeout(() => setNotification(null), 3000);
      }

      if (existing) {
        return prev.map(h => 
          h.concept.toLowerCase() === data.concept.toLowerCase() 
            ? { 
                ...h, 
                mastery: data.mastery, 
                lastReviewed: now, 
                misconceptions: data.misconceptions || h.misconceptions, 
                prerequisites: data.prerequisites || h.prerequisites,
                notes: data.notes || h.notes, 
                retentionProbability: calculateRetention(data.mastery) 
              }
            : h
        );
      }
      
      return [...prev, {
        concept: data.concept,
        mastery: data.mastery,
        lastReviewed: now,
        misconceptions: data.misconceptions,
        prerequisites: data.prerequisites,
        notes: data.notes,
        retentionProbability: calculateRetention(data.mastery)
      }];
    });
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await sendMessage(text);
      if (result.functionCalls) {
        for (const fc of result.functionCalls) {
          if (fc.name === 'log_concept_mastery') updateMastery(fc.args as any);
        }
      }
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: result.text || "Assessment complete.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Neural path interrupted. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-mint-200 selection:text-mint-900 transition-colors duration-500">
      {/* Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="glass border border-mint-200 text-mint-700 px-6 py-3 rounded-full shadow-xl text-sm font-bold flex items-center gap-3">
            <div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></div>
            {notification}
          </div>
        </div>
      )}

      {view === 'landing' && <LandingPage onStart={() => setView('auth')} />}
      
      {view === 'auth' && !isAuthenticated && <AuthScreen onAuthSuccess={handleAuthSuccess} />}
      
      {view === 'auth' && isAuthenticated && !profile && (
        <AuthScreen isProfileSetup onProfileSubmit={handleProfileSubmit} />
      )}

      {(view === 'dashboard' || view === 'chat' || view === 'viva') && profile && (
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex flex-col relative min-w-0">
            {/* Header */}
            <header className="glass border-b border-slate-200/60 py-4 px-8 flex justify-between items-center z-50">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('dashboard')}>
                <div className="bg-mint-400 p-2.5 rounded-2xl text-white shadow-lg shadow-mint-100 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-slate-800 text-lg tracking-tight">AI Student Companion</h1>
                  <p className="text-[10px] text-mint-600 font-extrabold tracking-[0.2em] uppercase">ELI-V3 Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-4">
                  <span className="text-xs font-bold text-slate-700">{profile.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{profile.majorSubject}</span>
                </div>
                <button 
                  onClick={() => setIsDashboardDrawerOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-mint-600 hover:bg-mint-50 transition-all shadow-sm"
                  title="Mastery Dashboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
                  </svg>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
              {view === 'dashboard' && (
                <MainDashboard 
                  profile={profile} 
                  history={revisionHistory} 
                  onAction={(action) => setView(action as AppView)} 
                />
              )}
              {(view === 'chat' || view === 'viva') && (
                <ChatInterface 
                  mode={view as 'chat' | 'viva'} 
                  messages={messages} 
                  onSend={handleSendMessage} 
                  isLoading={isLoading} 
                />
              )}
            </main>
          </div>

          <RevisionDashboard 
            history={revisionHistory} 
            activityLog={activityLog}
            isOpen={isDashboardDrawerOpen} 
            onClose={() => setIsDashboardDrawerOpen(false)} 
            onClear={() => {
              if (confirm("Purge knowledge model?")) {
                setRevisionHistory([]);
                setActivityLog([]);
                localStorage.removeItem(STORAGE_KEYS.HISTORY);
                localStorage.removeItem(STORAGE_KEYS.LOG);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
