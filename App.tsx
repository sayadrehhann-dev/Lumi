import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message, ConceptMastery, ActivityEvent, AppView, VivaSession } from './types';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import MainDashboard from './components/MainDashboard';
import ChatInterface from './components/ChatInterface';
import RevisionDashboard from './components/RevisionDashboard';
import InfographicView from './components/InfographicView';
import VivaVoiceSession from './components/VivaVoiceSession';
import ProfileModal from './components/ProfileModal';
import { initializeChat, sendMessage, resetChat } from './services/geminiService';

const STORAGE_KEYS = {
  PROFILE: 'lumi_user_profile',
  HISTORY: 'lumi_user_history',
  LOG: 'lumi_activity_log',
  AUTH: 'lumi_auth_status',
  THEME: 'lumi_theme_preference',
  VIVA_LOGS: 'lumi_viva_logs'
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [revisionHistory, setRevisionHistory] = useState<ConceptMastery[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [vivaLogs, setVivaLogs] = useState<VivaSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedLog = localStorage.getItem(STORAGE_KEYS.LOG);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const savedViva = localStorage.getItem(STORAGE_KEYS.VIVA_LOGS);

    if (savedTheme === 'light') setIsDarkMode(false);
    else setIsDarkMode(true);

    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setView('dashboard');
        
        setRevisionHistory(savedHistory ? JSON.parse(savedHistory) : []);
        setActivityLog(savedLog ? JSON.parse(savedLog) : []);
        setVivaLogs(savedViva ? JSON.parse(savedViva) : []);
        initializeChat(parsedProfile, savedHistory ? JSON.parse(savedHistory) : []);
      } else {
        setView('auth');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && profile) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(revisionHistory));
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify(activityLog));
      localStorage.setItem(STORAGE_KEYS.VIVA_LOGS, JSON.stringify(vivaLogs));
    }
  }, [revisionHistory, activityLog, vivaLogs, isAuthenticated, profile]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    if (profile) setView('dashboard');
    else setView('auth');
  };

  const handleProfileSubmit = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    setIsProfileModalOpen(false);
    if (view === 'auth') setView('dashboard');
    resetChat();
    initializeChat(newProfile, revisionHistory);
    setNotification("Profile Synchronized");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setIsAuthenticated(false);
    setView('landing');
    resetChat();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
        setNotification(`Luminous Insight: ${data.concept}`);
        setTimeout(() => setNotification(null), 3000);
      }

      if (existing) {
        return prev.map(h => 
          h.concept.toLowerCase() === data.concept.toLowerCase() 
            ? { ...h, mastery: data.mastery, lastReviewed: now, retentionProbability: calculateRetention(data.mastery) }
            : h
        );
      }
      
      return [...prev, {
        concept: data.concept,
        mastery: data.mastery,
        lastReviewed: now,
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
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', content: result.text || "Illumination complete.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Lumi encountered a spectral glitch. Neural paths are recalibrating...", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVivaEnd = (session: VivaSession | null) => {
    if (session) {
      setVivaLogs(prev => [session, ...prev].slice(0, 20));
      setNotification("Viva Transcription Saved");
      setTimeout(() => setNotification(null), 3000);
    }
    setView('dashboard');
  };

  const handlePurgeData = () => {
    const confirmed = window.confirm("Extinguish all spectral data? This action is permanent.");
    if (confirmed) {
      setRevisionHistory([]);
      setActivityLog([]);
      setMessages([]);
      setVivaLogs([]);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.LOG, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.VIVA_LOGS, JSON.stringify([]));
      setNotification("Spectral Data Purged");
      setTimeout(() => setNotification(null), 3000);
      resetChat();
      if (profile) initializeChat(profile, []);
      setIsDashboardDrawerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-lumi-slate-50 dark:bg-lumi-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-all duration-500 overflow-hidden">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
          <div className="bg-white dark:bg-slate-900 border border-mint-500/30 text-mint-600 dark:text-mint-400 px-8 py-3 rounded-full shadow-[0_15px_40px_rgba(16,185,129,0.2)] text-xs font-black flex items-center gap-4 backdrop-blur-2xl">
            <div className="w-2 h-2 bg-mint-500 rounded-full animate-ping"></div>
            {notification}
          </div>
        </div>
      )}

      {view === 'landing' && <LandingPage onStart={() => setView('auth')} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
      
      {view === 'auth' && !isAuthenticated && <AuthScreen onAuthSuccess={handleAuthSuccess} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
      
      {view === 'auth' && isAuthenticated && !profile && (
        <AuthScreen isProfileSetup onProfileSubmit={handleProfileSubmit} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      )}

      {(view === 'dashboard' || view === 'chat' || view === 'viva' || view === 'infographic') && profile && (
        <div className="flex h-screen overflow-hidden">
          <div className="flex-1 flex flex-col relative min-w-0">
            {view !== 'infographic' && view !== 'viva' && (
              <header className="bg-white/80 dark:bg-lumi-slate-900/60 backdrop-blur-2xl border-b border-slate-200 dark:border-white/5 py-4 px-8 flex justify-between items-center z-50 shrink-0 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('dashboard')}>
                  <div className="bg-mint-500/30 backdrop-blur-lg p-2.5 rounded-2xl text-mint-600 dark:text-mint-400 border border-mint-500/20 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9" /></svg>
                  </div>
                  <div>
                    <h1 className="font-black text-slate-900 dark:text-white text-xl tracking-tighter">Lumi</h1>
                    <p className="text-[9px] text-mint-600 dark:text-mint-400 font-black tracking-[0.4em] uppercase">Intelligence</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="hidden md:flex flex-col items-end mr-3 px-4 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-black tracking-tight">{profile.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{profile.difficultyLevel}</span>
                  </div>
                  
                  <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden md:block"></div>

                  <HeaderAction onClick={toggleTheme} title="Toggle Appearance">
                    {isDarkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                    )}
                  </HeaderAction>

                  <HeaderAction onClick={() => setIsDashboardDrawerOpen(true)} title="Knowledge Graph">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" /></svg>
                  </HeaderAction>

                  <HeaderAction onClick={handleSignOut} title="Terminate Link" danger>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  </HeaderAction>
                </div>
              </header>
            )}

            <main className="flex-1 overflow-hidden relative">
              {view === 'dashboard' && <MainDashboard profile={profile} history={revisionHistory} onAction={(a) => setView(a as AppView)} />}
              {view === 'chat' && <ChatInterface mode="chat" messages={messages} onSend={handleSendMessage} isLoading={isLoading} />}
              {view === 'viva' && <VivaVoiceSession profile={profile} history={revisionHistory} onEnd={handleVivaEnd} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
              {view === 'infographic' && <InfographicView onBack={() => setView('dashboard')} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
            </main>
          </div>

          <RevisionDashboard 
            history={revisionHistory} 
            activityLog={activityLog}
            vivaLogs={vivaLogs}
            isOpen={isDashboardDrawerOpen} 
            onClose={() => setIsDashboardDrawerOpen(false)} 
            onClear={handlePurgeData} 
          />

          <ProfileModal 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)} 
            onSubmit={handleProfileSubmit}
            initialProfile={profile}
          />
        </div>
      )}
    </div>
  );
};

const HeaderAction = ({ onClick, children, title, danger }: any) => (
  <button 
    onClick={onClick} 
    title={title}
    className={`p-2.5 rounded-xl transition-all active:scale-90 border flex items-center justify-center ${
      danger 
        ? 'text-red-400 hover:text-red-500 hover:bg-red-500/10 border-transparent' 
        : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-mint-600 dark:hover:text-mint-400 hover:border-mint-500/30'
    }`}
  >
    {children}
  </button>
);

export default App;
