import React, { useState, useEffect } from 'react';
import { generateInfographic } from '../services/geminiService';

interface InfographicItem {
  id: string;
  url: string;
  timestamp: number;
  snippet: string;
  style: string;
}

interface InfographicViewProps {
  onBack: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const VISUAL_STYLES = [
  { id: 'Modern', label: 'Modern Studio', icon: '✨', description: 'Clean, mint-themed minimalist layout' },
  { id: 'Cyberpunk', label: 'Neon HUD', icon: '🚀', description: 'High-tech data visualization interface' },
  { id: 'Academic', label: 'Classical Scholarly', icon: '📜', description: 'Detailed textbook schematic style' },
  { id: 'Hand-drawn', label: 'Artist Sketch', icon: '🎨', description: 'Hand-crafted organic diagrams' },
  { id: 'Blueprint', label: 'Tech Blueprint', icon: '🛠️', description: 'Precise industrial engineering look' },
];

const SkeletonInfographic = ({ stage }: { stage: string }) => (
  <div className="w-full max-w-2xl aspect-[3/4] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 flex flex-col gap-6 relative overflow-hidden border border-slate-200 dark:border-white/5 animate-scale-in">
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mint-500/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
    
    {/* Scanning Line */}
    <div className="absolute top-0 left-0 w-full h-1 bg-mint-500/30 blur-sm animate-[scan_3s_ease-in-out_infinite] z-10"></div>

    {/* Header Skeleton */}
    <div className="h-12 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    <div className="h-4 w-1/2 bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse"></div>

    {/* Content Grid */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col p-3 gap-2">
          <div className="w-8 h-8 rounded-lg bg-mint-500/10 animate-pulse"></div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        </div>
      ))}
    </div>

    {/* Main Visualization Area */}
    <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-8 relative">
      <div className="w-32 h-32 rounded-full border-4 border-mint-500/20 animate-[spin_10s_linear_infinite] flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-4 border-mint-500/10 animate-[spin_6s_linear_infinite_reverse]"></div>
      </div>
      <div className="mt-8 space-y-3 w-full">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
        <div className="h-3 w-[90%] bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="h-3 w-[95%] bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </div>

    {/* Footer Status */}
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-mint-500 rounded-full animate-ping"></div>
        <span className="text-[10px] font-black uppercase text-mint-600 dark:text-mint-400 tracking-widest">{stage}</span>
      </div>
      <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
    </div>

    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
      @keyframes scan {
        0%, 100% { top: 0%; opacity: 0; }
        10%, 90% { opacity: 1; }
        50% { top: 100%; }
      }
    `}</style>
  </div>
);

const InfographicView: React.FC<InfographicViewProps> = ({ onBack, onToggleTheme, isDarkMode }) => {
  const [text, setText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<InfographicItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lumi_infographic_gallery');
    if (saved) setGallery(JSON.parse(saved));
  }, []);

  const saveToGallery = (url: string) => {
    const newItem: InfographicItem = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      timestamp: Date.now(),
      snippet: text.substring(0, 60) + '...',
      style: selectedStyle
    };
    const updated = [newItem, ...gallery].slice(0, 10);
    setGallery(updated);
    localStorage.setItem('lumi_infographic_gallery', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);
    setCurrentStage('Waking up the Lumi Prism Engine...');
    try {
      const imageUrl = await generateInfographic(text, selectedStyle, (stage) => setCurrentStage(stage));
      setResultImage(imageUrl);
      saveToGallery(imageUrl);
    } catch (err) {
      setError("Visual synthesis failed. Neural paths are congested. Please simplify your query.");
    } finally {
      setIsGenerating(false);
      setCurrentStage('');
    }
  };

  const clearSession = () => {
    setText('');
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden selection:bg-mint-500/30 transition-colors duration-300">
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Lumi Prism Lab
              <span className="px-2 py-0.5 bg-mint-500/10 text-mint-600 dark:text-mint-400 text-[9px] border border-mint-500/20 rounded-md uppercase tracking-[0.2em] animate-pulse">Spectral Refraction</span>
            </h2>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={onToggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 transition-all">
            {isDarkMode ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
          </button>
          <button onClick={clearSession} className="text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors tracking-widest">Reset</button>
          {resultImage && <a href={resultImage} download={`lumi-render.png`} className="px-6 py-2.5 bg-mint-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-mint-500/10">Export</a>}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-[420px] border-r border-slate-200 dark:border-slate-800/60 p-8 flex flex-col gap-8 overflow-y-auto bg-white/40 dark:bg-slate-900/20 scrollbar-hide transition-colors duration-300">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." className="w-full min-h-[160px] bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 text-slate-900 dark:text-slate-200 outline-none transition-all resize-none text-sm leading-relaxed" />
          <div className="space-y-3">
            {VISUAL_STYLES.map(style => (
              <button key={style.id} onClick={() => setSelectedStyle(style.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all text-left ${selectedStyle === style.id ? 'bg-mint-500/10 border-mint-500 text-mint-700 dark:text-white' : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                <span className="text-xl">{style.icon}</span>
                <div className="text-xs font-bold">{style.label}</div>
              </button>
            ))}
          </div>
          <button onClick={handleGenerate} disabled={isGenerating || !text.trim()} className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.15em] transition-all text-xs ${isGenerating || !text.trim() ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-mint-500 text-slate-950 hover:bg-mint-400'}`}>
            {isGenerating ? "Rendering..." : "Synthesize"}
          </button>
        </aside>
        <main className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/50">
          {isGenerating ? (
            <SkeletonInfographic stage={currentStage} />
          ) : resultImage ? (
            <img src={resultImage} className="max-w-full max-h-full rounded-[2rem] shadow-2xl animate-fade-in" />
          ) : error ? (
            <div className="text-center p-8 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <div className="text-slate-300 dark:text-slate-800 font-black uppercase tracking-[0.5em] text-center max-w-xs animate-pulse">
              Waiting for neural input to refract...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InfographicView;