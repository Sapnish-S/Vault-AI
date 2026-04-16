import React from 'react';
import { motion } from 'motion/react';

export const TypingIndicator: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const dotVariants = {
    initial: { opacity: 0.3 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" as const, repeatType: "reverse" as const, repeat: Infinity } }
  };
  
  return (
    <div className="flex items-center gap-2 px-2 py-1 h-6">
      <span className={`text-sm font-light italic ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
        Vault AI is thinking
      </span>
      <div className="flex items-center gap-1.5 pt-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.2 }}
            className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/60' : 'bg-slate-400'}`}
          />
        ))}
      </div>
    </div>
  );
};
