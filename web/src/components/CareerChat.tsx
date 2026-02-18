import { useState, useRef, useEffect } from 'react';
import { careerChat } from '../api/client';
import { MarkdownContent } from './MarkdownContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CareerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setError('');
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const response = await careerChat(question);
      setMessages((m) => [...m, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Career Coach Chat</h2>
        <p className="text-slate-400 mt-1">Ask career questions. Answers are personalized from your resume.</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">e.g. What roles fit my experience? How can I improve my resume?</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownContent content={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700">
              <span className="text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a career question..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
