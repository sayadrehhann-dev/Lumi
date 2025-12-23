import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { UserProfile, ConceptMastery, VivaTurn, VivaSession } from '../types';

interface VivaVoiceSessionProps {
  profile: UserProfile;
  history: ConceptMastery[];
  onEnd: (session: VivaSession | null) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

// Audio Utils
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const VivaVoiceSession: React.FC<VivaVoiceSessionProps> = ({ profile, history, onEnd, onToggleTheme, isDarkMode }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [sessionDifficulty, setSessionDifficulty] = useState(profile.difficultyLevel || 'Intermediate');
  const [isActive, setIsActive] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState<VivaTurn[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(75);
  const [liveInput, setLiveInput] = useState('');
  const [liveOutput, setLiveOutput] = useState('');
  
  const currentInputRef = useRef('');
  const currentOutputRef = useRef('');
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  }, [transcriptionHistory, liveInput, liveOutput]);

  const startViva = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const difficultyInstructions = {
        'Beginner': 'Ask simple, foundational questions. Focus on core concepts and big-picture ideas. Provide very encouraging and gentle feedback.',
        'Intermediate': 'Ask questions that require connecting different concepts. Dig into "why" and "how". Provide constructive feedback that highlights areas for deeper study.',
        'Advanced': 'Challenge the student with complex scenarios, edge cases, and technical details. Be a rigorous examiner. Provide sharp, detailed feedback on technical precision.'
      };

      const systemInstruction = `
        You are Lumi, a smart verbal examiner conducting a "Viva Voce".
        The student is: ${profile.name}, studying ${profile.majorSubject}.
        
        SESSION DIFFICULTY: ${sessionDifficulty}
        INSTRUCTION: ${difficultyInstructions[sessionDifficulty as keyof typeof difficultyInstructions]}
        
        GOAL: Help the student talk through their knowledge. Encourage them to explain things out loud.
        STYLE: Conversational, attentive, and helpful. Use simple English but maintain professional clarity.
      `;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true); setIsStarted(true);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor); scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer; source.connect(ctx.destination); source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
            if (msg.serverContent?.inputTranscription) { 
              currentInputRef.current += msg.serverContent.inputTranscription.text; 
              setLiveInput(currentInputRef.current); 
            }
            if (msg.serverContent?.outputTranscription) { 
              currentOutputRef.current += msg.serverContent.outputTranscription.text; 
              setLiveOutput(currentOutputRef.current); 
            }
            if (msg.serverContent?.turnComplete) {
              setTranscriptionHistory(prev => [
                ...prev, 
                { id: Math.random().toString(), role: 'me', text: currentInputRef.current, timestamp: Date.now() }, 
                { id: Math.random().toString(), role: 'lumi', text: currentOutputRef.current, timestamp: Date.now() }
              ]);
              currentInputRef.current = ''; 
              currentOutputRef.current = ''; 
              setLiveInput(''); 
              setLiveOutput('');
            }
          }
        },
        config: { 
          responseModalities: [Modality.AUDIO], 
          inputAudioTranscription: {}, 
          outputAudioTranscription: {},
          systemInstruction: systemInstruction
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { alert("Please allow microphone access to talk to Lumi."); }
  };

  const endViva = () => { 
    sessionRef.current?.close(); 
    mediaStreamRef.current?.getTracks().forEach(t => t.stop()); 
    
    if (transcriptionHistory.length > 0) {
      const session: VivaSession = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        subject: profile.majorSubject,
        difficulty: sessionDifficulty,
        transcript: transcriptionHistory
      };
      onEnd(session);
    } else {
      onEnd(null);
    }
  };

  if (!isStarted) {
    return (
      <div className="h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          <div className="w-20 h-20 bg-mint-500/20 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center text-3xl mx-auto shadow-2xl border border-mint-500/30">🎙️</div>
          <h1 className="text-4xl font-black tracking-tight">Talk to Lumi</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Practice explaining topics out loud. Lumi will listen and help you refine your ideas.</p>
          
          <div className="space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Exam Rigor</div>
            <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-300 dark:border-white/5">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSessionDifficulty(level)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    sessionDifficulty === level 
                      ? 'bg-white dark:bg-slate-700 text-mint-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={() => onEnd(null)} className="flex-1 py-5 bg-slate-200 dark:bg-slate-800 rounded-2xl font-bold">Go Back</button>
            <button onClick={startViva} className="flex-[2] py-5 bg-mint-500 text-slate-950 font-black rounded-2xl shadow-xl hover:bg-mint-400">Start Talking</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-all overflow-hidden">
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl shrink-0 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-mint-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-xl shadow-lg border border-mint-500/30">🎙️</div>
          <div>
            <h2 className="text-xl font-black leading-none">Live Voice Helper</h2>
            <div className="text-[9px] font-black uppercase text-mint-600 dark:text-mint-400 tracking-widest mt-1">{sessionDifficulty} Mode</div>
          </div>
        </div>
        <button onClick={endViva} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95">Stop</button>
      </header>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 scrollbar-hide">
          {transcriptionHistory.map(entry => (
            <div key={entry.id} className={`flex flex-col ${entry.role === 'me' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm shadow-sm border ${entry.role === 'me' ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' : 'bg-mint-500 text-slate-950 font-bold border-mint-400'}`}>
                {entry.text}
              </div>
            </div>
          ))}
          
          {/* Live Streaming User Input */}
          {liveInput && (
            <div className="flex flex-col items-end opacity-60">
              <div className="max-w-[85%] px-6 py-4 rounded-[2rem] text-sm shadow-sm border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 italic">
                {liveInput}
              </div>
            </div>
          )}

          {/* Live Streaming AI Output */}
          {liveOutput && (
            <div className="flex flex-col items-start">
              <div className="max-w-[85%] px-6 py-4 rounded-[2rem] text-sm shadow-sm border bg-mint-500/50 text-slate-950 font-bold border-mint-400 animate-pulse">
                {liveOutput}
              </div>
            </div>
          )}

          <div ref={logEndRef} className="h-20" />
        </main>
        
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 p-8 flex flex-col gap-6 shrink-0">
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl text-center border border-slate-100 dark:border-white/5">
             <div className="text-4xl font-black text-mint-600">{confidenceScore}%</div>
             <div className="text-[10px] font-black uppercase text-slate-400 mt-1">Understanding Level</div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interaction Log</h3>
             <div className="space-y-3">
                {transcriptionHistory.slice(-5).map((turn, i) => (
                   <div key={i} className="text-[10px] font-medium text-slate-500 line-clamp-2">
                      <span className="font-black uppercase mr-2">{turn.role}:</span>
                      {turn.text}
                   </div>
                ))}
             </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center">Lumi is listening to your explanation...</p>
        </aside>
      </div>
    </div>
  );
};

export default VivaVoiceSession;
