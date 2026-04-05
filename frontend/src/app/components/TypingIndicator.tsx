import React from 'react';
import { motion } from 'motion/react';

export const TypingIndicator: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const dotVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" as const, repeatType: "reverse" as const, repeat: Infinity } }
  };
  
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 h-6">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: i * 0.2 }}
          className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/60' : 'bg-slate-400'}`}
        />
      ))}
    </div>
  );
};
