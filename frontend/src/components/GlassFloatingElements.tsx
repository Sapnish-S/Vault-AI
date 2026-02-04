import { ImageWithFallback } from './figma/ImageWithFallback';

interface GlassFloatingElementsProps {
  isInteracting: boolean;
}

export function GlassFloatingElements({ isInteracting }: GlassFloatingElementsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${isInteracting ? 'interaction-glow' : ''}`}>
      {/* Large glass crystal - center */}
      <div className="glass-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-40">
        <div className="relative w-full h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1618018353764-685cb47681d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdsYXNzJTIwY3J5c3RhbCUyMHByaXNtJTIwbGlnaHR8ZW58MXx8fHwxNzcwMDY4MTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt=""
            className="w-full h-full object-contain mix-blend-screen opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-blue-500/20 mix-blend-overlay rounded-full blur-3xl" />
        </div>
      </div>

      {/* Floating sphere - top right */}
      <div
        className="glass-element absolute top-[15%] right-[20%] w-48 h-48 opacity-30"
        style={{ animationDelay: '1.5s', animationDuration: '14s' }}
      >
        <div className="relative w-full h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1763259109352-2aa554d8a5ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9hdGluZyUyMGdsYXNzJTIwc3BoZXJlJTIwdHJhbnNwYXJlbnR8ZW58MXx8fHwxNzcwMDY4MTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt=""
            className="w-full h-full object-cover mix-blend-screen opacity-70 rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/30 to-cyan-400/30 mix-blend-overlay rounded-full blur-2xl" />
        </div>
      </div>

      {/* Ethereal light - bottom left */}
      <div
        className="glass-element absolute bottom-[20%] left-[15%] w-64 h-64 opacity-25"
        style={{ animationDelay: '3s', animationDuration: '16s' }}
      >
        <div className="relative w-full h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1767035046801-4139be256968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMGxpZ2h0JTIwcmVmcmFjdGlvbiUyMGJsdWV8ZW58MXx8fHwxNzcwMDY4MTg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt=""
            className="w-full h-full object-cover mix-blend-screen opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-violet-500/20 mix-blend-overlay rounded-full blur-3xl" />
        </div>
      </div>

      {/* Abstract glass capsules - pure CSS */}
      <div
        className="glass-capsule absolute top-[25%] left-[25%] w-32 h-48"
        style={{ animationDelay: '0.8s', animationDuration: '15s' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent backdrop-blur-sm border border-white/5" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-transparent blur-xl" />
      </div>

      <div
        className="glass-capsule absolute top-[60%] right-[15%] w-24 h-32 rotate-45"
        style={{ animationDelay: '2.2s', animationDuration: '13s' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-b from-violet-500/10 via-blue-500/5 to-transparent backdrop-blur-sm border border-white/5" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-violet-400/20 to-transparent blur-xl" />
      </div>

      <div
        className="glass-capsule absolute bottom-[30%] left-[35%] w-20 h-40 -rotate-12"
        style={{ animationDelay: '4s', animationDuration: '17s' }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-500/8 via-cyan-500/5 to-transparent backdrop-blur-sm border border-white/5" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/15 to-transparent blur-xl" />
      </div>

      {/* Glass shards - geometric */}
      <div
        className="glass-shard absolute top-[40%] left-[10%] w-16 h-24 opacity-20"
        style={{ animationDelay: '1.8s', animationDuration: '18s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-violet-500/10 backdrop-blur-md"
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
      </div>

      <div
        className="glass-shard absolute bottom-[15%] right-[25%] w-20 h-28 opacity-15 rotate-180"
        style={{ animationDelay: '3.5s', animationDuration: '20s' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-blue-500/10 backdrop-blur-md"
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} />
      </div>

      {/* Ambient particles - slower, more subtle */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full bg-cyan-400/30 blur-sm"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${12 + Math.random() * 6}s`,
          }}
        />
      ))}

    </div>
  );
}