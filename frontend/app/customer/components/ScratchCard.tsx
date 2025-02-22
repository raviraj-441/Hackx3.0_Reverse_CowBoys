//ScratchCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScratchCard as ScratchCardType } from '../types';

interface ScratchCardProps {
  card: ScratchCardType;
  onClose: () => void;
  onClaim: (card: ScratchCardType) => void;
}

export function ScratchCard({ card, onClose, onClaim }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up the scratch overlay
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16px Inter';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here!', canvas.width / 2, canvas.height / 2);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent).clientX ?? (e as React.TouchEvent).touches[0].clientX;
    const y = (e as React.MouseEvent).clientY ?? (e as React.TouchEvent).touches[0].clientY;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x - rect.left, y - rect.top, 20, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }
    const newPercentage = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercentage(newPercentage);

    if (newPercentage > 50 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
    >
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
        <div className="p-4 border-b border-purple-500/20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Scratch & Win!</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          {!isRevealed ? (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className="w-full rounded-lg cursor-pointer"
                onMouseDown={() => setIsScratching(true)}
                onMouseUp={() => setIsScratching(false)}
                onMouseMove={(e) => isScratching && handleScratch(e)}
                onTouchStart={() => setIsScratching(true)}
                onTouchEnd={() => setIsScratching(false)}
                onTouchMove={(e) => isScratching && handleScratch(e)}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-purple-400/50 text-sm">Scratch to reveal your reward!</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h4 className="text-xl font-bold text-purple-400 mb-2">Congratulations! 🎉</h4>
              <p className="text-gray-300 mb-4">{card.description}</p>
              <div className="text-sm text-gray-400 mb-6">
                <p>Minimum order: ₹{card.minimumOrder}</p>
                <p>Expires in {card.expiresIn} hours</p>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => onClaim(card)}
              >
                Claim Reward
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}