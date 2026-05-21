import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader, MessageCircle, Send, X } from 'lucide-react';
import { chatService } from '../services/api';

interface Message {
  message: string;
  response: string;
  timestamp: string;
}

export const FloatingChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || historyLoaded) return;

    const loadHistory = async () => {
      try {
        const response = await chatService.getChatHistory();
        setMessages(response.data.slice().reverse());
      } catch {
        console.error('Failed to load chat history');
      } finally {
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, [historyLoaded, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nextMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(nextMessage);
      setMessages((prev) => [
        ...prev,
        {
          message: response.data.message,
          response: response.data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      console.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[min(640px,75vh)] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-semibold">College Guide Bot</p>
                <p className="text-xs text-gray-300">Ask about any shortlist</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.length === 0 ? (
              <div className="rounded-lg border border-blue-100 bg-white p-4 text-sm text-gray-700">
                Ask me to compare two colleges, explain cutoff chances, estimate budget fit, or shortlist options from your results.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={`${msg.timestamp}-${index}`} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[82%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">
                      {msg.message}
                    </div>
                  </div>
                  <div className="flex justify-start gap-2">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
                      <Bot size={16} />
                    </div>
                    <div className="max-w-[82%] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed text-gray-800">
                      <p className="whitespace-pre-line">{msg.response}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your results..."
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
              aria-label="Send message"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow-xl transition hover:scale-105"
        aria-label="Open college guide bot"
      >
        {open ? <X size={28} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
};
