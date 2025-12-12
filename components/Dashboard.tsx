import React, { useEffect, useRef, useState } from 'react';
import { ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

// Reusable hook-based component for scroll animations
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-950 scroll-smooth relative">
      {/* CSS Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-8">
        <ScrollReveal className="max-w-5xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8 tracking-wide uppercase backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            PrepAI 2.0 Live
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Crack the Code <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
              To Your Future.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The all-in-one workspace for technical interview preparation. <br className="hidden md:block"/>
            Master algorithms, system design, and behavioral rounds with AI.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate(ViewState.LIVE_INTERVIEW)}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-slate-200 transition-all flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Simulate Interview</span>
              <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button 
              onClick={() => onNavigate(ViewState.COURSES)}
              className="px-8 py-4 bg-transparent text-white border border-slate-700 rounded-full font-bold text-lg hover:border-slate-500 transition-all"
            >
              Browse Library
            </button>
          </div>
        </ScrollReveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-24">
        
        {/* Bento Grid Quick Actions */}
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Toolkit</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
            {/* Main Action - Large */}
            <div 
              onClick={() => onNavigate(ViewState.LIVE_INTERVIEW)}
              className="md:col-span-2 row-span-1 group relative bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer overflow-hidden p-8 flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Live Interview Mode</h3>
                <p className="text-slate-400 max-w-sm">Real-time speech-to-text analysis with AI feedback on your communication and technical accuracy.</p>
              </div>
              <div className="relative z-10 self-end">
                <span className="text-sm font-bold text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Start Session <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>

            {/* Quiz Action */}
            <div 
              onClick={() => onNavigate(ViewState.QUIZ)}
              className="row-span-1 group relative bg-slate-900 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden p-8 flex flex-col justify-between"
            >
               <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-600/20 transition-all"></div>
               <div>
                 <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4 border border-purple-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-white">Daily Quiz</h3>
               </div>
               <p className="text-sm text-slate-400">Sharpen your knowledge.</p>
            </div>

            {/* Courses Action */}
            <div 
              onClick={() => onNavigate(ViewState.COURSES)}
              className="row-span-1 group relative bg-slate-900 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden p-8 flex flex-col justify-between"
            >
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl -ml-10 -mb-10 group-hover:bg-emerald-600/20 transition-all"></div>
               <div>
                 <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 </div>
                 <h3 className="text-xl font-bold text-white">Roadmaps</h3>
               </div>
               <p className="text-sm text-slate-400">Guided learning paths.</p>
            </div>

            {/* Chatbot Action */}
            <div 
              onClick={() => onNavigate(ViewState.CHATBOT)}
              className="md:col-span-2 row-span-1 group relative bg-slate-900 rounded-3xl border border-slate-800 hover:border-orange-500/30 transition-all cursor-pointer overflow-hidden p-8 flex flex-row items-center justify-between"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10 flex items-center gap-6">
                 <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white mb-1">AI Tutor Assistant</h3>
                    <p className="text-slate-400 text-sm">Stuck on a problem? Get instant hints and code reviews.</p>
                 </div>
               </div>
               <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Diagnosis / Progress Section */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">Diagnosis</h2>
                <div className="flex gap-2">
                   <span className="w-3 h-3 rounded-full bg-red-500"></span>
                   <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                   <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <svg className="w-48 h-48 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                </div>

                <div className="space-y-8 relative z-10">
                  {/* Skill 1 */}
                  <div>
                    <div className="flex justify-between mb-2 text-sm font-medium">
                       <span className="text-white">Algorithms & Data Structures</span>
                       <span className="text-green-400">92%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[92%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div>
                    <div className="flex justify-between mb-2 text-sm font-medium">
                       <span className="text-white">System Design</span>
                       <span className="text-blue-400">45%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-[45%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div>
                    <div className="flex justify-between mb-2 text-sm font-medium">
                       <span className="text-white">Behavioral Patterns</span>
                       <span className="text-slate-500">0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-slate-700 w-[0%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex gap-6">
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Questions</p>
                        <p className="text-2xl font-mono text-white">128</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Time Spent</p>
                        <p className="text-2xl font-mono text-white">14h 32m</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Streak</p>
                        <p className="text-2xl font-mono text-orange-400">5 Days 🔥</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Activity</h2>
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex-grow relative overflow-hidden">
                 <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 items-start">
                       <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs border border-green-500/30 mt-1">✓</div>
                       <div>
                          <p className="text-slate-300 text-sm font-medium">Completed 'Arrays 101'</p>
                          <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs border border-blue-500/30 mt-1">●</div>
                       <div>
                          <p className="text-slate-300 text-sm font-medium">Mock Interview Scheduled</p>
                          <p className="text-xs text-slate-500 mt-1">Today, 8:00 PM</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs border border-purple-500/30 mt-1">?</div>
                       <div>
                          <p className="text-slate-300 text-sm font-medium">System Design Quiz Pending</p>
                          <p className="text-xs text-slate-500 mt-1">Due Tomorrow</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-12 text-center">
                    <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors">View Full History</button>
                 </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal>
           <footer className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
              <div>
                 <span className="text-2xl font-bold text-white tracking-tighter">PrepAI</span>
                 <p className="text-slate-500 text-sm mt-2">© 2024 PrepAI Inc. Built for engineers.</p>
              </div>
              <div className="flex gap-8 text-sm text-slate-400">
                 <span className="hover:text-white cursor-pointer">Terms</span>
                 <span className="hover:text-white cursor-pointer">Privacy</span>
                 <span className="hover:text-white cursor-pointer">Github</span>
                 <span className="hover:text-white cursor-pointer">Twitter</span>
              </div>
           </footer>
        </ScrollReveal>
      </div>
    </div>
  );
};