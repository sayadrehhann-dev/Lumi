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
    <div className="h-full flex flex-col bg-slate-50">
      {/* Mode Status Bar */}
      <div className={`px-8 py-2 border-b text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-colors ${mode === 'viva' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-mint-50 border-mint-100 text-mint-600'}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
        {mode === 'viva' ? 'Examiner Persona: Active' : 'Mentor Persona: Active'}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-40 animate-pulse">
            <div className="w-16 h-16 bg-slate-200 rounded-3xl mb-6"></div>
            <p className="text-slate-500 font-medium">Session initialized. ELI is waiting for your query to begin pedagogical modeling.</p>
          </div>
        )}
        
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-slate-100 rounded-[2rem] rounded-bl-none p-5 shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-mint-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ELI Modeling...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-white border-t border-slate-200/60">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;