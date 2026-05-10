'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Scanning your task list...",
  "Checking what AI can automate...",
  "Looking for your human advantage...",
  "Calculating your career moat..."
];

export default function LoadingState() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="relative w-24 h-24">
        {/* Core pulse */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50"
        />
        {/* Spinner rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-t-indigo-400 border-r-transparent border-b-blue-400 border-l-transparent rounded-full"
        />
      </div>
      
      <div className="h-8 relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute text-xl font-medium text-blue-200"
          >
            {messages[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-6 flex items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-xl px-5 py-3 text-sm text-gray-400 max-w-sm text-center"
      >
        <span className="text-yellow-400 text-base">⏳</span>
        <span>
          This may take <span className="text-gray-200 font-medium">up to a minute</span> — we&apos;re running a free, open-source AI model hosted by NVIDIA.
        </span>
      </motion.div>
    </div>
  );
}
