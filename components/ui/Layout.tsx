import React, { useState } from 'react';
import { 
  Search, Bell, Settings, Sparkles, X, Bot, Send, User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CopilotTool } from '../CopilotTool';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const navLinks = [
    { name: 'Homepage', path: '#' },
    { name: 'Dashboard', path: '/' },
    { name: 'V-Cycle Module', path: '#' },
    { name: 'Settings', path: '#' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] text-gray-900 font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 border-t-[4px] border-t-red-500 h-16 flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-500 tracking-tight">MB.OS</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-gray-500">
            {navLinks.map((link) => (
              link.path === '#' ? (
                <span 
                  key={link.name} 
                  className="text-gray-500 cursor-not-allowed hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </span>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`transition-colors hover:text-gray-900 ${location.pathname === link.path ? 'text-gray-900 font-bold' : ''}`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCopilotOpen(true)}
              aria-label="Open MB.OS Agent"
              className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>MB.OS Agent</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Jane+Engineer&background=312E81&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Floating Copilot Panel */}
      <div 
        className={`fixed bottom-24 right-6 w-[400px] h-[600px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isCopilotOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-indigo-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <span className="font-medium">MB.OS Copilot</span>
          </div>
          <button onClick={() => setIsCopilotOpen(false)} aria-label="Close MB.OS Copilot" className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          <CopilotTool />
        </div>
      </div>

      {/* Circular Launcher */}
      <button
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        aria-label={isCopilotOpen ? "Close MB.OS Copilot" : "Open MB.OS Copilot"}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors z-50 ${
          isCopilotOpen ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-indigo-800 hover:bg-indigo-900 text-white'
        }`}
      >
        {isCopilotOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </div>
  );
};
