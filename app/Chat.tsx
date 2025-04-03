'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Chatbox() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' },
    { sender: 'user', text: 'I want to learn more about your services.' },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Thanks for your message. We’ll get back to you shortly!' },
      ]);
    }, 1000);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="w-full h-screen sm:h-[35rem] my-auto bg-white flex flex-col max-w-md mx-auto sm:rounded-2xl sm:my-10 overflow-hidden">
      <div className="p-4 border-b text-lg font-semibold bg-blue-500">AW AI Assistant</div>
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-fit max-w-[75%] break-words px-4 py-2 rounded-xl text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800 self-start mr-auto'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center gap-2">
        <input
          className="flex-1 border border-neutral-400 rounded-xl px-4 py-2 text-sm focus:outline-blue-400 placeholder:text-neutral-400 text-black"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
