'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { LoaderCircle, SendHorizonal } from 'lucide-react';
import mobile  from 'is-mobile';

export default function Chatbox() {
  const [isThinking, setIsThinking] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      { 
        id: 'initial-message', 
        role: 'assistant', 
        content: `👋 Welcome! You’re chatting with The Sales Team behind **Affiliate World Conferences**. Whether you’re looking to attend, exhibit, or sponsor — we’ll guide you toward the best opportunities for your business.   
          How can I help you today?`
      },
    ],
    onFinish: () => {
      setIsThinking(false)
    },
  });

  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setIsThinking(true);
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !mobile()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden
      bg-white border-0 sm:border border-border max-w-md sm:rounded-2xl shadow-none sm:shadow-xl">
      <div className="p-4 bg-blue-500 text-white">
        <h1 className="text-lg font-semibold">AW AI Assistant</h1>
        <p className="text-sm tracking-wide">Sales Team</p>
      </div>
      <div 
        ref={chatRef} 
        aria-label="scroll box" 
        className="flex-1 max-h-[calc(100dvh_-_13rem)] sm:max-h-[calc(100dvh_-_15rem)] overflow-y-auto p-4 space-y-3"
      >
        {messages.map((msg, idx) => {
          if (!msg.content) return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`w-fit max-w-[75%] break-words px-4 py-2 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-slate-100 text-gray-800 self-start mr-auto'
              }`}
            >
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
            </motion.div>
          )
        })}

        {/* The AI is thinking */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-fit max-w-[75%] break-words px-4 py-2 rounded-xl text-sm bg-gray-200 text-gray-800 self-start mr-auto"
          >
            <span className="animate-pulse">Thinking...</span>
          </motion.div>
        )}
      </div>
      {error && (
        <div className="bg-red-500 text-white text-sm text-center p-1">
          <span>An error occurred. </span>
          <button type="button" className="underline cursor-pointer" onClick={() => reload()}>
            Retry
          </button>
        </div>
      )}
      <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-2">
        <textarea
          className="flex-1 text-base border border-border rounded-xl px-4 py-2 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          rows={1}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 not-disabled:hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
          disabled={!input.trim() || status === 'streaming'}
        >
          {status === 'streaming' ? (
            <LoaderCircle size={26} className="animate-spin" />
          ) : (
            <SendHorizonal size={26} />
          )}
        </button>
      </form>
    </div>
  );
}
