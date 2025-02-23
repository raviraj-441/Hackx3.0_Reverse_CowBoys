'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackendScratchCard {
  name: string;
  sku: string;
  category: string;
  starting_price: number;
  total_ordered: number;
  preparation_time: number;
  image_url: string;
  variations: {
    [key: string]: number;
  };
  claimed?: boolean; // Add the claimed status
}

export default function ScratchCardPage() {
  const [claimedScratchCards, setClaimedScratchCards] = useState<BackendScratchCard[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadClaimedScratchCards();
  }, []);

  const loadClaimedScratchCards = () => {
    // Load scratch cards from localStorage
    const savedScratchCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    setClaimedScratchCards(savedScratchCards);
  };

  const handleClaimScratchCard = (card: BackendScratchCard) => {
    // Update the claimed status in localStorage
    const updatedScratchCards = claimedScratchCards.map((c) =>
      c.sku === card.sku ? { ...c, claimed: true } : c
    );
    localStorage.setItem('scratchCards', JSON.stringify(updatedScratchCards));

    // Update the state
    setClaimedScratchCards(updatedScratchCards);

    // Show a success toast
    toast({
      title: '🎉 Reward Claimed!',
      description: `${card.name} has been added to your account.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-10 px-6 pt-28 flex flex-col items-center">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <Gift className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Your Scratch Cards</h1>
      </div>

      {/* Empty State */}
      {claimedScratchCards.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 text-lg mt-16">
          <Smile className="h-12 w-12 mb-3 text-purple-500" />
          <p className="text-center">You haven’t claimed any scratch cards yet.</p>
          <p className="text-sm text-gray-500">Claim rewards by participating in offers!</p>
        </div>
      ) : (
        <div className="grid w-full max-w-6xl gap-6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
          }}
        >
          {claimedScratchCards.map((card) => (
            <motion.div
              key={card.sku}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 shadow-lg rounded-2xl p-5 hover:shadow-purple-500/10 transition-all"
            >
              {/* Scratch Card Header */}
              <h3 className="text-lg font-semibold text-purple-400 mb-3">{card.name}</h3>

              {/* Card Details */}
              <div className="text-gray-300 text-sm space-y-2">
                <p>🎯 Minimum Order: ₹{card.starting_price}</p>
                <p>⏳ Preparation Time: {card.preparation_time} mins</p>
              </div>

              {/* Claim Button */}
              <div className="mt-4">
                {card.claimed ? (
                  <button
                    disabled
                    className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-md text-sm opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    ✅ Claimed
                  </button>
                ) : (
                  <button
                    onClick={() => handleClaimScratchCard(card)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
                  >
                    🎁 Claim Reward
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}