import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  mode: 'chat' | 'viva';
  messages: Message[];
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode, messages, onSend, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col bg-lumi-slate-50 dark:bg-lumi-slate-950 font-sans transition-all duration-500">
      {/* Mode Status Bar */}
      <div className={`px-12 py-4 border-b text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-between transition-all duration-500 z-20 ${
        mode === 'viva' 
          ? 'bg-amber-50/80 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/10 text-amber-600 dark:text-amber-500' 
          : 'bg-white/80 dark:bg-mint-500/5 border-slate-200 dark:border-mint-500/10 text-mint-600 dark:text-mint-400'
      } backdrop-blur-2xl`}>
        <div className="flex items-center gap-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
          </span>
          {mode === 'viva' ? 'Spectral Forensics Active' : 'Luminous Pedagogy Active'}
        </div>
        <div className="hidden sm:flex items-center gap-10">
           <span className="opacity-40 hover:opacity-100 transition-opacity cursor-default font-black tracking-[0.4em]">Protocol: LUMI-V3</span>
           <span className="opacity-40 hover:opacity-100 transition-opacity cursor-default font-black tracking-[0.4em]">Latency: 0.8ms</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-24 py-16 space-y-16 scrollbar-hide relative">
        {/* Artistic Background Element */}
        <div className="absolute inset-0 noise-bg opacity-[0.015] dark:opacity-[0.03] pointer-events-none"></div>

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto relative z-10 animate-fade-in">
            <div className="w-32 h-32 bg-white dark:bg-lumi-slate-900 border border-slate-200 dark:border-white/5 rounded-[3.5rem] mb-12 mx-auto flex items-center justify-center shadow-2xl relative group">
               <div className="absolute inset-0 bg-mint-500/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-slate-300 dark:text-slate-600 group-hover:text-mint-500 transition-colors duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
            </div>
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] leading-loose italic text-sm px-10">
              Neural synchronization established. <br/> Lumi is ready to illuminate your conceptual path.
            </p>
          </div>
        )}
        
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in relative z-10">
            <div className="bg-white dark:bg-lumi-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] rounded-bl-none px-10 py-8 shadow-2xl flex items-center gap-6">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-mint-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-600 ml-4">Illuminating Logic</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 md:px-24 md:pb-16 bg-lumi-slate-50/90 dark:bg-lumi-slate-950/90 backdrop-blur-3xl border-t border-slate-200 dark:border-white/5 relative z-20 transition-all duration-500">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;