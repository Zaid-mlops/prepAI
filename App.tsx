import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatBot } from './components/ChatBot';
import { LiveInterview } from './components/LiveInterview';
import { Courses } from './components/Courses';
import { Quiz } from './components/Quiz';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.CHATBOT:
        return <div className="h-full p-6"><ChatBot /></div>;
      case ViewState.LIVE_INTERVIEW:
        return <LiveInterview />;
      case ViewState.COURSES:
        return <Courses />;
      case ViewState.QUIZ:
        return <Quiz />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <nav className="w-20 md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-20">
        <div>
          <div className="p-6 flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="hidden md:block text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">PrepAI</span>
          </div>
          
          <ul className="space-y-2 px-3">
            <li>
              <button 
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === ViewState.DASHBOARD ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
                <span className="hidden md:block ml-3">Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView(ViewState.LIVE_INTERVIEW)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === ViewState.LIVE_INTERVIEW ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🎤</span>
                <span className="hidden md:block ml-3">Live Interview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView(ViewState.QUIZ)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === ViewState.QUIZ ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                <span className="hidden md:block ml-3">Quiz Mode</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView(ViewState.COURSES)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === ViewState.COURSES ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📚</span>
                <span className="hidden md:block ml-3">Learning Paths</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setCurrentView(ViewState.CHATBOT)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === ViewState.CHATBOT ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                <span className="hidden md:block ml-3">AI Coach</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer">
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-slate-700"></div>
             <div className="hidden md:block">
               <p className="text-sm font-semibold text-white">Alex Candidate</p>
               <p className="text-xs text-slate-500">Pro Plan</p>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden bg-slate-900 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
        {renderView()}
      </main>
    </div>
  );
}

export default App;