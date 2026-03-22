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
    const mistLayers = 20;

    // --- State ---
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
      // Nebula Mist (Large soft overlapping shapes)
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
      
      // Reset composite operation to normal before clearing
      ctx.globalCompositeOperation = 'source-over';
      
      // Clear to a very slightly lighter dark shade instead of pure black
      ctx.fillStyle = '#05070A';
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
      // --- Cinematic Volumetric Beams (Improved) ---
ctx.globalCompositeOperation = 'screen'; // lighter보다 부드럽게 겹치는 screen 모드 권장

const beamCount = 3;
for (let i = 0; i < beamCount; i++) {
    ctx.save();
    
    // 빛의 근원지와 각도 설정
    const originX = width * 0.3 + (i * width * 0.2);
    const originY = -150;
    
    // 깜빡임 해결: 시간(time)을 활용한 부드러운 사인파 조도
    const softFlicker = 0.7 + Math.sin(time * 0.5 + i * 2) * 0.2; 
    const sway = Math.sin(time * 0.2 + i) * 0.1; // 아주 천천히 흔들림
    
    ctx.translate(originX, originY);
    ctx.rotate(Math.PI / 4 + sway);

    const baseWidth = 400 + i * 100;

    // 1. 외곽 글로우 (넓고 연하게)
    const glowGrad = ctx.createLinearGradient(0, 0, 0, height * 1.5);
    glowGrad.addColorStop(0, `rgba(130, 180, 255, ${0.08 * softFlicker})`);
    glowGrad.addColorStop(0.5, `rgba(100, 150, 255, ${0.02 * softFlicker})`);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.moveTo(-baseWidth / 2, 0);
    ctx.lineTo(baseWidth / 2, 0);
    ctx.lineTo(baseWidth * 1.8, height * 1.5); // 아래로 갈수록 퍼지게
    ctx.lineTo(-baseWidth * 0.8, height * 1.5);
    ctx.fill();

    // 2. 중심 코어 (좁고 선명하게)
    const coreGrad = ctx.createLinearGradient(0, 0, 0, height * 1.2);
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.15 * softFlicker})`);
    coreGrad.addColorStop(0.3, `rgba(180, 220, 255, ${0.05 * softFlicker})`);
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = coreGrad;
    ctx.fillRect(-baseWidth / 15, 0, baseWidth / 7.5, height * 1.2);

    // 3. 대기 입자 효과 (Dust Particles)
    // 빛 줄기 안에서만 먼지가 보이도록 간단히 구현
    for (let j = 0; j < 5; j++) {
        const px = (Math.random() - 0.5) * baseWidth;
        const py = Math.random() * height;
        const pSize = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * softFlicker})`;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#05070A] overflow-hidden pointer-events-none select-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
      />
    </div>
  );
};
