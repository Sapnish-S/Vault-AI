import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface VectorLoadingProps {
  onComplete: () => void;
}

export const VectorLoading: React.FC<VectorLoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Refined Infinity Path - Voluminous and elegant Lemniscate shape
  // ViewBox: 0 0 300 150
  // Center: 150, 75
  // Designed with large, round loops for a premium, magical feel
  const infinityPath = "M 150,75 C 220,20 280,20 280,75 C 280,130 220,130 150,75 C 80,20 20,20 20,75 C 20,130 80,130 150,75 Z";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-12">
        {/* Infinity Symbol Container - Rectangular to fit the shape */}
        <div className="relative w-80 h-40 flex items-center justify-center">
          
          {/* Ambient Glow - Enhanced for magical atmosphere */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full blur-[50px]"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 197, 253, 0.15) 50%, transparent 80%)'
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Core Light Burst - Central intense glow */}
          <motion.div
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 rounded-full blur-[30px]"
             style={{
               background: 'radial-gradient(circle, rgba(96, 165, 250, 0.6) 0%, transparent 100%)'
             }}
             animate={{
               opacity: [0.5, 1, 0.5],
               scale: [0.8, 1.2, 0.8]
             }}
             transition={{
               duration: 2,
               repeat: Infinity,
               ease: "easeInOut"
             }}
          />

          {/* SVG Container */}
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 300 150"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))'
            }}
          >
            <defs>
              {/* Tapered Trail Gradient - Intense light to transparent */}
              <linearGradient id="taperedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
                <stop offset="15%" stopColor="#60a5fa" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#93c5fd" stopOpacity="1"/>
                <stop offset="85%" stopColor="#ffffff" stopOpacity="1"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
              </linearGradient>

              {/* Enhanced Glow Filter - Stronger Bloom */}
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feFlood floodColor="#3b82f6" floodOpacity="0.5" result="glowColor"/>
                <feComposite in="glowColor" in2="coloredBlur" operator="in" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Base Track - Subtle */}
            <path
              d={infinityPath}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
            />

            {/* Moving Glow Line - Main Light */}
            <motion.path
              d={infinityPath}
              fill="none"
              stroke="url(#taperedGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="120 600"
              filter="url(#neonGlow)"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -720 }} // Adjusted for longer path
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear", 
              }}
            />
            
            {/* Second brighter accent line for sparkle */}
            <motion.path
              d={infinityPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10 700"
              filter="url(#neonGlow)"
              initial={{ strokeDashoffset: -40 }}
              animate={{ strokeDashoffset: -760 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear", 
              }}
            />
          </svg>
        </div>

        {/* Loading Text - Minimalist & Futuristic */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2 className="text-xs font-semibold tracking-[0.3em] text-blue-100 uppercase drop-shadow-[0_0_15px_rgba(147,197,253,0.8)]">
              INSERTING FILES IN VECTOR DATABASE
            </h2>
          </motion.div>
          
          {/* Progress Bar Minimal */}
          <div className="w-56 h-0.5 bg-blue-900/40 rounded-full overflow-hidden mx-auto backdrop-blur-sm">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 shadow-[0_0_15px_#60a5fa]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          
          <p className="text-[10px] tracking-[0.3em] text-blue-400/70 font-mono">
            {Math.round(progress)}% COMPLETE
          </p>
        </motion.div>
      </div>
    </div>
  );
};
