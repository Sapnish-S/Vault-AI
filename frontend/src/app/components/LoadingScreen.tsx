import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-20">
      {/* Deep Cosmic Background */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(88, 28, 135, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 60%, rgba(29, 78, 216, 0.1) 0%, transparent 50%),
            linear-gradient(to bottom, #000000, #020617)
          `
        }}
      />

      <div className="flex flex-col items-center gap-8">
        {/* Infinity Symbol (Möbius Strip) */}
        <div className="relative w-32 h-32">
          {/* Glow Background */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Infinity Symbol SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glowing Gradient */}
              <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="1">
                  <animate
                    attributeName="stop-color"
                    values="#a855f7; #6366f1; #3b82f6; #6366f1; #a855f7"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="50%" stopColor="#6366f1" stopOpacity="1">
                  <animate
                    attributeName="stop-color"
                    values="#6366f1; #3b82f6; #8b5cf6; #3b82f6; #6366f1"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="1">
                  <animate
                    attributeName="stop-color"
                    values="#3b82f6; #8b5cf6; #a855f7; #8b5cf6; #3b82f6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Animated Dash */}
              <linearGradient id="dashGradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Base Infinity Path */}
            <path
              d="M 50,50 C 50,30 30,20 20,30 C 10,40 10,60 20,70 C 30,80 50,70 50,50 C 50,30 70,20 80,30 C 90,40 90,60 80,70 C 70,80 50,70 50,50"
              transform="translate(50, 0) scale(1.8)"
              fill="none"
              stroke="url(#infinityGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.9"
            />

            {/* Animated Light Trail */}
            <motion.path
              d="M 50,50 C 50,30 30,20 20,30 C 10,40 10,60 20,70 C 30,80 50,70 50,50 C 50,30 70,20 80,30 C 90,40 90,60 80,70 C 70,80 50,70 50,50"
              transform="translate(50, 0) scale(1.8)"
              fill="none"
              stroke="url(#dashGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="20 80"
              filter="url(#glow)"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 400 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            className="text-sm tracking-[0.3em] font-light"
            style={{
              background: 'linear-gradient(90deg, #a855f7, #6366f1, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading...
          </motion.p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="text-xs text-purple-300/40 font-mono tracking-wider"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >
          {Math.floor(progress)}%
        </motion.div>
      </div>
    </div>
  );
};