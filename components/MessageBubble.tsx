import React, { useState } from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const parseInlineStyles = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900 dark:text-white">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-white/10 text-mint-600 dark:text-mint-400 px-2 py-0.5 rounded-lg text-[13px] font-mono border border-slate-200 dark:border-white/5">$1</code>');
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-white/5 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
      >
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className={`w-1.5 h-6 bg-mint-500 rounded-full transition-transform duration-300 ${isOpen ? 'scale-y-100' : 'scale-y-50'}`}></span>
          {title}
        </h3>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<{ content: string; isAi: boolean }> = ({ content, isAi }) => {
  const lines = content.split('\n');
  const sections: { title: string | null; content: string[] }[] = [{ title: null, content: [] }];
  
  // Group lines into sections by headings
  lines.forEach(line => {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      sections.push({ title: headingMatch[2].trim(), content: [] });
    } else {
      sections[sections.length - 1].content.push(line);
    }
  });

  const renderSectionLines = (sectionLines: string[]) => {
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    sectionLines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${index}`} className="my-6 p-6 bg-lumi-slate-950 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto shadow-xl border border-white/5">
              <pre className="leading-relaxed opacity-90">{codeBlockContent.join('\n')}</pre>
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

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const contentStr = line.trim().substring(2);
        elements.push(
          <div key={index} className="flex gap-3 ml-1 mb-3 group">
            <span className="text-mint-500 font-black transition-transform group-hover:translate-x-1">→</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineStyles(contentStr) }}></span>
          </div>
        );
        return;
      }

      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.trim().split('.');
        const number = parts[0];
        const listContent = parts.slice(1).join('.');
        elements.push(
          <div key={index} className="flex gap-4 ml-1 mb-4">
            <span className="bg-mint-500 text-slate-950 font-black w-6 h-6 flex items-center justify-center rounded-lg text-[10px] shadow-md">{number}</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base leading-relaxed pt-0.5" dangerouslySetInnerHTML={{ __html: parseInlineStyles(listContent) }}></span>
          </div>
        );
        return;
      }

      if (line.trim() === '') {
        elements.push(<div key={index} className="h-2"></div>);
        return;
      }

      elements.push(
        <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base opacity-95" dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }}></p>
      );
    });

    return elements;
  };

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const sectionContent = renderSectionLines(section.content);
        if (!section.title) return <div key={idx}>{sectionContent}</div>;
        
        // Only make it collapsible if it's an AI message and has substantial content
        const isLongSection = section.content.length > 5;
        if (isAi && isLongSection) {
          return (
            <CollapsibleSection key={idx} title={section.title} defaultOpen={idx === 0 || sections.length < 3}>
              {sectionContent}
            </CollapsibleSection>
          );
        }

        return (
          <div key={idx} className="mt-8 first:mt-0">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-mint-500 rounded-full"></span>
              {section.title}
            </h3>
            {sectionContent}
          </div>
        );
      })}
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const INSIGHT_HEADERS = ['Intuition', 'Formal', 'Analogy', 'Exam', 'Core Concept'];

  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: React.ReactNode[] = [];
    let currentTextBuffer: string[] = [];
    let currentCardSections: any[] = [];
    let currentSectionBuffer: string[] = [];
    let currentSectionTitle = '';
    
    const flushText = () => { 
      if (currentTextBuffer.length) {
        blocks.push(<MarkdownRenderer key={`text-${blocks.length}`} content={currentTextBuffer.join('\n')} isAi={!isUser} />);
      } 
      currentTextBuffer = []; 
    };
    
    const flushCard = () => {
      if (currentSectionTitle) currentCardSections.push({ title: currentSectionTitle, content: currentSectionBuffer.join('\n') });
      if (currentCardSections.length) blocks.push(<LuminousCard key={`card-${blocks.length}`} sections={[...currentCardSections]} />);
      currentCardSections = []; currentSectionBuffer = []; currentSectionTitle = '';
    };

    lines.forEach(line => {
      const match = line.match(/^### (.*)/);
      if (match) {
        const title = match[1].trim();
        if (INSIGHT_HEADERS.some(h => title.toLowerCase().includes(h.toLowerCase()))) {
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
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group animate-slide-up`}>
      <div className={`
        relative max-w-[95%] md:max-w-[85%] rounded-[2.5rem] px-6 sm:px-10 py-8 sm:py-10 shadow-lg transition-all duration-500
        ${isUser 
          ? 'bg-mint-500 text-slate-950 rounded-br-none shadow-mint-500/10' 
          : 'bg-white dark:bg-lumi-slate-900 border border-slate-200 dark:border-white/5 rounded-bl-none'
        }
      `}>
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed font-black text-xl sm:text-2xl tracking-tight">{message.content}</p>
        ) : (
          <div className="space-y-4">
            {renderMessageContent(message.content)}
          </div>
        )}
        <div className={`text-[9px] font-black uppercase tracking-widest mt-6 opacity-40 ${isUser ? 'text-slate-900 text-right' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

const LuminousCard: React.FC<{ sections: any[] }> = ({ sections }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <div className="my-8 rounded-3xl bg-slate-50 dark:bg-lumi-slate-950/40 border border-slate-200 dark:border-white/5 overflow-hidden shadow-xl">
      <div className="flex border-b border-slate-200 dark:border-white/5 overflow-x-auto no-scrollbar bg-white/50 dark:bg-white/5 backdrop-blur-xl">
        {sections.map((s, i) => (
          <button 
            key={i} 
            onClick={() => setActiveIdx(i)}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeIdx === i ? 'text-mint-600 dark:text-mint-400 border-mint-500 bg-white dark:bg-lumi-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="p-8 bg-white dark:bg-lumi-slate-900">
        <MarkdownRenderer content={sections[activeIdx].content} isAi={true} />
      </div>
    </div>
  );
};

export default MessageBubble;