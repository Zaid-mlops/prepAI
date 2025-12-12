import React, { useState, useRef, useEffect } from 'react';
import { LiveInterviewClient } from '../services/geminiService';

interface TranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  isComplete: boolean;
}

export const LiveInterview: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState<TranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const clientRef = useRef<LiveInterviewClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<TranscriptItem[]>([]); // To track current state in callback

  useEffect(() => {
    clientRef.current = new LiveInterviewClient();
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleConnect = async () => {
    setError(null);
    try {
      await clientRef.current?.connect(({ role, text, isComplete }) => {
        setHistory(prev => {
          const newHistory = [...prev];
          const lastItem = newHistory[newHistory.length - 1];

          // If the last item is from the same role and is NOT complete, update it
          // OR if we are receiving an update for the current incomplete turn
          if (lastItem && lastItem.role === role && !lastItem.isComplete) {
             lastItem.text = text;
             lastItem.isComplete = isComplete;
             return newHistory;
          } else {
            // New turn starting
            // Avoid adding empty strings
            if (text.trim()) {
                return [...newHistory, {
                  id: Date.now().toString() + Math.random().toString(),
                  role,
                  text,
                  isComplete
                }];
            }
            return prev;
          }
        });
      });
      setIsConnected(true);
    } catch (e) {
      setError("Failed to connect to microphone or AI service. Please allow permissions.");
      console.error(e);
    }
  };

  const handleDisconnect = () => {
    clientRef.current?.disconnect();
    setIsConnected(false);
    // Mark all as complete on disconnect
    setHistory(prev => prev.map(item => ({...item, isComplete: true})));
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Live AI Interview</h2>
          <p className="text-slate-400 mt-1">Real-time voice practice with instant feedback.</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${isConnected ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
          {isConnected && <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>}
          {isConnected ? "LIVE RECORDING" : "OFFLINE"}
        </div>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-xl mb-6 shadow-lg backdrop-blur-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col relative shadow-2xl">
        
        {/* Visualizer Header */}
        <div className="h-20 bg-slate-800/50 border-b border-slate-700/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800 to-transparent z-10"></div>
          {isConnected ? (
             <div className="flex items-center gap-1.5 z-0">
               {[...Array(5)].map((_, i) => (
                 <div key={i} 
                      className="w-1.5 bg-blue-500 rounded-full animate-bounce" 
                      style={{ 
                        height: '24px', 
                        animationDuration: `${0.6 + i * 0.1}s`,
                        animationDelay: `${i * 0.05}s`
                      }} 
                 />
               ))}
               <span className="ml-3 text-blue-400 text-sm font-mono tracking-wider">LISTENING...</span>
             </div>
          ) : (
            <div className="text-slate-500 flex items-center gap-2">
               <span className="text-2xl">🎙️</span> 
               <span className="text-sm font-medium">Ready to start</span>
            </div>
          )}
        </div>

        {/* Transcript Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {history.length === 0 && !isConnected && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                 <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <div>
                <p className="text-lg font-medium text-slate-400">Start Your Mock Interview</p>
                <p className="text-sm">Click the button below to connect your microphone.</p>
              </div>
            </div>
          )}
          
          {history.map((item) => (
            <div key={item.id} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-md ${
                 item.role === 'user' 
                   ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm' 
                   : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
               }`}>
                  <div className="text-xs opacity-50 mb-1 uppercase tracking-wider font-bold">
                    {item.role === 'user' ? 'You' : 'Interviewer'}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {item.text}
                    {!item.isComplete && <span className="inline-block w-1.5 h-3 ml-1 bg-current opacity-70 animate-pulse">|</span>}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-800/80 backdrop-blur border-t border-slate-700 flex justify-center gap-4">
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Start Session
            </button>
          ) : (
            <button 
              onClick={handleDisconnect}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-full border border-slate-600 shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};