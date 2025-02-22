// app/customer/scratchcards/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ScratchCard } from '../components/ScratchCard';
import { scratchCards } from '../data';

export default function ScratchCardsPage() {
  const [currentScratchCard, setCurrentScratchCard] = useState(null);
  const [showScratchCard, setShowScratchCard] = useState(false);

  useEffect(() => {
    if (!currentScratchCard) {
      const randomCard = scratchCards[Math.floor(Math.random() * scratchCards.length)];
      setCurrentScratchCard(randomCard);
      setShowScratchCard(true);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-white mb-6">Your Daily Scratch Card</h1>
      {showScratchCard && currentScratchCard && (
        <ScratchCard
          card={currentScratchCard}
          onClose={() => setShowScratchCard(false)}
          onClaim={() => setShowScratchCard(false)}
        />
      )}
    </div>
  );
}
