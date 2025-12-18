import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative group transition-all">
        <div className="absolute -inset-1 bg-gradient-to-r from-mint-300 to-teal-300 rounded-[2rem] blur opacity-10 group-focus-within:opacity-40 transition-opacity duration-500"></div>
        <div className="relative flex items-end gap-3 bg-white border border-slate-200/80 rounded-[2rem] p-3 focus-within:border-mint-400/50 shadow-xl shadow-slate-200/40">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your query or response here..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[120px] min-h-[50px] py-3.5 px-5 text-slate-800 placeholder:text-slate-400 font-medium leading-relaxed"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading}
            className={`p-4 rounded-2xl transition-all duration-300 flex-shrink-0 group/btn
              ${text.trim() && !isLoading 
                ? 'bg-mint-500 text-white shadow-lg shadow-mint-200 hover:bg-mint-600 hover:scale-110 active:scale-95' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] leading-none">Powered by ELI Advanced Pedagogy</span>
      </div>
    </div>
  );
};

export default ChatInput;