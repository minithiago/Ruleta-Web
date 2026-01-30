
import React, { useRef, useEffect } from 'react';
import { Participant } from '../types';
import { CANVAS_SIZE } from '../constants';

interface WheelCanvasProps {
  participants: Participant[];
  rotation: number;
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({ participants, rotation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CANVAS_SIZE / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (participants.length === 0) {
      // Draw empty placeholder
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText('Añade nombres para empezar', centerX, centerY);
      return;
    }

    const angleStep = (Math.PI * 2) / participants.length;

    // Save state for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    participants.forEach((p, i) => {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw name
      ctx.save();
      ctx.rotate(startAngle + angleStep / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Poppins';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name, radius - 40, 6);
      ctx.restore();
    });

    // Draw center circle
    ctx.restore();
    
    // Draw outer ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.stroke();
    
    // Draw a small inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

  }, [participants, rotation]);

  return (
    <div className="relative canvas-container">
      {/* Indicator Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-8 h-10 bg-white clip-path-triangle shadow-lg flex items-center justify-center rounded-b-lg">
           <i className="fa-solid fa-caret-down text-indigo-600 text-2xl"></i>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE}
        className="max-w-full h-auto rounded-full"
      />
    </div>
  );
};

export default WheelCanvas;
