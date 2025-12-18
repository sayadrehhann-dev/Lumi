import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-8 pt-24 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        <div className="flex-1 text-center lg:text-left animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-50 border border-mint-100 text-mint-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-500"></span>
            </span>
            Next-Gen Learning Intelligence
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
            Your Intelligent <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-500 to-teal-500">Study Companion</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
            ELI Engine adapts to your cognitive patterns, identifies knowledge gaps, and optimizes your learning journey in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-mint-500 text-white font-bold rounded-2xl shadow-xl shadow-mint-100 hover:bg-mint-600 hover:-translate-y-1 transition-all active:scale-95"
            >
              Start Learning Now
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        <div className="flex-1 relative animate-fade-in delay-300">
          <div className="relative z-10 p-8 glass border border-white/40 rounded-[2.5rem] shadow-2xl animate-float">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center text-mint-600 font-bold text-lg">AI</div>
                <div>
                  <div className="h-2 w-32 bg-slate-100 rounded-full mb-1"></div>
                  <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full bg-slate-50 rounded-lg"></div>
                <div className="h-3 w-full bg-slate-50 rounded-lg"></div>
                <div className="h-3 w-3/4 bg-slate-50 rounded-lg"></div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="px-4 py-2 bg-mint-50 text-mint-600 text-xs font-bold rounded-xl border border-mint-100">Analyzing Gaps...</div>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100/50">
                <div className="text-xl font-bold text-teal-700 leading-none">84%</div>
                <div className="text-[10px] text-teal-600 uppercase font-bold mt-1">Retention Boost</div>
              </div>
              <div className="bg-sea-50 rounded-2xl p-4 border border-sea-100/50">
                <div className="text-xl font-bold text-sea-500 leading-none">2.4x</div>
                <div className="text-[10px] text-sea-400 uppercase font-bold mt-1">Faster Mastery</div>
              </div>
            </div>
          </div>
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-mint-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-40"></div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full max-w-7xl px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>}
            title="Adaptive Pedagogical Modeling"
            description="Dynamic content adjustment based on real-time cognitive state inference."
            color="mint"
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.607a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v.637a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v.637a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v1.607a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v.637a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v.637a2 2 0 01-.586 1.414l-.494.494a2 2 0 00-.586 1.414v1.607" /></svg>}
            title="Structural Prerequisite Graph"
            description="ELI identifies broken foundations and re-solidifies them before moving forward."
            color="teal"
          />
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>}
            title="AI Viva Mode"
            description="Challenge your knowledge with our strict yet supportive AI Oral Examiner."
            color="sea"
          />
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="w-full h-24 bg-gradient-to-t from-slate-50 to-transparent"></footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: any) => {
  const colorMap: any = {
    mint: 'bg-mint-50 text-mint-600 border-mint-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    sea: 'bg-sea-50 text-sea-500 border-sea-100',
  };

  return (
    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default LandingPage;