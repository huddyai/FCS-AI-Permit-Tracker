import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { Permit, Condition } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  permits: Permit[];
  conditions: Condition[];
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, permits, conditions }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your AI Permit Assistant. I can help you summarize permits, check for overdue conditions, or draft weekly digests. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Filter history for context window management (simple last 10 messages)
    const historyContext = messages.slice(-10);

    const response = await generateAIResponse(userMessage, permits, conditions, historyContext);
    
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Summarize permits with conditions due soon",
    "List all Overdue conditions",
    "Draft a weekly compliance digest",
    "Which permits are At Risk?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="h-16 px-6 bg-gradient-to-r from-fcs-dark to-slate-800 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center space-x-2">
            <Sparkles size={18} className="text-fcs-accent" />
            <h2 className="font-semibold tracking-wide">AI Assistant</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
               msg.role === 'user' 
                ? 'bg-fcs-teal text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
             }`}>
                {msg.role === 'model' && (
                  <div className="flex items-center space-x-1 mb-1 text-xs text-fcs-teal font-bold opacity-80">
                     <Bot size={12} /> <span>FCS AI</span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none">
                    {/* Basic rendering of newlines for markdown-like effect */}
                   {msg.content.split('\n').map((line, i) => (
                     <p key={i} className={line.startsWith('-') ? 'ml-2' : ''}>{line}</p>
                   ))}
                </div>
             </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 shadow-sm flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-fcs-teal" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (only if few messages) */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 bg-slate-50">
            <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Suggested Prompts</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => { setInput(s); }}
                        className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-fcs-teal hover:text-fcs-teal transition-colors"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }}
            placeholder="Ask anything about permits..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fcs-teal focus:bg-white resize-none text-sm"
            rows={2}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-fcs-teal text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
            AI generated content may be inaccurate. Verify important details.
        </p>
      </div>
    </div>
  );
};