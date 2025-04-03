'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

export default function Chatbox() {
  const [isThinking, setIsThinking] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    stop,
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
    if (status === 'streaming') {
      return stop();
    }

    e?.preventDefault();
    if (!input.trim()) return;
    setIsThinking(true);
    handleSubmit();
  };

  return (
    <div className="w-full h-screen sm:h-[35rem] my-auto bg-white flex flex-col max-w-md mx-auto sm:rounded-2xl sm:my-10 overflow-hidden">
      <div className="p-4 border-b bg-blue-500 text-white">
        <h1 className="text-lg font-semibold">AW AI Assistant</h1>
        <p className="text-sm tracking-wide">Sales Team</p>
      </div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  : 'bg-gray-200 text-gray-800 self-start mr-auto'
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
      <form
        onSubmit={handleSend}
        className="p-4 border-t flex items-center gap-2"
      >
        <input
          className="flex-1 border border-neutral-400 rounded-xl px-4 py-2 text-sm focus:outline-blue-400 placeholder:text-neutral-400 text-black"
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50"
          disabled={!input.trim() || status === 'streaming'}
        >
          {status === 'streaming' ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
