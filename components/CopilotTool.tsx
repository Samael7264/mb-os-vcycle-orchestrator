import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export const CopilotTool: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am your AI engineering co-pilot. I can help you analyze code, generate tests, or explain complex logic. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm processing your request. Please check the specific tool dashboards for detailed analysis, or ask me to explain a specific concept." }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-indigo-800 text-white border-indigo-800' : 'bg-white text-gray-900 border-gray-200'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] p-4 rounded-xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-800 text-white' 
                : 'bg-gray-50 text-gray-800 border border-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            className="absolute right-1.5 top-1.5 bottom-1.5 p-2 bg-indigo-800 hover:bg-indigo-900 text-white rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  );
};
