import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Loader } from 'lucide-react';
import { chatService } from '../services/api';

interface Message {
  message: string;
  response: string;
  timestamp: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getChatHistory();
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load chat history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await chatService.sendMessage(input);
      setMessages((prev) => [
        ...prev,
        {
          message: response.data.message,
          response: response.data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
      setInput('');
    } catch (error) {
      console.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold">College Guide Bot</h1>
        <p className="text-blue-100">Your personalized college advisor powered by AI</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to College Guide Bot! 👋</h2>
            <p className="text-gray-600 max-w-md">
              Ask me anything about colleges, courses, placements, fees, and find your perfect match!
            </p>
            <div className="mt-8 space-y-3 text-left">
              <p className="text-sm font-semibold text-gray-700">Example questions:</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✨ Which colleges are best for my profile?</li>
                <li>✨ What are the placement stats for CS at top colleges?</li>
                <li>✨ Suggest colleges under ₹15 lakhs in Maharashtra</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg">
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex justify-start items-end gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
                  <Bot size={24} />
                </div>
                <div className="max-w-xs lg:max-w-md bg-white p-4 rounded-2xl rounded-tl-none shadow-lg border-2 border-blue-100">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{msg.response}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-6 bg-white border-t-2 border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg sm:flex">
            <Bot size={30} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about colleges, courses, placements..."
            className="flex-1 p-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all duration-300"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};
