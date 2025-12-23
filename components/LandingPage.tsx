import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onToggleTheme, isDarkMode }) => {
  return (
    <div className="bg-lumi-slate-50 dark:bg-lumi-slate-950 min-h-screen flex flex-col items-center overflow-x-hidden font-sans text-slate-900 dark:text-white transition-all duration-500">
      <div className="fixed inset-0 noise z-0"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full max-w-7xl px-4 sm:px-8 py-6 flex justify-between items-center z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mint-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-mint-600 dark:text-mint-400 font-black border border-mint-500/30 shadow-xl shadow-mint-500/10">
            L
          </div>
          <span className="text-xl font-black tracking-tight">Lumi</span>
        </div>
        <button 
          onClick={onToggleTheme} 
          className="p-3 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-4 sm:px-8 pt-32 sm:pt-48 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 z-10">
        <div className="flex-1 text-center lg:text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-500/10 border border-mint-500/30 text-mint-600 dark:text-mint-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></span>
            Smart Learning Buddy v5.0
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.0] mb-8 tracking-tighter">
            Learn with <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-500 via-teal-500 to-blue-600 animate-glow-line bg-[length:200%_auto]">Clarity.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0 font-medium">
            Lumi is your smart study partner. It finds what you're stuck on and helps you understand it easily.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-mint-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-mint-500/30 hover:bg-mint-400 hover:-translate-y-1 transition-all active:scale-95"
            >
              Get Started
            </button>
            <div className="flex flex-col border-l-2 border-slate-200 dark:border-white/10 pl-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Smart Gemini Tech</span>
            </div>
          </div>
        </div>

        {/* Card Mockup - restored animate-float and animate-scale-in */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative animate-scale-in delay-300">
          <div className="p-8 sm:p-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-2xl animate-float">
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-6 sm:p-8 shadow-inner border border-slate-100 dark:border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mint-500/20 backdrop-blur-lg flex items-center justify-center text-mint-600 dark:text-mint-400 font-black border border-mint-500/30">L</div>
                  <div>
                    <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full mb-2"></div>
                    <div className="h-1.5 w-16 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                <div className="h-2.5 w-3/4 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Learning Score</div>
                  <div className="text-4xl font-black text-mint-500">98%</div>
                </div>
                <div className="px-4 py-2 bg-mint-500/10 text-mint-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-mint-500/20">Active</div>
              </div>
            </div>
          </div>
          {/* Subtle glow orb behind the card */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-mint-500/10 dark:bg-mint-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-7xl px-4 sm:px-8 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 z-10">
        <FeatureCard 
          icon="🗣️"
          title="Voice Help"
          description="Talk to Lumi! It listens to how you explain things to see if you really understand."
        />
        <FeatureCard 
          icon="🗺️"
          title="Personal Map"
          description="See exactly which topics you know well and which ones need more work."
        />
        <FeatureCard 
          icon="🖼️"
          title="Visual Aids"
          description="Turn boring text into beautiful pictures and charts to learn faster."
        />
      </section>

      <footer className="w-full py-12 border-t border-slate-200 dark:border-white/5 flex flex-col items-center gap-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Lumi Smart Assistant • 2025</div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="text-4xl mb-6">{icon}</div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{description}</p>
  </div>
);

export default LandingPage;