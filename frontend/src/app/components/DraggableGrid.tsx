import React, { useState, useRef } from 'react';

export const DraggableGrid: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={gridRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 5,
      }}
      className="pointer-events-auto select-none"
    >
      <svg
        width="1583"
        height="661"
        viewBox="0 0 1583 661"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30 hover:opacity-50 transition-opacity"
      >
        <g clipPath="url(#clip0_3701_6620)">
          {Array.from({ length: 352 }).map((_, i) => {
            const yPos = -0.875 + i * 1.875;
            return (
              <rect
                key={i}
                width="1600"
                height="1.875"
                transform={`translate(-17 ${yPos})`}
                fill="white"
                fillOpacity="0.01"
              />
            );
          })}
        </g>
        <defs>
          <clipPath id="clip0_3701_6620">
            <rect width="1600" height="750" fill="white" transform="translate(-17 -89)" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
