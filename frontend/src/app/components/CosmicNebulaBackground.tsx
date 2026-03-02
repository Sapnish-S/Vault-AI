import React, { useEffect, useRef } from 'react';

export const CosmicNebulaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // --- Configuration ---
    const starCount = 300;
    const mistLayers = 20;

    // --- State ---
    const stars: {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      phase: number;
      speed: number;
    }[] = [];

    const mists: {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      stretch: number;
      color: string;
      alpha: number;
    }[] = [];

    // --- Palette: Deep Space Nebula ---
    // Pure deep black background is handled by clearing the canvas
    // Colors for the nebula: soft blues, cyans, faint purples, white
    const mistPalette = [
      { r: 4, g: 14, b: 28 },      // Deepest Navy
      { r: 10, g: 30, b: 60 },     // Dark Blue
      { r: 30, g: 60, b: 100 },    // Mid Blue
      { r: 60, g: 120, b: 180 },   // Soft Blue
      { r: 100, g: 200, b: 255 },  // Cyan Highlight
      { r: 150, g: 50, b: 200 },   // Subtle Purple (very faint)
    ];

    const init = () => {
      // 1. Stars (Tiny particles)
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.98 ? Math.random() * 1.5 : Math.random() * 3, // mostly tiny, few bright
          baseAlpha: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.05,
        });
      }

      // 2. Nebula Mist (Large soft overlapping shapes)
      mists.length = 0;
      for (let i = 0; i < mistLayers; i++) {
        const color = mistPalette[Math.floor(Math.random() * mistPalette.length)];
        const isHighlight = Math.random() > 0.8;
        
        mists.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: (Math.random() * 300) + (width / 4), // Very large
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() - 0.5) * 0.002, // Very slow drift
          stretch: 1 + Math.random(), // Stretching for organic shape
          color: `rgba(${color.r}, ${color.g}, ${color.b}, ${isHighlight ? 0.05 : 0.02})`, // Very low opacity for additive blending
          alpha: Math.random(),
        });
      }
    };

    init();

    let time = 0;

    const render = () => {
      time += 0.01;
      
      // Clear to deep black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // --- Draw Nebula Mist (Background) ---
      // We use 'screen' or 'lighter' blend mode to accumulate light
      ctx.globalCompositeOperation = 'screen'; 

      mists.forEach(mist => {
        // Drifting motion
        mist.angle += mist.speed;
        mist.x += Math.cos(mist.angle) * 0.5;
        mist.y += Math.sin(mist.angle) * 0.5;

        // Wrap around
        if (mist.x < -mist.radius * 2) mist.x = width + mist.radius * 2;
        if (mist.x > width + mist.radius * 2) mist.x = -mist.radius * 2;
        if (mist.y < -mist.radius * 2) mist.y = height + mist.radius * 2;
        if (mist.y > height + mist.radius * 2) mist.y = -mist.radius * 2;

        ctx.save();
        ctx.translate(mist.x, mist.y);
        ctx.rotate(mist.angle * 0.5); // Internal rotation
        ctx.scale(mist.stretch, 1);   // Stretch to make it cloud-like

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, mist.radius);
        gradient.addColorStop(0, mist.color);
        gradient.addColorStop(0.6, mist.color.replace(/[\d.]+\)$/g, '0.01)'));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, mist.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // --- Volumetric Beams (Subtle Rays) ---
      // Simulating light shafts using large rotated gradients
      ctx.globalCompositeOperation = 'lighter';
      const beamCount = 3;
      for (let i = 0; i < beamCount; i++) {
          ctx.save();
          // Beams originating from top-centerish or drifting
          const angle = Math.PI / 4 + Math.sin(time * 0.5 + i) * 0.2; // Slight sway
          const beamWidth = 200 + Math.sin(time + i) * 50;
          
          ctx.translate(width / 2 + (i - 1) * 300, -100);
          ctx.rotate(angle);
          
          const beamGrad = ctx.createLinearGradient(0, 0, 0, height * 1.5);
          beamGrad.addColorStop(0, 'rgba(200, 230, 255, 0.03)');
          beamGrad.addColorStop(0.5, 'rgba(100, 150, 255, 0.01)');
          beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = beamGrad;
          ctx.fillRect(-beamWidth / 2, 0, beamWidth, height * 1.5);
          ctx.restore();
      }

      // --- Draw Stars (Foreground) ---
      ctx.globalCompositeOperation = 'source-over'; // Sharp stars
      
      stars.forEach(star => {
        // Twinkle
        const opacity = star.baseAlpha + Math.sin(time * 2 + star.phase) * 0.3;
        const finalOpacity = Math.max(0, Math.min(1, opacity));

        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow for larger stars
        if (star.size > 2) {
            ctx.fillStyle = `rgba(200, 220, 255, ${finalOpacity * 0.2})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none select-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};
