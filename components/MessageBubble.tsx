import React, { useState } from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const parseInlineStyles = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-mint-600 px-1.5 py-0.5 rounded-lg text-[13px] font-mono border border-mint-100/50">$1</code>');
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-5 p-5 bg-slate-900 text-slate-100 rounded-3xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
            <pre className="leading-relaxed">{codeBlockContent.join('\n')}</pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-xl font-black text-slate-900 mt-6 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-mint-500 rounded-full"></span>
        {line.replace('### ', '')}
      </h3>);
      return;
    }
    
    if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-2xl font-black text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 uppercase tracking-tight">{line.replace('## ', '')}</h2>);
      return;
    }

    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      elements.push(
        <div key={index} className="flex gap-3 ml-2 mb-2 group">
          <span className="text-mint-400 font-bold group-hover:scale-125 transition-transform">→</span>
          <span className="text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }}></span>
        </div>
      );
      return;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const parts = line.trim().split('.');
      const number = parts[0];
      const listContent = parts.slice(1).join('.');
      elements.push(
        <div key={index} className="flex gap-3 ml-2 mb-2">
          <span className="bg-mint-50 text-mint-600 font-black w-6 h-6 flex items-center justify-center rounded-lg text-[10px]">{number}</span>
          <span className="text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: parseInlineStyles(listContent) }}></span>
        </div>
      );
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={index} className="h-2"></div>);
      return;
    }

    elements.push(
      <p key={index} className="mb-3 leading-relaxed text-slate-700 font-medium opacity-90" dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }}></p>
    );
  });

  return <>{elements}</>;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const SPECIAL_HEADERS = ['Intuition', 'Formal Explanation', 'Analogy', 'Exam Relevance'];

  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: React.ReactNode[] = [];
    let currentTextBuffer: string[] = [];
    let currentCardSections: any[] = [];
    let currentSectionBuffer: string[] = [];
    let currentSectionTitle = '';
    
    const flushText = () => { if (currentTextBuffer.length) blocks.push(<MarkdownRenderer key={`text-${blocks.length}`} content={currentTextBuffer.join('\n')} />); currentTextBuffer = []; };
    const flushCard = () => {
      if (currentSectionTitle) currentCardSections.push({ title: currentSectionTitle, content: currentSectionBuffer.join('\n') });
      if (currentCardSections.length) blocks.push(<ConceptGroup key={`card-${blocks.length}`} sections={[...currentCardSections]} />);
      currentCardSections = []; currentSectionBuffer = []; currentSectionTitle = '';
    };

    lines.forEach(line => {
      const match = line.match(/^### (.*)/);
      if (match) {
        const title = match[1].trim();
        if (SPECIAL_HEADERS.some(h => title.toLowerCase().includes(h.toLowerCase()))) {
          flushText();
          if (currentSectionTitle) currentCardSections.push({ title: currentSectionTitle, content: currentSectionBuffer.join('\n') });
          currentSectionBuffer = []; currentSectionTitle = title;
        } else {
          if (currentCardSections.length || currentSectionTitle) flushCard();
          currentTextBuffer.push(line);
        }
      } else if (currentSectionTitle) {
        currentSectionBuffer.push(line);
      } else {
        currentTextBuffer.push(line);
      }
    });
    flushCard(); flushText();
    return blocks;
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group animate-fade-in`}>
      <div className={`
        relative max-w-[90%] md:max-w-[80%] rounded-[2.5rem] px-8 py-7 shadow-xl shadow-slate-200/40
        ${isUser 
          ? 'bg-mint-500 text-white rounded-br-none' 
          : 'bg-white border border-slate-100/50 rounded-bl-none'
        }
      `}>
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed font-bold text-lg">{message.content}</p>
        ) : (
          <div className="text-[15px] text-slate-800 space-y-3">
            {renderMessageContent(message.content)}
          </div>
        )}
        <div className={`text-[9px] font-black uppercase tracking-widest mt-4 opacity-40 ${isUser ? 'text-white text-right' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

const ConceptGroup = ({ sections }: { sections: any[] }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="my-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
        {sections.map((s, i) => (
          <button 
            key={i} 
            onClick={() => setOpen(i)}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${open === i ? 'text-mint-600 border-mint-500 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="p-8 bg-white animate-in fade-in duration-500">
        <MarkdownRenderer content={sections[open].content} />
      </div>
    </div>
  );
};

export default MessageBubble;